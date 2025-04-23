import { simulateFatimaData } from '~/models/finance/fatima-data';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';

export default defineEventHandler((event) => {
  // Get query parameter for number of months (default to 12 if not provided)
  const query = getQuery(event);
  const months = parseInt(query.months as string) || 12;
  
  // Get Fatima's financial data
  const financialData = simulateFatimaData(months);
  
  // Perform AI analysis on the financial data
  const aiAnalysis = performFinancialAnalysis(financialData);
  
  // Return the analysis
  return aiAnalysis;
});