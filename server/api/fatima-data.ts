import { simulateFatimaData } from '~/models/finance/fatima-data';

export default defineEventHandler((event) => {
  // Get query parameter for number of months (default to 12 if not provided)
  const query = getQuery(event);
  const months = parseInt(query.months as string) || 12;
  
  // Simulate Fatima's financial data
  const financialData = simulateFatimaData(months);
  
  // Return the data
  return financialData;
});