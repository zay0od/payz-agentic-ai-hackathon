// filepath: c:\Users\hamsa\Desktop\payz-agentic-ai-hackathon\server\api\agentic-recommendations.ts
import { defineEventHandler } from 'h3';
import { getGroqClient } from '~/server/utils/groq-service';
import { simulateFatimaData } from '~/models/finance/fatima-data';
import { simulateOmarData } from '~/models/finance/omar-data';
import { simulateReemData } from '~/models/finance/reem-data';
import { $fetch } from 'ofetch';
import { GROQ_MODELS } from '~/models/groq-client';

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body to get parameters
    const body = await readBody(event);
    const { persona = 'fatima', useRealtimeData = true } = body;
    
    // Get the appropriate data simulator based on persona
    let simulateData;
    switch (persona) {
      case 'omar':
        simulateData = simulateOmarData;
        break;
      case 'reem':
        simulateData = simulateReemData;
        break;
      case 'fatima':
      default:
        simulateData = simulateFatimaData;
        break;
    }
    
    // Get persona's financial data (12 months by default)
    const financialData = simulateData(12);
    
    // Initialize Groq client
    const groqClient = getGroqClient(event);
    
    // Calculate summary data for the last month
    const transactions = financialData.transactions;
    
    // Ensure we have valid dates to work with - some may be strings
    const today = new Date();
    
    // Instead of filtering for the last month, get the most recent month of data
    // Sort transactions by date descending (most recent first)
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Get the most recent transaction date
    const mostRecentDate = sortedTransactions.length > 0 
      ? new Date(sortedTransactions[0].date) 
      : today;
      
    // Get all transactions from the same month as the most recent transaction
    const recentTransactions = transactions.filter(t => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === mostRecentDate.getMonth() && 
             transDate.getFullYear() === mostRecentDate.getFullYear();
    });
    
    // Calculate income and expenses for the last month
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
    const primaryGoal = financialData.persona.goals[0];
    const savingsAccount = financialData.accounts.find(a => a.type === 'Save Pot');
    
    // Fetch real-time financial data if requested
    let realTimeData = null;
    let enhancedPrompt = '';
    
    if (useRealtimeData) {
      try {
        // Get goals as a comma-separated string
        const goals = financialData.persona.goals
          .map(g => g.description.toLowerCase())
          .join(',');
          
        // Call our real-time data endpoint
        const rtdResponse = await $fetch('/api/groq-realtime-data', {
          method: 'GET',
          params: {
            country: 'UAE',
            goals,
            timeframe: '12 months'
          }
        });
        
        if (rtdResponse.success) {
          realTimeData = rtdResponse.data;
          
          // Format real-time data for the prompt
          const rtd = realTimeData;
          
          enhancedPrompt = `
          Current market conditions to consider:
          - Current mortgage interest rate: ${rtd.interestRates.mortgage}%
          - Savings account interest rate: ${rtd.interestRates.savings}%
          - Housing market trend: ${rtd.marketTrends.housing}
          - Inflation rate: ${rtd.marketTrends.inflation}%
          
          Economic outlook:
          - GDP growth: ${rtd.economicIndicators.gdpGrowth}%
          - Consumer spending trend: ${rtd.economicIndicators.consumerSpendingTrend}
          
          Recent financial news:
          ${rtd.financialNews.map(n => `- ${n.headline}: ${n.summary} (Impact: ${n.impact})`).join('\n')}
          
          Consider these current economic conditions when making recommendations.`;
        }
      } catch (rtError) {
        console.warn('Failed to fetch real-time data for agentic recommendations:', rtError);
        // Continue without real-time data if it fails
      }
    }
    
    // Create a comprehensive financial context including transaction patterns
    const yearlyTransactions = sortedTransactions.filter(t => {
      const transDate = new Date(t.date);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return transDate.getTime() >= oneYearAgo.getTime();
    });

    // Calculate spending patterns and variability by category
    const spendingPatterns = Object.entries(
      yearlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = {
              transactions: [],
              total: 0
            };
          }
          acc[t.category].transactions.push(t);
          acc[t.category].total += t.amount;
          return acc;
        }, {} as Record<string, { transactions: typeof transactions[0][], total: number }>)
    ).map(([category, data]) => {
      // Group by month to analyze trends
      const byMonth: Record<string, number> = {};
      data.transactions.forEach(t => {
        const date = new Date(t.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        byMonth[monthKey] = (byMonth[monthKey] || 0) + t.amount;
      });
      
      const monthValues = Object.values(byMonth);
      const avgMonthly = data.total / Object.keys(byMonth).length;
      
      // Calculate variability (standard deviation / mean)
      const variance = monthValues.reduce((sum, val) => sum + Math.pow(val - avgMonthly, 2), 0) / monthValues.length;
      const stdDev = Math.sqrt(variance);
      const variability = avgMonthly > 0 ? stdDev / avgMonthly : 0;
      
      // Determine if spending is increasing, decreasing, or stable
      const sortedMonths = Object.keys(byMonth).sort();
      if (sortedMonths.length >= 3) {
        const firstHalf = sortedMonths.slice(0, Math.floor(sortedMonths.length / 2));
        const secondHalf = sortedMonths.slice(Math.floor(sortedMonths.length / 2));
        
        const firstHalfAvg = firstHalf.reduce((sum, month) => sum + byMonth[month], 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, month) => sum + byMonth[month], 0) / secondHalf.length;
        
        const trendDiff = secondHalfAvg - firstHalfAvg;
        const trendPercent = firstHalfAvg > 0 ? trendDiff / firstHalfAvg : 0;
        
        return {
          category,
          avgMonthly: avgMonthly,
          variability: variability,
          trend: trendPercent > 0.1 ? "increasing" : trendPercent < -0.1 ? "decreasing" : "stable",
          importance: ["Housing", "Utilities", "Childcare", "School Fees", "Groceries"].includes(category) 
            ? "essential" 
            : ["Entertainment", "Shopping", "Dining", "Wellness"].includes(category) 
              ? "discretionary" : "variable"
        };
      }
      
      return {
        category,
        avgMonthly: avgMonthly,
        variability: variability,
        trend: "stable",
        importance: ["Housing", "Utilities", "Childcare", "School Fees", "Groceries"].includes(category) 
          ? "essential" 
          : ["Entertainment", "Shopping", "Dining", "Wellness"].includes(category) 
            ? "discretionary" : "variable"
      };
    });

    // Calculate projected savings rate and time to goal
    const monthlySavingsRate = income - Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0);
    const remainingGoalAmount = primaryGoal.target_amount - (savingsAccount?.balance || 0);
    const monthsToGoal = monthlySavingsRate > 0 ? Math.ceil(remainingGoalAmount / monthlySavingsRate) : 999;
    
    // Format the comprehensive analysis for LLAMA_70B model
    const financialContext = {
      user: {
        persona: financialData.persona.name,
        description: financialData.persona.description
      },
      currentFinances: {
        income,
        expenses: expensesByCategory,
        totalExpenses: Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0),
        monthlySavingsRate,
        accounts: financialData.accounts
      },
      goals: financialData.persona.goals,
      spendingPatterns,
      projection: {
        monthsToGoal,
        projectedSavingsAfterOneYear: monthlySavingsRate * 12 + (savingsAccount?.balance || 0)
      },
      marketData: realTimeData || null
    };

    // Define the schema for the recommendations
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
        required: ["recommendation_id", "date", "type", "description", "amount", "reason", "implemented"]
      }
    };

    // First, get a detailed analysis using LLAMA_70B
    const analysisSystemPrompt = `You are an expert financial analysis AI that analyzes financial data, market conditions, and provides in-depth insights.
    Your analysis should be thorough, considering spending patterns, economic trends, and the user's financial goals.
    Focus on actionable intelligence rather than general advice.`;
    
    const analysisUserPrompt = `Analyze this comprehensive financial data and provide insights for personalized recommendations.
    
    User Profile:
    - Persona: ${financialData.persona.name}
    - Description: ${financialData.persona.description}
    
    Financial Goals:
    ${financialData.persona.goals.map(g => `- ${g.description}: Target ${g.target_amount} AED by ${g.target_date} (Currently at ${g.current_amount} AED)`).join('\n')}
    
    Current Monthly Finances:
    - Income: ${income} AED
    - Total Expenses: ${Object.values(expensesByCategory).reduce((sum, val) => sum + val, 0)} AED
    - Monthly Savings Rate: ${monthlySavingsRate} AED
    
    Spending by Category:
    ${Object.entries(expensesByCategory).map(([category, amount]) => `- ${category}: ${amount} AED`).join('\n')}
    
    Spending Patterns Analysis:
    ${spendingPatterns.map(sp => `- ${sp.category}: ${sp.avgMonthly.toFixed(2)} AED monthly (Trend: ${sp.trend}, Variability: ${(sp.variability * 100).toFixed(1)}%, Type: ${sp.importance})`).join('\n')}
    
    Current Accounts:
    ${financialData.accounts.map(a => `- ${a.type}: ${a.balance} AED${a.linked_goal ? ` (linked to ${a.linked_goal})` : ''}`).join('\n')}
    
    Projection:
    - Months to reach goal at current rate: ${monthsToGoal}
    - Projected savings after one year: ${monthlySavingsRate * 12 + (savingsAccount?.balance || 0)} AED
    
    ${enhancedPrompt}
    
    Please provide a detailed analysis of the financial situation, identifying strengths, weaknesses, opportunities, and risks.
    Consider both the personal financial data and the broader economic context.
    Focus on patterns that require attention and specific opportunities to improve financial health.`;
    
    let recommendations = [];
    let detailedAnalysis = '';
    
    try {
      // First, get the detailed analysis using LLAMA_70B
      const analysisResult = await groqClient.makeRequest('/chat/completions', {
        model: GROQ_MODELS.LLAMA_70B,
        messages: [
          { role: 'system', content: analysisSystemPrompt },
          { role: 'user', content: analysisUserPrompt }
        ],
        temperature: 0.3
      });
      
      detailedAnalysis = analysisResult.choices[0]?.message.content || '';
      
      // Now use the analysis to generate specific recommendations with the schema
      const recommendationSystemPrompt = `You are an AI financial advisor that generates actionable recommendations based on financial analysis.
      Your recommendations must follow this schema exactly:
      ${JSON.stringify(recommendationSchema, null, 2)}
      
      Each recommendation must include:
      - A unique ID (format: "REC_X" where X is a number)
      - Today's date (${new Date().toISOString().split('T')[0]})
      - A specific type: "savings_allocation", "spending_alert", or "goal_adjustment"
      - A clear description of the recommended action
      - A specific amount when applicable (in AED)
      - A detailed reason explaining the rationale behind the recommendation
      - All recommendations start as not implemented (implemented: false)
      
      Focus on:
      1. Optimal allocation of funds between savings and discretionary spending
      2. Specific spending categories that need adjustment
      3. Realistic goal adjustments based on financial capability
      4. Preparing for upcoming expenses or market changes
      
      Your response must be valid JSON with no text outside the JSON structure.`;
      
      const recommendationUserPrompt = `Based on the following financial analysis, generate specific, actionable recommendations:
      
      ${detailedAnalysis}
      
      Financial Context Summary:
      - Income: ${income} AED monthly
      - Current Savings: ${savingsAccount?.balance || 0} AED
      - Goal: ${primaryGoal.target_amount} AED by ${primaryGoal.target_date}
      - Monthly Savings Target Needed: ${Math.ceil(remainingGoalAmount / monthsToGoal)} AED
      
      Return ONLY a JSON array of recommendation objects following the schema exactly. No explanatory text.`;
      
      // Generate recommendations using compound-beta with JSON response format
      const recommendationResult = await groqClient.makeRequest('/chat/completions', {
        model: GROQ_MODELS.COMPOUND_BETA,
        messages: [
          { role: 'system', content: recommendationSystemPrompt },
          { role: 'user', content: recommendationUserPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });
      
      // Extract and parse recommendations
      const content = recommendationResult.choices[0]?.message.content || '[]';
      
      try {
        // Try to parse as JSON first
        recommendations = JSON.parse(content);
        
        // If it's not an array, look for an array in the content
        if (!Array.isArray(recommendations)) {
          const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
          if (jsonMatch) {
            recommendations = JSON.parse(jsonMatch[0]);
          } else {
            recommendations = [];
          }
        }
      } catch (parseError) {
        console.error('Error parsing recommendations JSON:', parseError);
        // Attempt to extract JSON from text content
        const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
        if (jsonMatch) {
          try {
            recommendations = JSON.parse(jsonMatch[0]);
          } catch (e) {
            recommendations = [];
          }
        } else {
          recommendations = [];
        }
      }
    } catch (aiError) {
      console.error('Error generating AI analysis or recommendations:', aiError);
      
      // Fallback to simpler recommendations if the advanced approach fails
      recommendations = await groqClient.generateFinancialRecommendations(
        income,
        expensesByCategory,
        primaryGoal.target_amount,
        savingsAccount?.balance || 0,
        primaryGoal.target_date,
        enhancedPrompt
      );
    }
    
    // Return the AI-generated recommendations with analysis context
    return {
      success: true,
      recommendations,
      analysis: detailedAnalysis ? {
        summary: detailedAnalysis.substring(0, 500) + '...',
        full: detailedAnalysis
      } : null,
      summary: {
        income,
        expenses: expensesByCategory,
        totalExpenses: Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0),
        goal: primaryGoal,
        currentSavings: savingsAccount?.balance || 0,
        spendingPatterns: spendingPatterns.slice(0, 5) // Include top spending patterns
      },
      realtimeDataUsed: !!realTimeData,
      persona
    };
  } catch (error:any) {
    console.error('Error generating agentic recommendations:', error);
    
    // Return error response
    return {
      success: false,
      message: 'Failed to generate agentic recommendations: ' + error.message,
      recommendations: []
    };
  }
});