import { simulateOmarData } from '~/models/finance/omar-data';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';

export default defineEventHandler((event) => {
  // Get query parameter for number of months (default to 12 if not provided)
  const query = getQuery(event);
  const months = parseInt(query.months as string) || 12;
  
  // Get Omar's financial data
  const financialData = simulateOmarData(months);
  
  // Perform AI analysis on the financial data
  const aiAnalysis = performFinancialAnalysis(financialData);
  
  // Return the analysis
  return aiAnalysis;
});