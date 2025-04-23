import { simulateReemData } from '~/models/finance/reem-data';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';

export default defineEventHandler((event) => {
  // Get query parameter for number of months (default to 12 if not provided)
  const query = getQuery(event);
  const months = parseInt(query.months as string) || 12;
  
  // Get Reem's financial data
  const financialData = simulateReemData(months);
  
  // Perform AI analysis on the financial data
  const aiAnalysis = performFinancialAnalysis(financialData);
  
  // Return the analysis
  return aiAnalysis;
});