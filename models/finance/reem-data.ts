import { FinancialData, Transaction, Account } from './types';

// Helper function to generate a random amount within a percentage variation
function generateRandomAmount(baseAmount: number, variationPercentage: number): number {
  const variation = baseAmount * (variationPercentage / 100);
  const min = baseAmount - variation;
  const max = baseAmount + variation;
  return Math.random() * (max - min) + min;
}

// Helper to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Format a date to YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Configuration for Reem - 45-year-old executive in DIFC with fluctuating luxury spending
const reemConfig = {
  // High income executive
  baseSalary: 65000, // High base salary for executive position
  salaryDay: 1, // Day of month salary arrives
  
  // Bonuses are more frequent and larger due to executive position
  bonusChance: 0.30, // 30% chance each quarter (higher than others)
  bonusAmountBase: 20000, // Larger bonuses
  bonusVariation: 40, // Higher variation in bonus amounts
  
  // Housing expenses
  housingCost: 15000, // Luxury apartment in DIFC
  housingCostDay: 2,
  
  // Utilities
  utilityBase: 2000, // Higher due to larger space
  utilityVariation: 15,
  utilityDay: 10,
  
  // Seasonal expenditures
  seasonalExpensesBase: 25000, // High seasonal expenses (travel, fashion)
  seasonalExpensesVariation: 50, // Very high variability
  seasonalExpensesChance: {
    // Higher in certain months (fashion seasons, holiday periods)
    winter: 0.9, // Dec-Feb (winter holidays, shopping)
    spring: 0.6, // Mar-May (spring fashion)
    summer: 0.7, // Jun-Aug (summer holidays)
    fall: 0.7, // Sep-Nov (fall fashion)
  },
  
  // Dining
  diningBase: 4000, // High-end dining
  diningVariation: 30,
  diningTransactionsPerMonth: 6, // Frequent dining out
  
  // Shopping
  shoppingBase: 10000, // Luxury shopping
  shoppingVariation: 60, // Very variable
  shoppingTransactionsPerMonth: 3, // Multiple shopping trips monthly
  
  // Self-care and wellness
  wellnessBase: 5000, // Premium wellness services
  wellnessVariation: 30,
  wellnessTransactionsPerMonth: 2,
  
  // Investments
  investmentContributionBase: 15000, // Regular investments
  investmentVariation: 40,
  investmentDay: 5,
  investmentTransactionChance: 0.7 // Not every month
};

// Generate seasonal expenses for Reem (travel, fashion events, etc.)
function generateSeasonalExpenses(monthStartDate: Date): Transaction[] {
  const transactions: Transaction[] = [];
  const month = monthStartDate.getMonth();
  
  // Determine season
  let season: 'winter' | 'spring' | 'summer' | 'fall';
  
  if (month >= 0 && month <= 2) {
    season = 'winter';
  } else if (month >= 3 && month <= 5) {
    season = 'spring';
  } else if (month >= 6 && month <= 8) {
    season = 'summer';
  } else {
    season = 'fall';
  }
  
  // Check if a seasonal expense occurs this month
  if (Math.random() < reemConfig.seasonalExpensesChance[season]) {
    const seasonalDate = new Date(monthStartDate);
    seasonalDate.setDate(15 + Math.floor(Math.random() * 10)); // Random day in middle-end of month
    
    // Determine expense type and description based on season
    let expenseType: string;
    let description: string;
    
    if (season === 'winter') {
      expenseType = Math.random() > 0.5 ? 'Travel' : 'Shopping';
      description = expenseType === 'Travel' ? 'Winter Holiday to Europe' : 'Winter Fashion Shopping';
    } else if (season === 'spring') {
      expenseType = Math.random() > 0.6 ? 'Fashion' : 'Events';
      description = expenseType === 'Fashion' ? 'Spring Collection Shopping' : 'Charity Gala Event';
    } else if (season === 'summer') {
      expenseType = Math.random() > 0.4 ? 'Travel' : 'Entertainment';
      description = expenseType === 'Travel' ? 'Summer Vacation' : 'Summer Entertainment';
    } else { // fall
      expenseType = Math.random() > 0.5 ? 'Fashion' : 'Events';
      description = expenseType === 'Fashion' ? 'Fall Collection Shopping' : 'Art Exhibition & Events';
    }
    
    // Generate amount with high variability
    const seasonalAmount = generateRandomAmount(
      reemConfig.seasonalExpensesBase, 
      reemConfig.seasonalExpensesVariation
    );
    
    transactions.push({
      transaction_id: `S${season.charAt(0).toUpperCase()}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: formatDate(seasonalDate),
      account_id: "ACC_CHECKING_REEM",
      type: "expense",
      amount: seasonalAmount,
      category: expenseType,
      description: description,
      balance_after: 0 // Will be updated later
    });
  }
  
  return transactions;
}

// Main simulation function
export function simulateReemData(numMonths: number = 12): FinancialData {
  // Changed to make sure we generate data that includes the current month
  const endDate = new Date(); // Current date
  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - numMonths + 1); // Start date is numMonths before current date
  startDate.setDate(1); // Set to the first day of that month
  
  let currentDate = new Date(startDate);
  const transactions: Transaction[] = [];
  let transactionIdCounter = 1;

  // Initial state
  let checkingBalance = 50000; // Higher starting balance for executive
  let savePotBalance = 200000; // Significant savings already
  let playPotBalance = 30000; // Higher discretionary fund

  // Calculate number of months to simulate
  const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                       endDate.getMonth() - startDate.getMonth() + 1;
                       
  for (let month = 0; month < totalMonths; month++) {
    const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // --- Income ---
    // 1. Salary (high and consistent)
    const salaryDate = new Date(monthStartDate);
    salaryDate.setDate(reemConfig.salaryDay);
    const salaryAmount = reemConfig.baseSalary;
    checkingBalance += salaryAmount;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(salaryDate),
      account_id: "ACC_CHECKING_REEM",
      type: "income",
      amount: salaryAmount,
      category: "Salary",
      description: "Monthly Executive Salary",
      balance_after: checkingBalance
    });

    // 2. Quarterly Bonus (higher chance and amount than others)
    if ([2, 5, 8, 11].includes(monthStartDate.getMonth()) && Math.random() < reemConfig.bonusChance) {
      const bonusAmount = generateRandomAmount(reemConfig.bonusAmountBase, reemConfig.bonusVariation);
      const bonusDate = new Date(monthStartDate);
      bonusDate.setDate(28); // End of month bonus
      checkingBalance += bonusAmount;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(bonusDate),
        account_id: "ACC_CHECKING_REEM",
        type: "income",
        amount: bonusAmount,
        category: "Bonus",
        description: "Executive Performance Bonus",
        balance_after: checkingBalance
      });
    }

    // --- Fixed & Recurring Expenses ---
    // 1. Housing (luxury apartment)
    const housingDate = new Date(monthStartDate);
    housingDate.setDate(reemConfig.housingCostDay);
    checkingBalance -= reemConfig.housingCost;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(housingDate),
      account_id: "ACC_CHECKING_REEM",
      type: "expense",
      amount: reemConfig.housingCost,
      category: "Housing",
      description: "DIFC Luxury Apartment",
      balance_after: checkingBalance
    });

    // 2. Utilities (higher than average)
    const utilityDate = new Date(monthStartDate);
    utilityDate.setDate(reemConfig.utilityDay);
    const utilityAmount = generateRandomAmount(reemConfig.utilityBase, reemConfig.utilityVariation);
    checkingBalance -= utilityAmount;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(utilityDate),
      account_id: "ACC_CHECKING_REEM",
      type: "expense",
      amount: utilityAmount,
      category: "Utilities",
      description: "Utilities & Services",
      balance_after: checkingBalance
    });
    
    // 3. Investments (variable but frequent)
    if (Math.random() < reemConfig.investmentTransactionChance) {
      const investmentDate = new Date(monthStartDate);
      investmentDate.setDate(reemConfig.investmentDay);
      const investmentAmount = generateRandomAmount(
        reemConfig.investmentContributionBase, 
        reemConfig.investmentVariation
      );
      checkingBalance -= investmentAmount;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(investmentDate),
        account_id: "ACC_CHECKING_REEM",
        type: "expense",
        amount: investmentAmount,
        category: "Investments",
        description: "Portfolio Investment Contribution",
        balance_after: checkingBalance
      });
    }

    // --- Seasonal Expenses (travel, fashion events, etc.) ---
    const seasonalTransactions = generateSeasonalExpenses(monthStartDate);
    for (const transaction of seasonalTransactions) {
      checkingBalance -= transaction.amount;
      transaction.balance_after = checkingBalance;
      transactions.push(transaction);
    }

    // --- Discretionary Spending ---
    // 1. Dining (high-end restaurants)
    for (let i = 0; i < reemConfig.diningTransactionsPerMonth; i++) {
      const diningDate = addDays(monthStartDate, Math.floor(Math.random() * daysInMonth));
      const diningAmount = generateRandomAmount(
        reemConfig.diningBase / reemConfig.diningTransactionsPerMonth, 
        reemConfig.diningVariation
      );
      checkingBalance -= diningAmount;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(diningDate),
        account_id: "ACC_CHECKING_REEM", // Should ideally use Play Pot
        type: "expense",
        amount: diningAmount,
        category: "Dining",
        description: "Fine Dining",
        balance_after: checkingBalance
      });
    }

    // 2. Shopping (luxury items)
    for (let i = 0; i < reemConfig.shoppingTransactionsPerMonth; i++) {
      const shoppingDate = addDays(monthStartDate, Math.floor(Math.random() * daysInMonth));
      const shoppingAmount = generateRandomAmount(
        reemConfig.shoppingBase / reemConfig.shoppingTransactionsPerMonth, 
        reemConfig.shoppingVariation
      );
      checkingBalance -= shoppingAmount;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(shoppingDate),
        account_id: "ACC_CHECKING_REEM", // Should ideally use Play Pot
        type: "expense",
        amount: shoppingAmount,
        category: "Shopping",
        description: "Luxury Shopping",
        balance_after: checkingBalance
      });
    }

    // 3. Wellness & Self-care
    for (let i = 0; i < reemConfig.wellnessTransactionsPerMonth; i++) {
      const wellnessDate = addDays(monthStartDate, Math.floor(Math.random() * daysInMonth));
      const wellnessAmount = generateRandomAmount(
        reemConfig.wellnessBase / reemConfig.wellnessTransactionsPerMonth, 
        reemConfig.wellnessVariation
      );
      checkingBalance -= wellnessAmount;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(wellnessDate),
        account_id: "ACC_CHECKING_REEM", // Should ideally use Play Pot
        type: "expense",
        amount: wellnessAmount,
        category: "Wellness",
        description: "Spa & Wellness Services",
        balance_after: checkingBalance
      });
    }

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Return the simulated data
  return {
    persona: { 
      name: "Reem",
      description: "Executive in DIFC, 45, high-income earner, single, with fluctuating luxury lifestyle spending. Wants a smart savings tool that helps balance indulgence with long-term planning.",
      goals: [
        {
          goal_id: "RETIREMENT_FUND",
          description: "Build retirement fund while maintaining lifestyle",
          target_amount: 5000000, // Ambitious retirement goal
          target_date: "2040-01-01", // ~15 years from now
          current_amount: 200000 // Starting amount
        }
      ]
    },
    accounts: [
      { 
        account_id: "ACC_CHECKING_REEM", 
        type: "Checking", 
        currency: "AED",
        balance: checkingBalance 
      },
      { 
        account_id: "ACC_SAVEPOT_REEM", 
        type: "Save Pot", 
        currency: "AED",
        balance: savePotBalance,
        linked_goal: "RETIREMENT_FUND"
      },
      { 
        account_id: "ACC_PLAYPOT_REEM", 
        type: "Play Pot", 
        currency: "AED",
        balance: playPotBalance 
      }
    ],
    transactions: transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
  };
}