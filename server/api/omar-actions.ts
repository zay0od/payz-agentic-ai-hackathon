import { simulateOmarData } from '~/models/finance/omar-data';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';
import { FinancialData, Transaction, AIRecommendation } from '~/models/finance/types';

// In-memory storage to persist AI actions between requests
let omarFinancialData: FinancialData | null = null;
let implementedRecommendations: AIRecommendation[] = [];

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
  const { action, recommendationId, months = 12 } = body;
  
  // If no financial data exists yet, generate it
  if (!omarFinancialData) {
    omarFinancialData = simulateOmarData(months);
  }
  
  // Get the AI analysis
  const aiAnalysis = performFinancialAnalysis(omarFinancialData);
  
  let result = { success: false, message: 'No action taken', data: null };
  
  // Implement an AI recommendation
  if (action === 'implement_recommendation' && recommendationId) {
    const recommendation = aiAnalysis.recommendations.find(r => r.recommendation_id === recommendationId);
    
    if (!recommendation) {
      return createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: `Recommendation with ID ${recommendationId} not found`
      });
    }
    
    // Check if recommendation has already been implemented
    if (implementedRecommendations.some(r => r.recommendation_id === recommendationId)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'This recommendation has already been implemented'
      });
    }
    
    // Implement the recommendation
    if (recommendation.type === 'savings_allocation') {
      // Transfer money between accounts
      const description = recommendation.description.toLowerCase();
      let sourceAccountId = 'ACC_CHECKING_OMAR';
      let targetAccountId = '';
      
      if (description.includes('save pot')) {
        targetAccountId = 'ACC_SAVEPOT_OMAR';
      } else if (description.includes('play pot')) {
        targetAccountId = 'ACC_PLAYPOT_OMAR';
      } else {
        return createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Unknown target account for allocation'
        });
      }
      
      const amount = recommendation.amount || 0;
      
      // Find the accounts
      const sourceAccount = omarFinancialData.accounts.find(a => a.account_id === sourceAccountId);
      const targetAccount = omarFinancialData.accounts.find(a => a.account_id === targetAccountId);
      
      if (!sourceAccount || !targetAccount) {
        return createError({
          statusCode: 500,
          statusMessage: 'Internal Server Error',
          message: 'Account not found'
        });
      }
      
      // Check if source account has enough balance
      if (sourceAccount.balance < amount) {
        return createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Insufficient funds in source account'
        });
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
        transaction_id: `T${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        account_id: sourceAccountId,
        type: 'transfer',
        amount: amount,
        category: 'Transfer',
        description: recommendation.description,
        balance_after: sourceAccount.balance,
        ai_generated: true,
        transfer_to: targetAccountId
      };
      
      // Add the transaction to the history
      omarFinancialData.transactions.push(transferTransaction);
      
      // Mark the recommendation as implemented
      recommendation.implemented = true;
      implementedRecommendations.push({ ...recommendation });
      
      result = {
        success: true,
        message: `Successfully transferred ${amount.toFixed(2)} AED from ${sourceAccount.type} to ${targetAccount.type}`,
        data: {
          transaction: transferTransaction,
          sourceAccount,
          targetAccount
        }
      };
    } else {
      // Just mark other types of recommendations as implemented
      recommendation.implemented = true;
      implementedRecommendations.push({ ...recommendation });
      
      result = {
        success: true,
        message: `Acknowledged recommendation: ${recommendation.description}`,
        data: { recommendation }
      };
    }
  } 
  // Reset simulation
  else if (action === 'reset_simulation') {
    omarFinancialData = simulateOmarData(months);
    implementedRecommendations = [];
    
    result = {
      success: true,
      message: 'Simulation reset successfully',
      data: null
    };
  }
  // Return current state
  else if (action === 'get_current_state') {
    result = {
      success: true,
      message: 'Current financial state retrieved',
      data: {
        financialData: omarFinancialData,
        analysis: aiAnalysis,
        implementedRecommendations
      }
    };
  }
  
  return result;
});