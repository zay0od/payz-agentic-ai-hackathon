// Financial data types for the Agentic AI Finance Challenge

export interface FinancialGoal {
  goal_id: string;
  description: string;
  target_amount: number;
  target_date: string;
  current_amount: number;
}

export interface Account {
  account_id: string;
  type: "Checking" | "Save Pot" | "Play Pot";
  currency: string;
  balance: number;
  linked_goal?: string;
}

export interface Transaction {
  transaction_id: string;
  date: string;
  account_id: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  category: string;
  description: string;
  balance_after: number;
  ai_generated?: boolean;
  transfer_to?: string;
}

export interface UserPersona {
  name: string;
  description: string;
  goals: FinancialGoal[];
}

export interface FinancialData {
  persona: UserPersona;
  accounts: Account[];
  transactions: Transaction[];
}

// AI Analysis Results Types
export interface SpendingPattern {
  category: string;
  average_monthly: number;
  trend: "increasing" | "decreasing" | "stable";
  variability: number; // 0-1 score indicating how variable this expense is
  importance: "essential" | "variable" | "discretionary";
}

export interface AIRecommendation {
  recommendation_id: string;
  date: string;
  type: "savings_allocation" | "spending_alert" | "goal_adjustment";
  description: string;
  amount?: number;
  reason: string;
  implemented: boolean;
}

export interface AIFinancialAnalysis {
  user_id: string;
  analysis_date: string;
  monthly_overview: {
    total_income: number;
    total_expenses: number;
    savings_rate: number;
    discretionary_spending: number;
  };
  spending_patterns: SpendingPattern[];
  recommendations: AIRecommendation[];
  forecast: {
    months_to_goal: number;
    projected_savings: number;
    confidence: number; // 0-1
  };
}