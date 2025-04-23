import { getGroqClient } from '~/server/utils/groq-service';
import { simulateFatimaData } from '~/models/finance/fatima-data';
import { AIFinancialAnalysis } from '~/models/finance/types';
import { performFinancialAnalysis } from '~/models/finance/ai-analysis';

// Break down system prompts into smaller chunks for token efficiency
const SYSTEM_PROMPTS = {
  ROLE: "You are an expert financial analysis AI that analyzes financial data and generates actionable insights.",
  TASK: "Your analysis should focus on spending patterns, trends, and actionable intelligence.",
  FORMAT: "Your response MUST be valid JSON that follows the specified schema.",
  OUTPUT: "DO NOT include any text outside the JSON structure. Only return the JSON object."
};

// Define expected response structure schema for better parsing
const ANALYSIS_SCHEMA = {
  type: "object",
  properties: {
    monthly_overview: {
      type: "object",
      properties: {
        total_income: { type: "number" },
        total_expenses: { type: "number" },
        savings_rate: { type: "number" }
      }
    },
    spending_patterns: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          average_monthly: { type: "number" },
          trend: { type: "string" }
        }
      }
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string" },
          description: { type: "string" }
        }
      }
    }
  }
};

export default defineEventHandler(async (event) => {
  try {
    // Get query parameter for number of months (default to 12 if not provided)
    const query = getQuery(event);
    const months = parseInt(query.months as string) || 12;
    const useGroq = (query.useGroq === 'true'); // Whether to use Groq API or local analysis
    
    // Get Fatima's financial data
    const financialData = simulateFatimaData(months);
    
    // If not using Groq, use our local analysis
    if (!useGroq) {
      const localAnalysis = performFinancialAnalysis(financialData);
      return {
        success: true,
        analysis: localAnalysis,
        source: 'local'
      };
    }
    
    // Initialize Groq client for enhanced analysis
    const groqClient = getGroqClient(event);
    
    // Prepare a simplified version of the data for the AI
    const simplifiedData = {
      persona: financialData.persona,
      accounts: financialData.accounts,
      incomeByMonth: {},
      expensesByMonth: {},
      expensesByCategory: {},
      savingsRate: 0,
      transactionCount: financialData.transactions.length
    };
    
    // Aggregate data by month
    financialData.transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (t.type === 'income') {
        simplifiedData.incomeByMonth[monthKey] = (simplifiedData.incomeByMonth[monthKey] || 0) + t.amount;
      } else if (t.type === 'expense') {
        simplifiedData.expensesByMonth[monthKey] = (simplifiedData.expensesByMonth[monthKey] || 0) + t.amount;
        simplifiedData.expensesByCategory[t.category] = (simplifiedData.expensesByCategory[t.category] || 0) + t.amount;
      }
    });
    
    // Calculate overall savings rate
    const totalIncome = Object.values(simplifiedData.incomeByMonth).reduce((sum: number, val: any) => sum + val, 0);
    const totalExpenses = Object.values(simplifiedData.expensesByMonth).reduce((sum: number, val: any) => sum + val, 0);
    simplifiedData.savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
    
    // Split financial data into chunks if it's too large
    const dataStr = JSON.stringify(simplifiedData);
    let dataChunks = [];
    
    // If data is large, split it into manageable chunks of ~1000 chars
    if (dataStr.length > 3000) {
      // Split simplified data by main sections
      const dataObj = JSON.parse(dataStr);
      
      // Create chunk for personal info
      dataChunks.push(JSON.stringify({
        persona: dataObj.persona,
        accounts: dataObj.accounts,
        savingsRate: dataObj.savingsRate,
        transactionCount: dataObj.transactionCount
      }));
      
      // Create chunk for income data
      dataChunks.push(JSON.stringify({
        incomeByMonth: dataObj.incomeByMonth
      }));
      
      // Create chunks for expense data
      dataChunks.push(JSON.stringify({
        expensesByMonth: dataObj.expensesByMonth
      }));
      
      // Create chunks for category data
      dataChunks.push(JSON.stringify({
        expensesByCategory: dataObj.expensesByCategory
      }));
    } else {
      // If data is small enough, keep it as a single chunk
      dataChunks.push(dataStr);
    }
    
    // Build system prompt with reduced token length
    const systemPrompt = Object.values(SYSTEM_PROMPTS).join(' ');
    
    // Create array of messages, starting with system prompt
    let messages = [{ role: 'system' as const, content: systemPrompt }];
    
    // Add data chunks as user messages
    if (dataChunks.length === 1) {
      // Single message if data is small enough
      messages.push({ 
        role: 'user' as const, 
        content: `Analyze this financial data and provide insights as JSON: ${dataChunks[0]}`
      });
    } else {
      // Multiple messages for larger data sets
      messages.push({ 
        role: 'user' as const, 
        content: 'I will provide financial data in chunks for analysis. First chunk:'
      });
      
      // Add each data chunk as a separate message
      dataChunks.forEach((chunk, index) => {
        messages.push({ 
          role: 'user' as const, 
          content: `Data chunk ${index + 1}/${dataChunks.length}: ${chunk}`
        });
      });
      
      // Final instruction
      messages.push({ 
        role: 'user' as const, 
        content: 'Now analyze all the chunks together and provide financial analysis as a JSON object.'
      });
    }
    
    // Use Groq's smaller model to handle the shorter token length
    const response = await groqClient.makeRequest('/chat/completions', {
      model: 'gemma2-9b-it', // Using a smaller model with lower token limit
      messages: messages,
      response_format: { type: "json_object" }, // Enable JSON mode
      temperature: 0.2 // Lower temperature for consistent formatting
    });
    
    // Extract and parse content
    let enhancedAnalysis = {};
    const content = response.choices[0]?.message.content || '{}';
    
    try {
      // Parse the JSON content
      enhancedAnalysis = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      // Try to extract JSON from text if parsing fails
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        enhancedAnalysis = JSON.parse(jsonMatch[0]);
      }
    }
    
    // Merge with our local analysis for comprehensive results
    const localAnalysis = performFinancialAnalysis(financialData);
    
    // Return the combined analysis
    return {
      success: true,
      analysis: {
        ...localAnalysis,
        // Override with Groq's enhanced analysis where available
        ...enhancedAnalysis,
        // Keep our local recommendations if Groq didn't provide any
        recommendations: enhancedAnalysis.recommendations || localAnalysis.recommendations
      },
      source: 'groq+local',
      metadata: {
        model: 'gemma2-9b-it',
        chunks: dataChunks.length,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Error generating AI financial analysis:', error);
    
    // Fallback to local analysis if Groq API fails
    const financialData = simulateFatimaData(12);
    const localAnalysis = performFinancialAnalysis(financialData);
    
    return {
      success: false,
      message: 'Failed to generate enhanced AI analysis. Using local analysis instead.',
      analysis: localAnalysis,
      source: 'local_fallback'
    };
  }
});