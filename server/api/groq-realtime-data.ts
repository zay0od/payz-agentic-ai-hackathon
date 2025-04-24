// filepath: c:\Users\hamsa\Desktop\payz-agentic-ai-hackathon\server\api\groq-realtime-data.ts
import { getGroqClient } from '~/server/utils/groq-service';

interface RealTimeFinancialData {
  interestRates: {
    mortgage: number;
    savings: number;
    personalLoan: number;
  };
  marketTrends: {
    housing: string; // e.g., "rising", "falling", "stable"
    stocks: string;
    inflation: number;
  };
  economicIndicators: {
    gdpGrowth: number;
    unemploymentRate: number;
    consumerSpendingTrend: string;
  };
  financialNews: {
    headline: string;
    summary: string;
    impact: string; // e.g., "positive", "negative", "neutral"
    relevance: number; // 0-100 score of relevance to user's goals
  }[];
  updated: string; // ISO date string
}

// Helper function to sanitize and extract valid JSON
const extractValidJSON = (text) => {
  // First attempt: direct parsing
  try {
    return JSON.parse(text);
  } catch (e) {
    // Second attempt: find JSON pattern in text
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
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
        // Give up and return empty object
        console.error('All JSON extraction attempts failed:', e);
        return {};
      }
    }
  }
  return {};
};

// Break down system prompts into smaller chunks
const SYSTEM_PROMPTS = {
  BASIC: "You are a financial data assistant with access to current information.",
  DATA_GATHERING: "Use your tools to search for the most up-to-date financial data related to the user's request.",
  VERIFICATION: "Always verify information from multiple sources when possible and cite where the information was found if available.",
  FORMAT_INSTRUCTIONS: "Format your response as JSON matching the required structure. Return ONLY a valid JSON object without any markdown formatting or explanation text."
};

// Break down the user prompts into smaller chunks
const USER_PROMPTS = {
  createBasicRequest: (country: string, goals: string, timeframe: string) => 
    `I need current financial information for ${country} relevant to these financial goals: ${goals}. I'm planning ${timeframe} ahead.`,
  
  createDataRequest: () => 
    `Please search for and provide: 
    1. Current interest rates (mortgage, savings accounts, personal loans)
    2. Market trends (housing market, stock market, inflation rate)`,
  
  createAdditionalDataRequest: () => 
    `3. Economic indicators (GDP growth, unemployment, consumer spending)
    4. Recent financial news that might impact my financial decisions`,
  
  createFormatRequest: () => 
    `Return only JSON data with no additional text or markdown formatting. Do not wrap the JSON in code blocks.`
};

// Return type structure for reference
const JSON_STRUCTURE = `{
  "interestRates": {
    "mortgage": number,
    "savings": number,
    "personalLoan": number
  },
  "marketTrends": {
    "housing": string,
    "stocks": string,
    "inflation": number
  },
  "economicIndicators": {
    "gdpGrowth": number,
    "unemploymentRate": number,
    "consumerSpendingTrend": string
  },
  "financialNews": [
    {
      "headline": string,
      "summary": string,
      "impact": string,
      "relevance": number
    }
  ],
  "updated": string
}`;

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event);
    const { 
      country = 'UAE', 
      goals = 'mortgage,retirement,education', 
      timeframe = '12 months'
    } = query;

    // Initialize Groq client
    const groqClient = getGroqClient(event);
    
    // Construct prompts in a modular way to reduce token length
    const systemPrompt = `${SYSTEM_PROMPTS.BASIC} ${SYSTEM_PROMPTS.DATA_GATHERING} ${SYSTEM_PROMPTS.VERIFICATION} ${SYSTEM_PROMPTS.FORMAT_INSTRUCTIONS}`;
    
    // Combine user prompts with manageable token length
    const userPrompt = [
      USER_PROMPTS.createBasicRequest(country as string, goals as string, timeframe as string),
      USER_PROMPTS.createDataRequest(),
      USER_PROMPTS.createAdditionalDataRequest(),
      USER_PROMPTS.createFormatRequest()
    ].join('\n\n');

    // Make the API call using compound-beta-mini for shorter token limit
    const response = await groqClient.makeRequest('/chat/completions', {
      model: 'compound-beta-mini', // Use smaller model with lower token limit
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" } // Enable JSON mode if supported
    });

    // Extract the content and executed tools from the response
    const content = response.choices[0]?.message?.content || '{}';
    const executedTools = response.choices[0]?.message?.executed_tools || [];

    // Use the robust JSON extraction function
    const financialData: RealTimeFinancialData = extractValidJSON(content) as RealTimeFinancialData;

    // Add timestamp if missing
    if (!financialData.updated) {
      financialData.updated = new Date().toISOString();
    }

    return {
      success: true,
      data: financialData,
      toolUsage: {
        toolsExecuted: executedTools.length,
        details: executedTools
      },
      metadata: {
        timestamp: new Date().toISOString(),
        parameters: {
          country,
          goals,
          timeframe
        }
      }
    };
  } catch (error:any) {
    console.error('Error fetching real-time financial data:', error);
    
    return {
      success: false,
      message: 'Failed to fetch real-time financial data',
      error: error.message
    };
  }
});