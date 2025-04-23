import { getGroqClient } from '~/server/utils/groq-service';
import { simulateFatimaData } from '~/models/finance/fatima-data';
import { AIRecommendation } from '~/models/finance/types';
import { $fetch } from 'ofetch';

// Define smaller prompt segments for token efficiency
const RECOMMENDATION_PROMPTS = {
  ROLE: "You are an AI financial advisor that analyzes financial data and generates actionable recommendations.",
  FOCUS: "Focus on optimizing savings toward goals while maintaining a balance for discretionary spending.",
  OUTPUT_FORMAT: "Your response MUST be valid JSON that follows the schema exactly.",
  JSON_ONLY: "DO NOT include any text outside the JSON structure. Only return the JSON array."
};

// Define the recommendation types for better structure
const RECOMMENDATION_TYPES = [
  "savings_allocation", // For transferring money to savings
  "spending_alert",     // For suggested spending cuts
  "goal_adjustment"     // For adjusting financial goals
];

// Helper function to sanitize and extract valid JSON
const extractValidJSON = (text) => {
  // First attempt: direct parsing
  try {
    return JSON.parse(text);
  } catch (e) {
    // Second attempt: find JSON array pattern in text
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // Third attempt: remove potential code block markers
      try {
        // Remove markdown code block syntax if present
        const cleanedText = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanedText);
      } catch (e) {
        // Give up and return empty array
        console.error('All JSON extraction attempts failed:', e);
        return [];
      }
    }
  }
  return [];
};

export default defineEventHandler(async (event) => {
  try {
    // Get query parameter for number of months (default to 12 if not provided)
    const query = getQuery(event);
    const months = parseInt(query.months as string) || 12;
    const includeRealTimeData = query.realtime !== 'false'; // Default to true
    const modelSize = query.modelSize as string || 'mini'; // 'mini' or 'standard'
    
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
    
    // Fetch real-time financial data if requested
    let realTimeData = null;
    if (includeRealTimeData) {
      try {
        // Get goals as a comma-separated string
        const goals = financialData.persona.goals
          .map(g => g.name.toLowerCase())
          .join(',');
          
        // Call our real-time data endpoint
        realTimeData = await $fetch('/api/groq-realtime-data', {
          params: {
            country: 'UAE',
            goals,
            timeframe: '12 months'
          }
        });
      } catch (rtError) {
        console.warn('Failed to fetch real-time data:', rtError);
        // Continue without real-time data if it fails
      }
    }
    
    // Break down the enhanced context into smaller chunks if available
    let enhancedContextChunks = [];
    if (realTimeData?.success && realTimeData?.data) {
      const rtd = realTimeData.data;
      
      // Market rates chunk
      enhancedContextChunks.push(`
      Current market conditions:
      - Mortgage interest rate: ${rtd.interestRates.mortgage}%
      - Savings account rate: ${rtd.interestRates.savings}%`);
      
      // Market trends chunk
      enhancedContextChunks.push(`
      Market trends:
      - Housing market: ${rtd.marketTrends.housing}
      - Inflation rate: ${rtd.marketTrends.inflation}%`);
      
      // Economic outlook chunk
      enhancedContextChunks.push(`
      Economic outlook:
      - GDP growth: ${rtd.economicIndicators.gdpGrowth}%
      - Consumer spending: ${rtd.economicIndicators.consumerSpendingTrend}`);
      
      // News chunk (only include if available and not too long)
      if (rtd.financialNews && rtd.financialNews.length > 0) {
        // Take just the first 2 news items to keep token count down
        const topNews = rtd.financialNews.slice(0, 2);
        enhancedContextChunks.push(`
        Recent financial news:
        ${topNews.map(n => `- ${n.headline} (Impact: ${n.impact})`).join('\n')}`);
      }
    }
    
    // Create a simplified schema for JSON output
    const schemaDefinition = {
      type: "array",
      items: {
        type: "object",
        properties: {
          recommendation_id: { type: "string" },
          date: { type: "string" },
          type: { type: "string", enum: RECOMMENDATION_TYPES },
          description: { type: "string" },
          amount: { type: "number" },
          reason: { type: "string" },
          implemented: { type: "boolean" }
        },
        required: ["recommendation_id", "date", "type", "description", "reason", "implemented"]
      }
    };
    
    // Choose model based on parameter
    const modelToUse = modelSize === 'mini' ? 'compound-beta-mini' : 'compound-beta';
    
    // Prepare base system prompt (combined from smaller parts for token efficiency)
    const systemPrompt = Object.values(RECOMMENDATION_PROMPTS).join(' ') + 
      " Return ONLY a valid JSON array without any markdown formatting or explanation text.";
    
    // Create financial data prompt with just essential information
    const financialDataPrompt = `
    Financial situation:
    - Monthly Income: ${income} AED
    - Monthly Expenses: ${Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0)} AED
    - Top expense categories: ${Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, amt]) => `${cat} (${amt} AED)`)
      .join(', ')}
    - Savings Goal: ${mortgageGoal.target_amount} AED for ${mortgageGoal.name}
    - Current Savings: ${savingsAccount?.balance || 0} AED
    - Target Date: ${mortgageGoal.target_date}`;
    
    // Create recommendation prompt focusing on what we need
    const recommendationRequestPrompt = `
    Please provide specific recommendations for:
    1. How much to allocate to long-term savings
    2. How much to allocate to discretionary spending
    3. Any spending categories to adjust
    
    Return ONLY a JSON array matching this schema: ${JSON.stringify(schemaDefinition, null, 2)}
    Do not wrap the JSON in code blocks or include any explanatory text.`;
    
    // Prepare messages for API call
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: financialDataPrompt }
    ];
    
    // Add enhanced context chunks if available (as separate messages to reduce token count per message)
    if (enhancedContextChunks.length > 0) {
      messages.push({ 
        role: 'user' as const, 
        content: 'Additional market context to consider:' 
      });
      
      enhancedContextChunks.forEach(chunk => {
        messages.push({ role: 'user' as const, content: chunk });
      });
    }
    
    // Add the final recommendation request
    messages.push({ role: 'user' as const, content: recommendationRequestPrompt });
    
    // Use Groq to generate AI recommendations with appropriate model
    const response = await groqClient.makeRequest('/chat/completions', {
      model: modelToUse, // Use requested model size
      messages: messages,
      response_format: { type: "json_object" }, // Enable JSON mode
      temperature: 0.2, // Lower temperature for more consistent JSON formatting
      // Only enable search for the standard model
      tools: [
        {
          type: "tavily_search",
          tavily_search: {
            enable: modelSize !== 'mini', // Only enable search for standard model
            search_type: "search", 
            max_results: 2
          }
        }
      ]
    });
    
    // Get the content from the response
    const content = response.choices[0]?.message.content || '[]';
    
    // Use our robust JSON extraction function
    const recommendations = extractValidJSON(content) as AIRecommendation[];
    
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
      },
      metadata: {
        model: modelToUse,
        realtimeDataUsed: !!realTimeData?.success,
        contextChunks: enhancedContextChunks.length,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error:any) {
    console.error('Error generating AI recommendations:', error);
    
    // Return a fallback response if Groq API fails
    return {
      success: false,
      message: `Failed to generate AI recommendations: ${error.message}`,
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