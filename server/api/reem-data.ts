import { simulateReemData } from '~/models/finance/reem-data';

export default defineEventHandler((event) => {
  // Get query parameter for number of months (default to 12 if not provided)
  const query = getQuery(event);
  const months = parseInt(query.months as string) || 12;
  
  // Simulate Reem's financial data
  const financialData = simulateReemData(months);
  
  // Return the data
  return financialData;
});