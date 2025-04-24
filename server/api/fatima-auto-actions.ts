import { simulateFatimaData } from '~/models/finance/fatima-data';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';
import { FinancialData, Transaction, AIRecommendation } from '~/models/finance/types';

// Reference the shared in-memory data
// In a real application, this would be stored in a database
let fatimaFinancialData: FinancialData | null = null;
let implementedRecommendations: AIRecommendation[] = [];

// Auto-implementation logic
function determineRecommendationPriority(recommendation: AIRecommendation): number {
  switch (recommendation.type) {
    case 'savings_allocation':
      // High priority for savings allocation if it contains 'save pot'
      return recommendation.description.toLowerCase().includes('save pot') ? 100 : 80;
    case 'spending_alert':
      // Medium priority for alerts
      return 60;
    case 'goal_adjustment':
      // High priority for goal-related recommendations
      return 90;
    default:
      return 50;
  }
}

// This endpoint allows the Agentic AI to automatically implement recommendations without user intervention
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
  if (!fatimaFinancialData) {
    fatimaFinancialData = simulateFatimaData(months);
  }
  
  // Get the AI analysis
  const aiAnalysis = performFinancialAnalysis(fatimaFinancialData);
  
  // Filter out already implemented recommendations
  const availableRecommendations = aiAnalysis.recommendations.filter(
    rec => !implementedRecommendations.some(impl => impl.recommendation_id === rec.recommendation_id)
  );
  
  const implementedInThisRun: AIRecommendation[] = [];
  const logs: string[] = [];
  
  // Sort recommendations by priority
  const prioritizedRecommendations = [...availableRecommendations]
    .sort((a, b) => determineRecommendationPriority(b) - determineRecommendationPriority(a));
  
  if (autoExecuteMode === 'dry_run') {
    // Dry run mode: Don't implement anything, just show what would be implemented
    for (const recommendation of prioritizedRecommendations) {
      const eligible = recommendation.type === 'savings_allocation' || recommendation.type === 'goal_adjustment';
      logs.push(`[DRY RUN] Would ${eligible ? '' : 'NOT '}implement: ${recommendation.description}`);
      
      if (eligible && recommendation.type === 'savings_allocation') {
        const amount = recommendation.amount || 0;
        logs.push(`[DRY RUN] Would transfer ${amount.toFixed(2)} AED`);
      }
    }
  } else if (autoExecuteMode === 'semi_auto') {
    // Semi-auto mode: Only implement high-priority savings allocations
    for (const recommendation of prioritizedRecommendations) {
      const priority = determineRecommendationPriority(recommendation);
      
      // Only auto-implement highest priority savings allocations
      if (recommendation.type === 'savings_allocation' && priority >= 90) {
        const description = recommendation.description.toLowerCase();
        let sourceAccountId = 'ACC_CHECKING_FATM';
        let targetAccountId = '';
        
        if (description.includes('save pot')) {
          targetAccountId = 'ACC_SAVEPOT_FATM';
        } else if (description.includes('play pot')) {
          targetAccountId = 'ACC_PLAYPOT_FATM';
        } else {
          logs.push(`Skipped recommendation: ${recommendation.description} (unknown target account)`);
          continue;
        }
        
        const amount = recommendation.amount || 0;
        
        // Find the accounts
        const sourceAccount = fatimaFinancialData.accounts.find(a => a.account_id === sourceAccountId);
        const targetAccount = fatimaFinancialData.accounts.find(a => a.account_id === targetAccountId);
        
        if (!sourceAccount || !targetAccount) {
          logs.push(`Skipped recommendation: ${recommendation.description} (account not found)`);
          continue;
        }
        
        // Check if source account has enough balance
        if (sourceAccount.balance < amount) {
          logs.push(`Skipped recommendation: ${recommendation.description} (insufficient funds)`);
          continue;
        }
        
        // Perform the transfer
        sourceAccount.balance -= amount;
        targetAccount.balance += amount;
        
        // If this is the Save Pot, update the goal amount too
        if (targetAccountId === 'ACC_SAVEPOT_FATM') {
          const mortgageGoal = fatimaFinancialData.persona.goals.find(g => g.goal_id === 'MORTGAGE_SAVINGS');
          if (mortgageGoal) {
            mortgageGoal.current_amount += amount;
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
        fatimaFinancialData.transactions.push(transferTransaction);
        
        // Mark the recommendation as implemented
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Semi-auto implemented: ${recommendation.description} - Transferred ${amount.toFixed(2)} AED from ${sourceAccount.type} to ${targetAccount.type}`);
      } else {
        // For all other recommendations in semi-auto mode, just log that they require user approval
        logs.push(`Requires user approval: ${recommendation.description}`);
      }
    }
  } else if (autoExecuteMode === 'full_auto' && availableRecommendations.length > 0) {
    // Full auto mode: Implement all eligible recommendations
    for (const recommendation of prioritizedRecommendations) {
      // Only auto-implement savings allocations and goal adjustments
      if (recommendation.type !== 'savings_allocation' && recommendation.type !== 'goal_adjustment') {
        logs.push(`Skipped recommendation: ${recommendation.description} (not eligible for auto-implementation)`);
        continue;
      }
      
      // Logic for implementing savings allocations
      if (recommendation.type === 'savings_allocation') {
        const description = recommendation.description.toLowerCase();
        let sourceAccountId = 'ACC_CHECKING_FATM';
        let targetAccountId = '';
        
        if (description.includes('save pot')) {
          targetAccountId = 'ACC_SAVEPOT_FATM';
        } else if (description.includes('play pot')) {
          targetAccountId = 'ACC_PLAYPOT_FATM';
        } else {
          logs.push(`Skipped recommendation: ${recommendation.description} (unknown target account)`);
          continue;
        }
        
        const amount = recommendation.amount || 0;
        
        // Find the accounts
        const sourceAccount = fatimaFinancialData.accounts.find(a => a.account_id === sourceAccountId);
        const targetAccount = fatimaFinancialData.accounts.find(a => a.account_id === targetAccountId);
        
        if (!sourceAccount || !targetAccount) {
          logs.push(`Skipped recommendation: ${recommendation.description} (account not found)`);
          continue;
        }
        
        // Check if source account has enough balance
        if (sourceAccount.balance < amount) {
          logs.push(`Skipped recommendation: ${recommendation.description} (insufficient funds)`);
          continue;
        }
        
        // Perform the transfer
        sourceAccount.balance -= amount;
        targetAccount.balance += amount;
        
        // If this is the Save Pot, update the goal amount too
        if (targetAccountId === 'ACC_SAVEPOT_FATM') {
          const mortgageGoal = fatimaFinancialData.persona.goals.find(g => g.goal_id === 'MORTGAGE_SAVINGS');
          if (mortgageGoal) {
            mortgageGoal.current_amount += amount;
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
        fatimaFinancialData.transactions.push(transferTransaction);
        
        // Mark the recommendation as implemented
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Auto-implemented: ${recommendation.description} - Transferred ${amount.toFixed(2)} AED from ${sourceAccount.type} to ${targetAccount.type}`);
      }
      // For goal adjustments, just mark them as implemented
      else if (recommendation.type === 'goal_adjustment') {
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Auto-acknowledged: ${recommendation.description}`);
      }
    }
  }
  
  return {
    success: true,
    mode: autoExecuteMode,
    message: `${autoExecuteMode.replace('_', ' ')} mode complete. ${implementedInThisRun.length} recommendations processed.`,
    data: {
      implementedRecommendations: implementedInThisRun,
      logs,
      financialData: fatimaFinancialData,
      remainingRecommendations: aiAnalysis.recommendations.filter(
        rec => !implementedRecommendations.some(impl => impl.recommendation_id === rec.recommendation_id)
      )
    }
  };
});