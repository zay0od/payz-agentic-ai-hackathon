import { FinancialData, Transaction, AIFinancialAnalysis, SpendingPattern, AIRecommendation } from './types';

// Constants for AI rules
const SAVINGS_TARGET_PERCENTAGE = 0.20; // Target to save 20% of income
const EMERGENCY_FUND_MIN = 10000; // Minimum emergency fund
const PLAY_POT_PERCENTAGE = 0.10; // Target 10% of income for discretionary spending
const MIN_CHECKING_BALANCE = 5000; // Minimum checking account balance to maintain

// Helper function to get transactions within a specified time range
function getTransactionsInRange(
  transactions: Transaction[], 
  startDate: string, 
  endDate: string
): Transaction[] {
  console.log('getTransactionsInRange called with:');
  console.log('startDate:', startDate);
  console.log('endDate:', endDate);
  console.log('First 3 transaction dates:', transactions.slice(0, 3).map(t => t.date));
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  console.log('Parsed dates for comparison:');
  console.log('start date:', start.toISOString());
  console.log('end date:', end.toISOString());
  
  const filtered = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    const isInRange = transactionDate >= start && transactionDate <= end;
    if (isInRange && transactions.indexOf(t) < 3) {
      console.log(`Transaction date ${t.date} parsed as ${transactionDate.toISOString()} is in range`);
    }
    return isInRange;
  });
  
  console.log(`Found ${filtered.length} transactions in range out of ${transactions.length} total`);
  return filtered;
}

// Calculate total income and expenses for a given time period
function calculateFinancialSummary(transactions: Transaction[], startDate: string, endDate: string) {
  console.log('calculateFinancialSummary called with date range:', startDate, 'to', endDate);
  const periodTransactions = getTransactionsInRange(transactions, startDate, endDate);
  
  // Calculate income based on type field
  const income = periodTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  // Calculate expenses based on type field
  const expenses = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  console.log('Income transactions count:', periodTransactions.filter(t => t.type === 'income').length);
  console.log('Expense transactions count:', periodTransactions.filter(t => t.type === 'expense').length);
  console.log('Calculated income:', income);
  console.log('Calculated expenses:', expenses);
    
  const expensesByCategory = periodTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as {[key: string]: number});
    
  return {
    income,
    expenses,
    expensesByCategory,
    netCashflow: income - expenses,
    savingsRate: income > 0 ? (income - expenses) / income : 0
  };
}

// Analyze spending patterns
function analyzeSpendingPatterns(
  financialData: FinancialData, 
  months: number = 6
): SpendingPattern[] {
  const transactions = financialData.transactions;
  const today = new Date();
  const patterns: SpendingPattern[] = [];
  
  // Get all expense categories
  const categories = Array.from(new Set(
    transactions
      .filter(t => t.type === 'expense')
      .map(t => t.category)
  ));
  
  // For each category, analyze pattern
  for (const category of categories) {
    const categoryTransactions = transactions.filter(t => 
      t.type === 'expense' && 
      t.category === category
    );
    
    // Skip if not enough transactions
    if (categoryTransactions.length < 2) continue;
    
    // Calculate monthly averages
    const monthlySums: {[key: string]: number} = {};
    
    for (const transaction of categoryTransactions) {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      monthlySums[monthKey] = (monthlySums[monthKey] || 0) + transaction.amount;
    }
    
    const monthlyValues = Object.values(monthlySums);
    const average = monthlyValues.reduce((sum, val) => sum + val, 0) / monthlyValues.length;
    
    // Calculate variability (coefficient of variation)
    const squaredDiffs = monthlyValues.map(val => Math.pow(val - average, 2));
    const standardDeviation = Math.sqrt(squaredDiffs.reduce((sum, val) => sum + val, 0) / monthlyValues.length);
    const variability = standardDeviation / average;
    
    // Determine trend
    const trend = determineTrend(monthlyValues);
    
    // Determine importance
    let importance: 'essential' | 'variable' | 'discretionary' = 'variable';
    if (['Housing', 'Groceries', 'Utilities'].includes(category)) {
      importance = 'essential';
    } else if (['Entertainment', 'Self-care', 'Dining'].includes(category)) {
      importance = 'discretionary';
    }
    
    patterns.push({
      category,
      average_monthly: average,
      trend,
      variability: Math.min(variability, 1), // Cap at 1 for simplicity
      importance
    });
  }
  
  return patterns;
}

// Helper to determine trend
function determineTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
  if (values.length < 3) return 'stable';
  
  // Simple linear regression
  const xValues = Array.from({length: values.length}, (_, i) => i);
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / xValues.length;
  const yMean = values.reduce((sum, y) => sum + y, 0) / values.length;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < values.length; i++) {
    numerator += (xValues[i] - xMean) * (values[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  
  // Determine trend based on slope
  if (slope > 0.05 * yMean) return 'increasing';
  if (slope < -0.05 * yMean) return 'decreasing';
  return 'stable';
}

// Generate AI recommendations
function generateRecommendations(
  financialData: FinancialData, 
  patterns: SpendingPattern[] 
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];
  const { transactions, accounts, persona } = financialData;
  
  // Get recent financial summary (last month)
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const summary = calculateFinancialSummary(
    transactions, 
    oneMonthAgo.toISOString().split('T')[0], 
    today.toISOString().split('T')[0]
  );
  
  // Get accounts
  const checkingAccount = accounts.find(a => a.type === 'Checking');
  const savePotAccount = accounts.find(a => a.type === 'Save Pot');
  const playPotAccount = accounts.find(a => a.type === 'Play Pot');
  
  if (!checkingAccount || !savePotAccount || !playPotAccount) {
    throw new Error('Required accounts not found');
  }
  
  // Calculate ideal savings allocation
  const targetSavings = summary.income * SAVINGS_TARGET_PERCENTAGE;
  const actualSavings = summary.income - summary.expenses;
  const checkingBalance = checkingAccount.balance;
  
  // Get mortgage goal
  const mortgageGoal = persona.goals.find(g => g.goal_id === 'MORTGAGE_SAVINGS');
  
  // 1. Savings Allocation Recommendation
  if (actualSavings > 0) {
    // Determine how much to allocate to savings vs. play pot
    let savingsAllocation = Math.min(
      actualSavings * 0.8, // Default 80% of extra cash goes to savings
      checkingBalance - MIN_CHECKING_BALANCE // Don't go below minimum checking balance
    );
    
    // Adjust if we're falling behind on mortgage goal (if exists)
    if (mortgageGoal) {
      const timeToGoalInMonths = Math.ceil(
        (new Date(mortgageGoal.target_date).getTime() - today.getTime()) / 
        (30 * 24 * 60 * 60 * 1000)
      );
      
      const monthlyNeeded = (mortgageGoal.target_amount - mortgageGoal.current_amount) / timeToGoalInMonths;
      
      if (savingsAllocation < monthlyNeeded && checkingBalance > MIN_CHECKING_BALANCE + monthlyNeeded) {
        // Try to meet the monthly goal if possible
        savingsAllocation = monthlyNeeded;
      }
    }
    
    // Don't allocate negative amounts
    savingsAllocation = Math.max(savingsAllocation, 0);
    
    if (savingsAllocation > 0) {
      recommendations.push({
        recommendation_id: `REC_SAVE_${Date.now()}`,
        date: today.toISOString().split('T')[0],
        type: 'savings_allocation',
        description: `Transfer ${savingsAllocation.toFixed(2)} AED to Save Pot`,
        amount: savingsAllocation,
        reason: 'Optimal savings allocation based on current income, expenses, and goals',
        implemented: false
      });
    }
    
    // 2. Play Pot Allocation (if we have extra after savings)
    const leftover = actualSavings - savingsAllocation;
    const playPotAllocation = Math.min(
      leftover * 0.5, // Give half of remaining to play pot
      summary.income * PLAY_POT_PERCENTAGE // But cap at target percentage
    );
    
    if (playPotAllocation > 0) {
      recommendations.push({
        recommendation_id: `REC_PLAY_${Date.now()}`,
        date: today.toISOString().split('T')[0],
        type: 'savings_allocation',
        description: `Transfer ${playPotAllocation.toFixed(2)} AED to Play Pot`,
        amount: playPotAllocation,
        reason: 'Allocation for discretionary spending based on your recent financial performance',
        implemented: false
      });
    }
  }
  
  // 3. Spending Alerts
  for (const pattern of patterns) {
    // Alert on rapidly increasing variable or discretionary expenses
    if (
      pattern.trend === 'increasing' && 
      pattern.importance !== 'essential' &&
      pattern.variability > 0.3 // Only alert on highly variable categories
    ) {
      recommendations.push({
        recommendation_id: `REC_ALERT_${Date.now()}_${pattern.category.replace(/\s/g, '')}`,
        date: today.toISOString().split('T')[0],
        type: 'spending_alert',
        description: `Your ${pattern.category} spending is trending upward`,
        reason: `${pattern.category} spending has increased and is showing high variability. Consider reviewing these expenses.`,
        implemented: false
      });
    }
  }
  
  // 4. Special recommendation for large upcoming expenses
  // Look for school fees pattern based on historical data
  const schoolFeePattern = patterns.find(p => p.category === 'School Fees');
  if (schoolFeePattern) {
    const nextSchoolFeeMonths = [1, 5, 9]; // Months when school fees typically occur
    const currentMonth = today.getMonth() + 1;
    
    // Find next school fee month
    const nextFeeMonth = nextSchoolFeeMonths.find(m => m > currentMonth) || nextSchoolFeeMonths[0];
    const monthsToNextFee = nextFeeMonth > currentMonth 
      ? nextFeeMonth - currentMonth 
      : 12 - currentMonth + nextFeeMonth;
    
    if (monthsToNextFee <= 2) { // If school fees are coming up in the next 2 months
      recommendations.push({
        recommendation_id: `REC_PREP_${Date.now()}`,
        date: today.toISOString().split('T')[0],
        type: 'goal_adjustment',
        description: `Prepare for upcoming school fees`,
        amount: schoolFeePattern.average_monthly,
        reason: `School fees of approximately ${schoolFeePattern.average_monthly.toFixed(2)} AED will be due in ${monthsToNextFee} months. Consider setting aside funds now.`,
        implemented: false
      });
    }
  }
  
  return recommendations;
}

// Calculate months to goal and forecast
function calculateGoalForecast(financialData: FinancialData): { 
  months_to_goal: number;
  projected_savings: number;
  confidence: number;
} {
  const { transactions, accounts, persona } = financialData;
  
  // Get mortgage goal
  const mortgageGoal = persona.goals.find(g => g.goal_id === 'MORTGAGE_SAVINGS');
  if (!mortgageGoal) {
    return { months_to_goal: 0, projected_savings: 0, confidence: 0 };
  }
  
  // Get save pot account
  const savePotAccount = accounts.find(a => a.type === 'Save Pot');
  if (!savePotAccount) {
    return { months_to_goal: 0, projected_savings: 0, confidence: 0 };
  }
  
  // Calculate average monthly savings over last 3 months
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  
  const summary = calculateFinancialSummary(
    transactions, 
    threeMonthsAgo.toISOString().split('T')[0], 
    today.toISOString().split('T')[0]
  );
  
  // Monthly savings rate (assume same going forward)
  const monthlyNetCashflow = summary.netCashflow / 3; // Average over 3 months
  
  // Current progress
  const currentAmount = savePotAccount.balance;
  const remainingAmount = mortgageGoal.target_amount - currentAmount;
  
  // Months to goal (if positive cashflow)
  const monthsToGoal = monthlyNetCashflow > 0 
    ? Math.ceil(remainingAmount / monthlyNetCashflow) 
    : 999; // If negative cashflow, use large number
  
  // Target date
  const targetDate = new Date(mortgageGoal.target_date);
  const monthsToTargetDate = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (30 * 24 * 60 * 60 * 1000)
  );
  
  // Projected savings by target date
  const projectedSavings = currentAmount + (monthlyNetCashflow * monthsToTargetDate);
  
  // Confidence calculation - simple version
  // 1.0 if projected to meet or exceed goal, decreasing as we fall short
  const confidence = Math.min(1.0, projectedSavings / mortgageGoal.target_amount);
  
  return {
    months_to_goal: monthsToGoal,
    projected_savings: projectedSavings,
    confidence
  };
}

// Main function to perform AI analysis
export function performFinancialAnalysis(financialData: FinancialData): AIFinancialAnalysis {
  console.log('========== performFinancialAnalysis started ==========');
  console.log('Transaction count:', financialData.transactions.length);
  console.log('Sample transaction dates (first 5):', financialData.transactions.slice(0, 5).map(t => t.date));
  console.log('Sample transaction types (first 5):', financialData.transactions.slice(0, 5).map(t => t.type));
  
  // Get monthly overview
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  console.log('Today date:', today);
  console.log('One month ago date:', oneMonthAgo);
  
  const summary = calculateFinancialSummary(
    financialData.transactions, 
    oneMonthAgo.toISOString().split('T')[0], 
    today.toISOString().split('T')[0]
  );
  
  // Analyze spending patterns
  const patterns = analyzeSpendingPatterns(financialData);
  
  // Generate recommendations
  const recommendations = generateRecommendations(financialData, patterns);
  
  // Calculate goal forecast
  const forecast = calculateGoalForecast(financialData);
  
  // Build the analysis object
  const result = {
    user_id: financialData.persona.name, // Using name as ID for simplicity
    analysis_date: today.toISOString().split('T')[0],
    monthly_overview: {
      total_income: summary.income,
      total_expenses: summary.expenses,
      savings_rate: summary.savingsRate,
      discretionary_spending: summary.expensesByCategory['Entertainment'] || 0
    },
    spending_patterns: patterns,
    recommendations,
    forecast
  };
  
  console.log('Analysis result - monthly_overview:', result.monthly_overview);
  console.log('========== performFinancialAnalysis ended ==========');
  
  return result;
}