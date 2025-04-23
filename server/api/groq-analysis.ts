import { getGroqClient } from '~/server/utils/groq-service';
import { simulateFatimaData } from '~/models/finance/fatima-data';
import { AIFinancialAnalysis } from '~/models/finance/types';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';

export default defineEventHandler(async (event) => {
  try {
    // Get query parameter for number of months (default to 12 if not provided)
    const query = getQuery(event);
    const months = parseInt(query.months as string) || 12;
    const useGroq = (query.useGroq === 'true'); // Whether to use Groq API or local analysis
    
    // Get Fatima's financial data
    const financialData = simulateFatimaData(months);
    
    // If not using Groq, use our local analysis
    if (!useGroq) {
      const localAnalysis = performFinancialAnalysis(financialData);
      return {
        success: true,
        analysis: localAnalysis,
        source: 'local'
      };
    }
    
    // Initialize Groq client for enhanced analysis
    const groqClient = getGroqClient(event);
    
    // Prepare a simplified version of the data for the AI
    const simplifiedData = {
      persona: financialData.persona,
      accounts: financialData.accounts,
      incomeByMonth: {},
      expensesByMonth: {},
      expensesByCategory: {},
      savingsRate: 0,
      transactionCount: financialData.transactions.length
    };
    
    // Aggregate data by month
    financialData.transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (t.type === 'income') {
        simplifiedData.incomeByMonth[monthKey] = (simplifiedData.incomeByMonth[monthKey] || 0) + t.amount;
      } else if (t.type === 'expense') {
        simplifiedData.expensesByMonth[monthKey] = (simplifiedData.expensesByMonth[monthKey] || 0) + t.amount;
        simplifiedData.expensesByCategory[t.category] = (simplifiedData.expensesByCategory[t.category] || 0) + t.amount;
      }
    });
    
    // Calculate overall savings rate
    const totalIncome = Object.values(simplifiedData.incomeByMonth).reduce((sum: number, val: any) => sum + val, 0);
    const totalExpenses = Object.values(simplifiedData.expensesByMonth).reduce((sum: number, val: any) => sum + val, 0);
    simplifiedData.savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
    
    // Use Groq's LLM for enhanced financial analysis
    const enhancedAnalysis = await groqClient.generateFinancialAnalysis(JSON.stringify(simplifiedData));
    
    // Merge with our local analysis for comprehensive results
    const localAnalysis = performFinancialAnalysis(financialData);
    
    // Return the combined analysis
    return {
      success: true,
      analysis: {
        ...localAnalysis,
        // Override with Groq's enhanced analysis where available
        ...enhancedAnalysis,
        // Keep our local recommendations if Groq didn't provide any
        recommendations: enhancedAnalysis.recommendations || localAnalysis.recommendations
      },
      source: 'groq+local'
    };
  } catch (error) {
    console.error('Error generating AI financial analysis:', error);
    
    // Fallback to local analysis if Groq API fails
    const financialData = simulateFatimaData(12);
    const localAnalysis = performFinancialAnalysis(financialData);
    
    return {
      success: false,
      message: 'Failed to generate enhanced AI analysis. Using local analysis instead.',
      analysis: localAnalysis,
      source: 'local_fallback'
    };
  }
});