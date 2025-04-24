import { AIRecommendation, AIFinancialAnalysis, SpendingPattern } from './finance/types';

// Type definitions for Groq API responses
interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
      executed_tools?: any[];
    };
  }[];
}

// Available Groq models
export const GROQ_MODELS = {
  // Agentic models - can use tools like web search and code execution
  COMPOUND_BETA: 'compound-beta', // Multiple tool calls per request
  COMPOUND_BETA_MINI: 'compound-beta-mini', // Single tool call per request
  
  // LLM models with different capabilities and sizes
  LLAMA_70B: 'llama-3.3-70b-versatile', // High capability, larger context
  LLAMA_8B: 'llama3-8b-8192', // Fast, decent capability
  GEMMA2_9B: 'gemma2-9b-it', // Good balance of performance and speed
  
  // Other specialized models
  LLAMA_GUARD: 'llama-guard-3-8b', // For content moderation
}

// Configuration for the Groq API client
export class GroqApiClient {
  private apiKey: string;
  private baseUrl: string = 'https://api.groq.com/openai/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Make a request to the Groq API
   */
  public async makeRequest(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error making request to Groq API:', error);
      throw error;
    }
  }

  /**
   * Clean up potential text surrounding JSON content
   * This helps handle cases where the model outputs text before or after JSON
   */
  private cleanJsonResponse(content: string): string {
    // Try to find JSON content between backticks or triple backticks
    const backtickMatch = content.match(/```(?:json)?([\s\S]*?)```|`([\s\S]*?)`/);
    if (backtickMatch) {
      // Return the content between backticks, preferring the first match group (triple backticks)
      return (backtickMatch[1] || backtickMatch[2]).trim();
    }
    
    // Try to find content that looks like a JSON object or array
    const jsonMatch = content.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (jsonMatch) {
      return jsonMatch[1].trim();
    }
    
    // If we can't find structured JSON, return the original content
    return content;
  }
  
  /**
   * Parse JSON safely with better error handling
   */
  private safeJsonParse(content: string, fallback: any = null): any {
    try {
      // Clean the response first
      const cleanedContent = this.cleanJsonResponse(content);
      
      // Try to parse the JSON
      return JSON.parse(cleanedContent);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.log('Raw content:', content);
      return fallback;
    }
  }

  /**
   * Generate recommendations using the Groq Agentic AI with JSON mode
   */
  async generateFinancialRecommendations(
    income: number,
    expenses: Record<string, number>,
    savingsGoal: number,
    currentSavings: number,
    targetDate: string,
    enhancedContext: string = '' // New parameter for real-time data context
  ): Promise<AIRecommendation[]> {
    // Create a schema for the AIRecommendation to properly structure the JSON response
    const recommendationSchema = {
      type: "array",
      items: {
        type: "object",
        properties: {
          recommendation_id: { type: "string" },
          date: { type: "string", format: "date" },
          type: { type: "string", enum: ["savings_allocation", "spending_alert", "goal_adjustment"] },
          description: { type: "string" },
          amount: { type: "number" },
          reason: { type: "string" },
          implemented: { type: "boolean" }
        },
        required: ["recommendation_id", "date", "type", "description", "reason", "implemented"]
      }
    };
    
    const systemPrompt = `You are an AI financial advisor that analyzes financial data and generates actionable recommendations.
    Focus on optimizing savings toward goals while maintaining a balance for discretionary spending.
    
    Your response MUST be valid JSON that follows this schema exactly:
    ${JSON.stringify(recommendationSchema, null, 2)}
    
    DO NOT include any text outside the JSON structure. Only return the JSON array.
    
    Each recommendation should have:
    - recommendation_id: A unique string (e.g., "REC_" followed by a timestamp or UUID)
    - date: Current date in YYYY-MM-DD format 
    - type: One of "savings_allocation", "spending_alert", or "goal_adjustment"
    - description: A short, clear description
    - amount: Numeric value if applicable (for allocations)
    - reason: Explanation for the recommendation
    - implemented: Always set to false initially
    
    For savings_allocation recommendations, calculate specific amounts to transfer based on the financial data.`;
    
    let userPrompt = `
    Here is my current financial situation:
    - Monthly Income: ${income} AED
    - Monthly Expenses:
      ${Object.entries(expenses).map(([category, amount]) => `- ${category}: ${amount} AED`).join('\n      ')}
    - Savings Goal: ${savingsGoal} AED
    - Current Savings: ${currentSavings} AED
    - Target Date: ${targetDate}
    
    Please provide specific recommendations for:
    1. How much to allocate to my Save Pot (long-term savings)
    2. How much to allocate to my Play Pot (discretionary spending)
    3. Any spending categories I should adjust
    4. How to prepare for any upcoming large expenses
    
    Remember to return ONLY a JSON array with no explanatory text.`;
    
    // Add real-time data context if provided
    if (enhancedContext) {
      userPrompt += `\n\n${enhancedContext}`;
    }
    
    try {
      // Using the compound-beta model for its agentic capabilities with JSON mode enabled
      const result = await this.makeRequest('/chat/completions', {
        model: GROQ_MODELS.COMPOUND_BETA,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2, // Lower temperature for more consistent JSON formatting
        response_format: { type: "json_object" }, // Enable JSON mode
        tools: [
          {
            type: "function", // This is the required format - 'function' is the only allowed value
            function: {
              name: "financial_recommendations", 
              description: "Generate financial recommendations based on user's financial data",
              parameters: recommendationSchema
            }
          }
        ]
      }) as GroqChatCompletionResponse;
      
      // Get the content from the response
      const content = result.choices[0]?.message.content || '[]';
      
      // Parse the JSON using our safe parsing function
      const recommendations = this.safeJsonParse(content, []);
      
      // Ensure the response is an array
      if (!Array.isArray(recommendations)) {
        console.warn('Unexpected response format from Groq API, expected array but got:', typeof recommendations);
        return [];
      }
      
      return recommendations as AIRecommendation[];
    } catch (error) {
      console.error('Error generating recommendations from Groq API:', error);
      return [];
    }
  }
  
  /**
   * Generate a comprehensive financial analysis using Groq's LLM with JSON mode
   */
  async generateFinancialAnalysis(financialData: string): Promise<Partial<AIFinancialAnalysis>> {
    // Create a schema for the AIFinancialAnalysis to properly structure the JSON response
    const analysisSchema = {
      type: "object",
      properties: {
        user_id: { type: "string" },
        analysis_date: { type: "string", format: "date" },
        monthly_overview: {
          type: "object",
          properties: {
            total_income: { type: "number" },
            total_expenses: { type: "number" },
            savings_rate: { type: "number" },
            discretionary_spending: { type: "number" }
          }
        },
        spending_patterns: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              average_monthly: { type: "number" },
              trend: { type: "string", enum: ["increasing", "decreasing", "stable"] },
              variability: { type: "number" },
              importance: { type: "string", enum: ["essential", "variable", "discretionary"] }
            }
          }
        },
        recommendations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              recommendation_id: { type: "string" },
              date: { type: "string" },
              type: { type: "string" },
              description: { type: "string" },
              amount: { type: "number" },
              reason: { type: "string" },
              implemented: { type: "boolean" }
            }
          }
        },
        forecast: {
          type: "object",
          properties: {
            months_to_goal: { type: "number" },
            projected_savings: { type: "number" },
            confidence: { type: "number" }
          }
        }
      }
    };
    
    const systemPrompt = `You are an expert financial analysis AI that analyzes financial data and generates comprehensive insights.
    Your analysis should focus on spending patterns, trends, and actionable intelligence.
    
    Your response MUST be valid JSON that follows the specified schema.
    DO NOT include any text outside the JSON structure. Only return the JSON object.`;
    
    try {
      const result = await this.makeRequest('/chat/completions', {
        model: GROQ_MODELS.LLAMA_70B, // Using the most capable model for detailed analysis
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this financial data and provide insights: ${financialData}` }
        ],
        response_format: { type: "json_object" }, // Enable JSON mode
        temperature: 0.2 // Lower temperature for more consistent JSON formatting
      }) as GroqChatCompletionResponse;
      
      // Get the content from the response
      const content = result.choices[0]?.message.content || '{}';
      
      // Parse the JSON using our safe parsing function
      return this.safeJsonParse(content, {}) as Partial<AIFinancialAnalysis>;
    } catch (error) {
      console.error('Error generating analysis from Groq API:', error);
      return {};
    }
  }
  
  /**
   * Query the model for real-time financial advice about a specific situation
   */
  async getFinancialAdvice(query: string, useJsonResponse: boolean = false): Promise<string | any> {
    const systemPrompt = `You are a helpful financial advisor. Provide practical, actionable advice 
    to financial questions. Keep your advice clear, specific, and focused on the user's situation.`;
    
    const requestOptions: any = {
      model: GROQ_MODELS.COMPOUND_BETA, // Use agentic model for potentially searching for real-time info
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ]
    };
    
    // Add JSON response format if requested
    if (useJsonResponse) {
      requestOptions.response_format = { type: "json_object" };
    }
    
    try {
      const result = await this.makeRequest('/chat/completions', requestOptions) as GroqChatCompletionResponse;
      
      const content = result.choices[0]?.message.content || 'Unable to generate advice at this time.';
      
      // If JSON response was requested, try to parse it
      if (useJsonResponse) {
        return this.safeJsonParse(content, { error: 'Failed to parse JSON response', raw_content: content });
      }
      
      return content;
    } catch (error:any) {
      console.error('Error getting financial advice from Groq API:', error);
      return useJsonResponse 
        ? { error: 'API request failed', message: error.message } 
        : `Sorry, I couldn't generate financial advice at this time. Error: ${error.message}`;
    }
  }
  
  /**
   * Get information about executed tools used by compound-beta models
   */
  getExecutedToolsInfo(response: GroqChatCompletionResponse): any[] {
    return response.choices[0]?.message.executed_tools || [];
  }
}