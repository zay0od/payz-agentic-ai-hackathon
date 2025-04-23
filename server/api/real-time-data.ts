// filepath: c:\Users\hamsa\Desktop\payz-agentic-ai-hackathon\server\api\real-time-data.ts
import { defineEventHandler } from 'h3';

// This is a simple wrapper around our groq-realtime-data endpoint
// It's used by our test UI to fetch real-time financial data
export default defineEventHandler(async (event) => {
  // Get the query parameters
  const query = getQuery(event);
  const { country, goals, timeframe = '12 months' } = query;
  
  try {
    // Call our groq-realtime-data endpoint
    const realtimeData = await fetch(`http://localhost:3000/api/groq-realtime-data?country=${country}&goals=${goals}&timeframe=${timeframe}`);
    const data = await realtimeData.json();
    
    // Return just the data portion to simplify integration with our UI
    return data.success ? data.data : {
      interestRates: { mortgage: 0, savings: 0, personalLoan: 0 },
      marketTrends: { housing: 'unknown', stocks: 'unknown', inflation: 0 },
      economicIndicators: { gdpGrowth: 0, unemploymentRate: 0, consumerSpendingTrend: 'unknown' },
      financialNews: [],
      updated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in real-time-data wrapper:', error);
    return {
      interestRates: { mortgage: 0, savings: 0, personalLoan: 0 },
      marketTrends: { housing: 'error', stocks: 'error', inflation: 0 },
      economicIndicators: { gdpGrowth: 0, unemploymentRate: 0, consumerSpendingTrend: 'error' },
      financialNews: [{
        headline: 'Error fetching data',
        summary: error.message,
        impact: 'negative',
        relevance: 100
      }],
      updated: new Date().toISOString()
    };
  }
});