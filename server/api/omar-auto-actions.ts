import { simulateOmarData } from '~/models/finance/omar-data';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';
import { FinancialData, Transaction, AIRecommendation } from '~/models/finance/types';

// Reference the shared in-memory data
let omarFinancialData: FinancialData | null = null;
let implementedRecommendations: AIRecommendation[] = [];

// Auto-implementation logic with special considerations for Omar's unpredictable income
function determineRecommendationPriority(recommendation: AIRecommendation, income: number, average: number): number {
  // Base priority
  let priority = 50;
  
  switch (recommendation.type) {
    case 'savings_allocation':
      // Adjust savings priority based on income relative to average
      const incomeRatio = income / average;
      
      if (recommendation.description.toLowerCase().includes('save pot')) {
        // Higher priority for savings when income is above average
        priority = incomeRatio > 1.2 ? 100 : 80;
      } else {
        // Play pot priority is higher when income is very high (celebrate big projects)
        priority = incomeRatio > 1.5 ? 90 : 70;
      }
      break;
      
    case 'spending_alert':
      // Higher priority for spending alerts when income is below average
      priority = income < average * 0.8 ? 90 : 60;
      break;
      
    case 'goal_adjustment':
      // Goal adjustments always have high priority for property purchase goal
      priority = 95;
      break;
  }
  
  return priority;
}

// This endpoint allows the Agentic AI to automatically implement recommendations for Omar
export default defineEventHandler(async (event) => {
  // Only support POST method
  if (event.method !== 'POST') {
    return createError({ 
      statusCode: 405, 
      statusMessage: 'Method Not Allowed',
      message: 'Only POST requests are allowed' 
    });
  }
  
  // Get the request body
  const body = await readBody(event);
  const { autoExecuteMode = 'dry_run', months = 12 } = body;
  
  // Validate the mode
  if (!['full_auto', 'semi_auto', 'dry_run'].includes(autoExecuteMode)) {
    return createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid autoExecuteMode. Supported values are: full_auto, semi_auto, dry_run'
    });
  }
  
  // If no financial data exists yet, generate it
  if (!omarFinancialData) {
    omarFinancialData = simulateOmarData(months);
  }
  
  // Get the AI analysis
  const aiAnalysis = performFinancialAnalysis(omarFinancialData);
  
  // Filter out already implemented recommendations
  const availableRecommendations = aiAnalysis.recommendations.filter(
    rec => !implementedRecommendations.some(impl => impl.recommendation_id === rec.recommendation_id)
  );
  
  const implementedInThisRun: AIRecommendation[] = [];
  const logs: string[] = [];
  
  // Calculate recent income metrics for Omar (used in all modes)
  const recentTransactions = omarFinancialData.transactions.slice(-100); // Last 100 transactions
  const incomeTransactions = recentTransactions.filter(t => t.type === 'income');
  
  // Calculate average income per month
  const monthsRepresented = new Set(
    incomeTransactions.map(t => {
      const date = new Date(t.date);
      return `${date.getFullYear()}-${date.getMonth() + 1}`;
    })
  ).size;
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const averageMonthlyIncome = monthsRepresented > 0 ? totalIncome / monthsRepresented : 0;
  
  // Calculate current month's income
  const today = new Date();
  const currentMonthIncome = incomeTransactions
    .filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);
  
  logs.push(`Current month income: ${currentMonthIncome.toFixed(2)} AED`);
  logs.push(`Average monthly income: ${averageMonthlyIncome.toFixed(2)} AED`);
  
  // Sort recommendations by priority (adjusted for Omar's unpredictable income)
  const prioritizedRecommendations = [...availableRecommendations]
    .sort((a, b) => {
      return determineRecommendationPriority(b, currentMonthIncome, averageMonthlyIncome) - 
             determineRecommendationPriority(a, currentMonthIncome, averageMonthlyIncome);
    });
  
  if (autoExecuteMode === 'dry_run') {
    // Dry run mode: Don't implement anything, just show what would be implemented
    for (const recommendation of prioritizedRecommendations) {
      const priority = determineRecommendationPriority(recommendation, currentMonthIncome, averageMonthlyIncome);
      
      if (recommendation.type === 'savings_allocation') {
        const description = recommendation.description.toLowerCase();
        const amount = recommendation.amount || 0;
        
        if (description.includes('save pot')) {
          // Check if this is a good month for saving
          if (currentMonthIncome < averageMonthlyIncome * 0.8) {
            logs.push(`[DRY RUN] Would SKIP saving due to below-average income month: ${recommendation.description}`);
          } else {
            logs.push(`[DRY RUN] Would implement savings: ${recommendation.description} (${amount.toFixed(2)} AED)`);
          }
        } else if (description.includes('play pot')) {
          // Check if income allows for play pot allocation
          if (currentMonthIncome < averageMonthlyIncome * 0.7) {
            logs.push(`[DRY RUN] Would SKIP play pot allocation due to low income: ${recommendation.description}`);
          } else {
            logs.push(`[DRY RUN] Would implement play pot allocation: ${recommendation.description} (${amount.toFixed(2)} AED)`);
          }
        }
      } else {
        // Other recommendation types
        logs.push(`[DRY RUN] Would acknowledge: ${recommendation.description} (Priority: ${priority})`);
      }
    }
  } else if (autoExecuteMode === 'semi_auto') {
    // Semi-auto mode: Only implement high-priority recommendations when income is good
    for (const recommendation of prioritizedRecommendations) {
      const priority = determineRecommendationPriority(recommendation, currentMonthIncome, averageMonthlyIncome);
      
      // For Omar, only implement savings in semi-auto mode if both:
      // 1. It's a high priority recommendation (>= 90)
      // 2. Current income is at least average (good month)
      if (recommendation.type === 'savings_allocation' && priority >= 90 && currentMonthIncome >= averageMonthlyIncome) {
        const description = recommendation.description.toLowerCase();
        let sourceAccountId = 'ACC_CHECKING_OMAR';
        let targetAccountId = '';
        
        if (description.includes('save pot')) {
          targetAccountId = 'ACC_SAVEPOT_OMAR';
        } else if (description.includes('play pot')) {
          // Even in semi-auto, don't allocate to play pot if income is below average
          if (currentMonthIncome < averageMonthlyIncome) {
            logs.push(`Semi-auto skipped play pot allocation due to below-average income: ${recommendation.description}`);
            continue;
          }
          targetAccountId = 'ACC_PLAYPOT_OMAR';
        } else {
          logs.push(`Skipped recommendation: ${recommendation.description} (unknown target account)`);
          continue;
        }
        
        const amount = recommendation.amount || 0;
        
        // Find the accounts
        const sourceAccount = omarFinancialData.accounts.find(a => a.account_id === sourceAccountId);
        const targetAccount = omarFinancialData.accounts.find(a => a.account_id === targetAccountId);
        
        if (!sourceAccount || !targetAccount) {
          logs.push(`Skipped recommendation: ${recommendation.description} (account not found)`);
          continue;
        }
        
        // Check if source account has enough balance - keep more buffer for Omar due to unpredictable income
        const minimumCheckingBalance = 5000; // Higher buffer for freelancer
        if (sourceAccount.balance < amount + minimumCheckingBalance) {
          logs.push(`Skipped recommendation: ${recommendation.description} (insufficient funds or would reduce checking below safety buffer)`);
          continue;
        }
        
        // Perform the transfer
        sourceAccount.balance -= amount;
        targetAccount.balance += amount;
        
        // If this is the Save Pot, update the goal amount too
        if (targetAccountId === 'ACC_SAVEPOT_OMAR') {
          const propertyGoal = omarFinancialData.persona.goals.find(g => g.goal_id === 'PROPERTY_PURCHASE');
          if (propertyGoal) {
            propertyGoal.current_amount += amount;
          }
        }
        
        // Create a new transaction record for this transfer
        const transferTransaction: Transaction = {
          transaction_id: `T${Date.now()}_AUTO_${implementedInThisRun.length}`,
          date: new Date().toISOString().split('T')[0],
          account_id: sourceAccountId,
          type: 'transfer',
          amount: amount,
          category: 'Auto Transfer',
          description: `[SEMI-AUTO] ${recommendation.description}`,
          balance_after: sourceAccount.balance,
          ai_generated: true,
          transfer_to: targetAccountId
        };
        
        // Add the transaction to the history
        omarFinancialData.transactions.push(transferTransaction);
        
        // Mark the recommendation as implemented
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Semi-auto implemented: ${recommendation.description} - Transferred ${amount.toFixed(2)} AED from ${sourceAccount.type} to ${targetAccount.type}`);
      } else {
        // For all other recommendations in semi-auto mode, just log that they require user approval
        logs.push(`Requires user approval: ${recommendation.description} (Priority: ${priority})`);
      }
    }
  } else if (autoExecuteMode === 'full_auto' && availableRecommendations.length > 0) {
    // Full auto mode: Implement all eligible recommendations using Omar's income-aware logic
    for (const recommendation of prioritizedRecommendations) {
      // For Omar, apply special logic for savings based on income
      if (recommendation.type === 'savings_allocation') {
        const description = recommendation.description.toLowerCase();
        let sourceAccountId = 'ACC_CHECKING_OMAR';
        let targetAccountId = '';
        
        if (description.includes('save pot')) {
          targetAccountId = 'ACC_SAVEPOT_OMAR';
          
          // Special freelancer logic: Only auto-implement savings if this was a good month
          if (currentMonthIncome < averageMonthlyIncome * 0.8) {
            logs.push(`Skipped saving recommendation due to below-average income month (${currentMonthIncome.toFixed(2)} vs avg ${averageMonthlyIncome.toFixed(2)})`);
            continue;
          }
        } else if (description.includes('play pot')) {
          targetAccountId = 'ACC_PLAYPOT_OMAR';
          
          // Special freelancer logic: Limit entertainment when income is low
          if (currentMonthIncome < averageMonthlyIncome * 0.7) {
            logs.push(`Skipped play pot recommendation due to significantly below-average income month`);
            continue;
          }
        } else {
          logs.push(`Skipped recommendation: ${recommendation.description} (unknown target account)`);
          continue;
        }
        
        const amount = recommendation.amount || 0;
        
        // Find the accounts
        const sourceAccount = omarFinancialData.accounts.find(a => a.account_id === sourceAccountId);
        const targetAccount = omarFinancialData.accounts.find(a => a.account_id === targetAccountId);
        
        if (!sourceAccount || !targetAccount) {
          logs.push(`Skipped recommendation: ${recommendation.description} (account not found)`);
          continue;
        }
        
        // Check if source account has enough balance - keep more buffer for Omar due to unpredictable income
        const minimumCheckingBalance = 5000; // Higher buffer for freelancer
        if (sourceAccount.balance < amount + minimumCheckingBalance) {
          logs.push(`Skipped recommendation: ${recommendation.description} (insufficient funds or would reduce checking below safety buffer)`);
          continue;
        }
        
        // Perform the transfer
        sourceAccount.balance -= amount;
        targetAccount.balance += amount;
        
        // If this is the Save Pot, update the goal amount too
        if (targetAccountId === 'ACC_SAVEPOT_OMAR') {
          const propertyGoal = omarFinancialData.persona.goals.find(g => g.goal_id === 'PROPERTY_PURCHASE');
          if (propertyGoal) {
            propertyGoal.current_amount += amount;
          }
        }
        
        // Create a new transaction record for this transfer
        const transferTransaction: Transaction = {
          transaction_id: `T${Date.now()}_AUTO_${implementedInThisRun.length}`,
          date: new Date().toISOString().split('T')[0],
          account_id: sourceAccountId,
          type: 'transfer',
          amount: amount,
          category: 'Auto Transfer',
          description: `[AUTO] ${recommendation.description}`,
          balance_after: sourceAccount.balance,
          ai_generated: true,
          transfer_to: targetAccountId
        };
        
        // Add the transaction to the history
        omarFinancialData.transactions.push(transferTransaction);
        
        // Mark the recommendation as implemented
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Auto-implemented: ${recommendation.description} - Transferred ${amount.toFixed(2)} AED from ${sourceAccount.type} to ${targetAccount.type}`);
      }
      // For spending alerts, prioritize them when income is low
      else if (recommendation.type === 'spending_alert') {
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        // Add a special note for Omar's variable income situation
        const alertNote = currentMonthIncome < averageMonthlyIncome 
          ? ` (Important during low-income month!)` 
          : '';
        
        logs.push(`Auto-acknowledged spending alert: ${recommendation.description}${alertNote}`);
      }
      // For goal adjustments, always implement them for property goal
      else if (recommendation.type === 'goal_adjustment') {
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Auto-acknowledged goal adjustment: ${recommendation.description} (critical for property purchase goal)`);
      }
    }
  }
  
  return {
    success: true,
    mode: autoExecuteMode,
    message: `${autoExecuteMode.replace('_', ' ')} mode complete for Omar. ${implementedInThisRun.length} recommendations processed.`,
    data: {
      implementedRecommendations: implementedInThisRun,
      logs,
      financialData: omarFinancialData,
      remainingRecommendations: aiAnalysis.recommendations.filter(
        rec => !implementedRecommendations.some(impl => impl.recommendation_id === rec.recommendation_id)
      )
    }
  };
});