import { getGroqClient } from '~/server/utils/groq-service';
import { simulateFatimaData } from '~/models/finance/fatima-data';
import { AIRecommendation } from '~/models/finance/types';

export default defineEventHandler(async (event) => {
  try {
    // Get query parameter for number of months (default to 12 if not provided)
    const query = getQuery(event);
    const months = parseInt(query.months as string) || 12;
    
    // Get Fatima's financial data
    const financialData = simulateFatimaData(months);
    
    // Initialize Groq client
    const groqClient = getGroqClient(event);
    
    // Calculate summary data for the last month
    const transactions = financialData.transactions;
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    // Calculate income and expenses for the last month
    const recentTransactions = transactions.filter(t => 
      new Date(t.date) >= oneMonthAgo && 
      new Date(t.date) <= today
    );
    
    const income = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expensesByCategory = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);
    
    // Get goal information
    const mortgageGoal = financialData.persona.goals[0];
    const savingsAccount = financialData.accounts.find(a => a.type === 'Save Pot');
    
    // Use Groq to generate AI recommendations
    const recommendations = await groqClient.generateFinancialRecommendations(
      income,
      expensesByCategory,
      mortgageGoal.target_amount,
      savingsAccount?.balance || 0,
      mortgageGoal.target_date
    );
    
    // Return the AI-generated recommendations
    return {
      success: true,
      recommendations,
      summary: {
        income,
        expenses: expensesByCategory,
        totalExpenses: Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0),
        goal: mortgageGoal,
        currentSavings: savingsAccount?.balance || 0
      }
    };
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    
    // Return a fallback response if Groq API fails
    return {
      success: false,
      message: 'Failed to generate AI recommendations. Using fallback recommendations.',
      recommendations: [{
        recommendation_id: `REC_FALLBACK_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        type: 'savings_allocation',
        description: 'Transfer 5000 AED to Save Pot',
        amount: 5000,
        reason: 'Fallback recommendation to continue saving toward your mortgage goal',
        implemented: false
      }] as AIRecommendation[]
    };
  }
});