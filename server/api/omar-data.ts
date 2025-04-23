import { simulateOmarData } from '~/models/finance/omar-data';

export default defineEventHandler((event) => {
  // Get query parameter for number of months (default to 12 if not provided)
  const query = getQuery(event);
  const months = parseInt(query.months as string) || 12;
  
  // Simulate Omar's financial data
  const financialData = simulateOmarData(months);
  
  // Return the data
  return financialData;
});