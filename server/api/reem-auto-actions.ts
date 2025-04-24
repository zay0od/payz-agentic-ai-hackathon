import { simulateReemData } from '~/models/finance/reem-data';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';
import { FinancialData, Transaction, AIRecommendation } from '~/models/finance/types';

// Reference the shared in-memory data
let reemFinancialData: FinancialData | null = null;
let implementedRecommendations: AIRecommendation[] = [];

// Auto-implementation logic with special considerations for Reem's seasonal spending
function determineRecommendationPriority(recommendation: AIRecommendation): number {
  // Base priority score
  let priority = 0;
  
  // Prioritize based on recommendation type
  if (recommendation.type === 'savings_allocation') {
    // Savings allocations are important for balancing luxury and savings
    priority += 10;
    
    // Specifically prioritize Save Pot allocations for her retirement goal
    if (recommendation.description.toLowerCase().includes('save pot')) {
      priority += 5;
    }
  } else if (recommendation.type === 'spending_alert') {
    // Spending alerts are critical for luxury control
    priority += 15;
    
    // If the alert mentions seasonal spending, it's even higher priority
    if (
      recommendation.description.toLowerCase().includes('travel') || 
      recommendation.description.toLowerCase().includes('shopping') || 
      recommendation.description.toLowerCase().includes('luxury')
    ) {
      priority += 10;
    }
  } else if (recommendation.type === 'goal_adjustment') {
    // Goal adjustments are slightly lower priority
    priority += 7;
  }
  
  // Prioritize recommendations with larger amounts
  if (recommendation.amount) {
    // Add more priority to higher amounts, but scale it to avoid overwhelming others
    priority += Math.min(5, recommendation.amount / 10000);
  }
  
  return priority;
}

// This endpoint allows the Agentic AI to automatically implement recommendations for Reem
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
  if (!reemFinancialData) {
    reemFinancialData = simulateReemData(months);
  }
  
  // Get the AI analysis
  const aiAnalysis = performFinancialAnalysis(reemFinancialData);
  
  // Filter out already implemented recommendations
  const availableRecommendations = aiAnalysis.recommendations.filter(
    rec => !implementedRecommendations.some(impl => impl.recommendation_id === rec.recommendation_id)
  );
  
  const implementedInThisRun: AIRecommendation[] = [];
  const logs: string[] = [];
  
  // Calculate current month to identify seasonal spending periods (for all modes)
  const today = new Date();
  const currentMonth = today.getMonth();
  
  // Determine if we're in a high seasonal spending period
  const isHighSpendingSeason = [0, 1, 6, 7, 11].includes(currentMonth); // Winter and summer
  logs.push(`Current month: ${currentMonth + 1} (${isHighSpendingSeason ? 'High' : 'Regular'} spending season)`);
  
  // Get recent transactions to analyze luxury spending
  const recentTransactions = reemFinancialData.transactions.slice(-100);
  const luxuryCategories = ['Shopping', 'Travel', 'Fashion', 'Dining', 'Events', 'Entertainment', 'Wellness'];
  
  // Calculate recent luxury spending (past 2 months)
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  
  const recentLuxurySpending = recentTransactions
    .filter(t => 
      t.type === 'expense' && 
      luxuryCategories.includes(t.category) &&
      new Date(t.date) >= twoMonthsAgo
    )
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate recent income (past 2 months)
  const recentIncome = recentTransactions
    .filter(t => 
      t.type === 'income' &&
      new Date(t.date) >= twoMonthsAgo
    )
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate luxury spending ratio
  const luxurySpendingRatio = recentIncome > 0 ? recentLuxurySpending / recentIncome : 0;
  logs.push(`Recent luxury spending: ${recentLuxurySpending.toFixed(2)} AED (${(luxurySpendingRatio * 100).toFixed(1)}% of income)`);
  
  // Adjust savings strategy based on spending season and ratios
  const targetSavingsRatio = isHighSpendingSeason ? 0.15 : 0.25; // Lower target during high spending seasons
  const luxurySpendingThreshold = isHighSpendingSeason ? 0.40 : 0.30; // Higher threshold during high spending seasons
  
  logs.push(`Target savings rate: ${(targetSavingsRatio * 100).toFixed(1)}%`);
  logs.push(`Luxury spending threshold: ${(luxurySpendingThreshold * 100).toFixed(1)}%`);
  
  // Sort recommendations by priority
  const prioritizedRecommendations = [...availableRecommendations]
    .sort((a, b) => determineRecommendationPriority(b) - determineRecommendationPriority(a));
  
  if (autoExecuteMode === 'dry_run') {
    // Dry run mode: Don't implement anything, just show what would be implemented
    for (const recommendation of prioritizedRecommendations) {
      const priority = determineRecommendationPriority(recommendation);
      
      if (recommendation.type === 'spending_alert') {
        const isHighPriority = luxurySpendingRatio > luxurySpendingThreshold;
        logs.push(`[DRY RUN] Would acknowledge spending alert: ${recommendation.description} ${isHighPriority ? '(HIGH PRIORITY due to luxury spending)' : ''}`);
      } else if (recommendation.type === 'savings_allocation') {
        const description = recommendation.description.toLowerCase();
        const amount = recommendation.amount || 0;
        
        if (description.includes('save pot') && isHighSpendingSeason && amount > 5000) {
          const adjustedAmount = Math.floor(amount * 0.7); // Reduce savings by 30% during high spending season
          logs.push(`[DRY RUN] Would implement with REDUCED amount: ${recommendation.description} (${adjustedAmount.toFixed(2)} AED instead of ${amount.toFixed(2)} AED due to high spending season)`);
        } else {
          logs.push(`[DRY RUN] Would implement: ${recommendation.description} (${amount.toFixed(2)} AED)`);
        }
      } else {
        logs.push(`[DRY RUN] Would acknowledge: ${recommendation.description} (Priority: ${priority})`);
      }
    }
  } else if (autoExecuteMode === 'semi_auto') {
    // Semi-auto mode: Only implement spending alerts and high-priority savings allocations
    for (const recommendation of prioritizedRecommendations) {
      const priority = determineRecommendationPriority(recommendation);
      
      // Spending alerts are always implemented in semi-auto if luxury spending is high
      if (recommendation.type === 'spending_alert' && luxurySpendingRatio > luxurySpendingThreshold) {
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Semi-auto acknowledged spending alert: ${recommendation.description} (Critical due to high luxury spending ratio)`);
      } 
      // Only highest priority savings allocations are auto-implemented
      else if (recommendation.type === 'savings_allocation' && priority >= 12) {
        const description = recommendation.description.toLowerCase();
        let sourceAccountId = 'ACC_CHECKING_REEM';
        let targetAccountId = '';
        
        if (description.includes('save pot')) {
          targetAccountId = 'ACC_SAVEPOT_REEM';
        } else if (description.includes('play pot')) {
          targetAccountId = 'ACC_PLAYPOT_REEM';
        } else {
          logs.push(`Skipped recommendation: ${recommendation.description} (Unknown target account)`);
          continue;
        }
        
        const amount = recommendation.amount || 0;
        
        // Find the accounts
        const sourceAccount = reemFinancialData.accounts.find(a => a.account_id === sourceAccountId);
        const targetAccount = reemFinancialData.accounts.find(a => a.account_id === targetAccountId);
        
        if (!sourceAccount || !targetAccount) {
          logs.push(`Skipped recommendation: ${recommendation.description} (Account not found)`);
          continue;
        }
        
        // Check if source account has enough balance with sufficient buffer
        const minimumCheckingBalance = isHighSpendingSeason ? 20000 : 15000; // Higher buffer during high spending seasons
        if (sourceAccount.balance < amount + minimumCheckingBalance) {
          logs.push(`Skipped recommendation: ${recommendation.description} (Insufficient funds or would reduce checking below safety buffer)`);
          continue;
        }
        
        // For Save Pot transfers during high spending seasons, reduce the amount
        let transferAmount = amount;
        let adjustmentNote = '';
        
        if (targetAccountId === 'ACC_SAVEPOT_REEM' && isHighSpendingSeason && amount > 5000) {
          transferAmount = Math.floor(amount * 0.7); // Reduce savings by 30% during high spending season
          adjustmentNote = ' (Adjusted for high spending season)';
          logs.push(`Adjusted Save Pot transfer from ${amount.toFixed(2)} to ${transferAmount.toFixed(2)} due to high spending season`);
        }
        
        // Perform the transfer
        sourceAccount.balance -= transferAmount;
        targetAccount.balance += transferAmount;
        
        // Update goal if relevant
        if (targetAccountId === 'ACC_SAVEPOT_REEM') {
          const retirementGoal = reemFinancialData.persona.goals.find(g => g.goal_id === 'RETIREMENT_FUND');
          if (retirementGoal) {
            retirementGoal.current_amount += transferAmount;
          }
        }
        
        // Create transaction record
        const transferTransaction: Transaction = {
          transaction_id: `T${Date.now()}_AUTO_${implementedInThisRun.length}`,
          date: new Date().toISOString().split('T')[0],
          account_id: sourceAccountId,
          type: 'transfer',
          amount: transferAmount,
          category: 'Auto Transfer',
          description: `[SEMI-AUTO] ${recommendation.description}${adjustmentNote}`,
          balance_after: sourceAccount.balance,
          ai_generated: true,
          transfer_to: targetAccountId
        };
        
        reemFinancialData.transactions.push(transferTransaction);
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Semi-auto implemented: ${recommendation.description} - Transferred ${transferAmount.toFixed(2)} AED from ${sourceAccount.type} to ${targetAccount.type}`);
      } else {
        // For all other recommendations in semi-auto mode, just log that they require user approval
        logs.push(`Requires user approval: ${recommendation.description} (Priority: ${priority})`);
      }
    }
  } else if (autoExecuteMode === 'full_auto' && availableRecommendations.length > 0) {
    // Full auto mode: Implement all eligible recommendations with Reem's special logic
    for (const recommendation of prioritizedRecommendations) {
      // For luxury spending control
      if (recommendation.type === 'spending_alert' && luxurySpendingRatio > luxurySpendingThreshold) {
        recommendation.implemented = true;
        implementedRecommendations.push({ ...recommendation });
        implementedInThisRun.push({ ...recommendation });
        
        logs.push(`Auto-acknowledged spending alert: ${recommendation.description} (Critical due to high luxury spending ratio)`);
        continue;
      }
      
      // For savings allocations
      if (recommendation.type === 'savings_allocation') {
        const description = recommendation.description.toLowerCase();
        let sourceAccountId = 'ACC_CHECKING_REEM';
        let targetAccountId = '';
        
        if (description.includes('save pot')) {
          targetAccountId = 'ACC_SAVEPOT_REEM';
        } else if (description.includes('play pot')) {
          targetAccountId = 'ACC_PLAYPOT_REEM';
        } else {
          logs.push(`Skipped recommendation: ${recommendation.description} (Unknown target account)`);
          continue;
        }
        
        const amount = recommendation.amount || 0;
        
        // Find the accounts
        const sourceAccount = reemFinancialData.accounts.find(a => a.account_id === sourceAccountId);
        const targetAccount = reemFinancialData.accounts.find(a => a.account_id === targetAccountId);
        
        if (!sourceAccount || !targetAccount) {
          logs.push(`Skipped recommendation: ${recommendation.description} (Account not found)`);
          continue;
        }
        
        // Check if source account has enough balance with sufficient buffer
        // Reem needs a higher buffer since she has fluctuating luxury expenses
        const minimumCheckingBalance = isHighSpendingSeason ? 20000 : 15000; // Higher buffer during high spending seasons
        if (sourceAccount.balance < amount + minimumCheckingBalance) {
          logs.push(`Skipped recommendation: ${recommendation.description} (Insufficient funds or would reduce checking below safety buffer)`);
          continue;
        }
        
        // For Save Pot transfers during high spending seasons, reduce the amount
        if (targetAccountId === 'ACC_SAVEPOT_REEM' && isHighSpendingSeason && amount > 5000) {
          const adjustedAmount = Math.floor(amount * 0.7); // Reduce savings by 30% during high spending season
          logs.push(`Adjusted Save Pot transfer from ${amount.toFixed(2)} to ${adjustedAmount.toFixed(2)} due to high spending season`);
          
          // Perform the transfer with adjusted amount
          sourceAccount.balance -= adjustedAmount;
          targetAccount.balance += adjustedAmount;
          
          // Update the retirement goal amount
          const retirementGoal = reemFinancialData.persona.goals.find(g => g.goal_id === 'RETIREMENT_FUND');
          if (retirementGoal) {
            retirementGoal.current_amount += adjustedAmount;
          }
          
          // Create transaction record with adjusted amount
          const transferTransaction: Transaction = {
            transaction_id: `T${Date.now()}_AUTO_${implementedInThisRun.length}`,
            date: new Date().toISOString().split('T')[0],
            account_id: sourceAccountId,
            type: 'transfer',
            amount: adjustedAmount,
            category: 'Auto Transfer',
            description: `[AUTO] ${recommendation.description} (Adjusted for high spending season)`,
            balance_after: sourceAccount.balance,
            ai_generated: true,
            transfer_to: targetAccountId
          };
          
          reemFinancialData.transactions.push(transferTransaction);
          recommendation.implemented = true;
          implementedRecommendations.push({ ...recommendation });
          implementedInThisRun.push({ ...recommendation });
          
          logs.push(`Auto-implemented: ${recommendation.description} - Transferred ${adjustedAmount.toFixed(2)} AED from ${sourceAccount.type} to ${targetAccount.type} (Adjusted)`);
        } else {
          // Standard transfer for Play Pot or during normal seasons
          sourceAccount.balance -= amount;
          targetAccount.balance += amount;
          
          // Update goal if relevant
          if (targetAccountId === 'ACC_SAVEPOT_REEM') {
            const retirementGoal = reemFinancialData.persona.goals.find(g => g.goal_id === 'RETIREMENT_FUND');
            if (retirementGoal) {
              retirementGoal.current_amount += amount;
            }
          }
          
          // Create transaction record
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
          
          reemFinancialData.transactions.push(transferTransaction);
          recommendation.implemented = true;
          implementedRecommendations.push({ ...recommendation });
          implementedInThisRun.push({ ...recommendation });
          
          logs.push(`Auto-implemented: ${recommendation.description} - Transferred ${amount.toFixed(2)} AED from ${sourceAccount.type} to ${targetAccount.type}`);
        }
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
      financialData: reemFinancialData,
      remainingRecommendations: aiAnalysis.recommendations.filter(
        rec => !implementedRecommendations.some(impl => impl.recommendation_id === rec.recommendation_id)
      )
    }
  };
});