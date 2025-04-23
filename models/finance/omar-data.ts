import { FinancialData, Transaction, Account } from './types';

// Helper function to generate a random amount within a percentage variation
function generateRandomAmount(baseAmount: number, variationPercentage: number): number {
  const variation = baseAmount * (variationPercentage / 100);
  const min = baseAmount - variation;
  const max = baseAmount + variation;
  return Math.random() * (max - min) + min;
}

// Helper to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Format a date to YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Configuration for Omar
const omarConfig = {
  // Freelancer with unpredictable income patterns
  baseFreelanceRate: 10000, // Average project value in AED
  projectFrequencyMin: 0, // Min projects per month
  projectFrequencyMax: 3, // Max projects per month
  projectValueVariation: 50, // High variation (±50%) in project income
  
  // Small consistent supplementary income (e.g., passive income from design assets)
  supplementaryIncome: 2000,
  supplementaryIncomeDay: 1, // Day of month for supplementary income
  supplementaryIncomeChance: 0.9, // 90% chance each month
  
  // Expenses
  rentAmount: 6000, // Dubai Marina rent
  rentDay: 5, // Day of month for rent
  
  groceryBase: 800, // Per week
  groceryVariation: 20,
  
  utilitiesBase: 800,
  utilitiesVariation: 15,
  utilitiesDay: 10,
  
  subscriptionsAmount: 400, // Design software, asset libraries, etc.
  subscriptionsDay: 15,
  
  // Social life (variable)
  entertainmentBase: 1500, // Relatively high for Dubai Marina lifestyle
  entertainmentVariation: 60, // Highly variable based on current income
  entertainmentTransactionsPerMonth: 4, // Weekly outings
  
  // Professional expenses
  professionalExpensesBase: 1000, // Equipment, courses, networking events, etc.
  professionalExpensesChance: 0.4, // 40% chance per month
  professionalExpensesVariation: 70 // Highly variable
};

// Generate freelance projects for a given month
function generateFreelanceProjects(monthStartDate: Date): Transaction[] {
  const transactions: Transaction[] = [];
  let projectId = 1;
  
  // Random number of projects this month
  const numProjects = Math.floor(
    Math.random() * (omarConfig.projectFrequencyMax - omarConfig.projectFrequencyMin + 1) + 
    omarConfig.projectFrequencyMin
  );
  
  for (let i = 0; i < numProjects; i++) {
    // Randomize project completion date within the month
    const daysInMonth = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth() + 1, 0).getDate();
    const projectDay = Math.floor(Math.random() * daysInMonth) + 1;
    const projectDate = new Date(monthStartDate);
    projectDate.setDate(projectDay);
    
    // Randomize project value with high variability
    const projectValue = generateRandomAmount(
      omarConfig.baseFreelanceRate, 
      omarConfig.projectValueVariation
    );
    
    // Create project income transaction
    transactions.push({
      transaction_id: `P${String(monthStartDate.getFullYear()).slice(-2)}${monthStartDate.getMonth() + 1}_${projectId++}`,
      date: formatDate(projectDate),
      account_id: "ACC_CHECKING_OMAR",
      type: "income",
      amount: projectValue,
      category: "Freelance",
      description: `Project Payment: ${['Logo Design', 'Website Redesign', 'Branding Package', 'UI/UX Work', 'Illustration Project'][Math.floor(Math.random() * 5)]}`,
      balance_after: 0 // Will be calculated later
    });
  }
  
  return transactions;
}

// Main simulation function
export function simulateOmarData(numMonths: number = 12): FinancialData {
  const startDate = new Date(new Date().getFullYear() - 1, 0, 1); // Start Jan 1st last year
  let currentDate = new Date(startDate);
  const transactions: Transaction[] = [];
  let transactionIdCounter = 1;

  // Initial state (could be fetched or set)
  let checkingBalance = 8000; // Starting with lower checking than Fatima
  let savePotBalance = 20000;
  let playPotBalance = 2000;

  for (let month = 0; month < numMonths; month++) {
    const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // --- Income ---
    // 1. Freelance project income (unpredictable)
    const freelanceTransactions = generateFreelanceProjects(monthStartDate);
    
    // Update balances for each transaction
    for (const transaction of freelanceTransactions) {
      checkingBalance += transaction.amount;
      transaction.balance_after = checkingBalance;
      transactions.push(transaction);
    }
    
    // 2. Supplementary income (more consistent but not guaranteed)
    if (Math.random() < omarConfig.supplementaryIncomeChance) {
      const supplementaryDate = new Date(monthStartDate);
      supplementaryDate.setDate(omarConfig.supplementaryIncomeDay);
      
      checkingBalance += omarConfig.supplementaryIncome;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(supplementaryDate),
        account_id: "ACC_CHECKING_OMAR",
        type: "income",
        amount: omarConfig.supplementaryIncome,
        category: "Passive Income",
        description: "Asset Library Sales",
        balance_after: checkingBalance
      });
    }

    // --- Fixed & Recurring Expenses ---
    // 1. Rent (Dubai Marina - expensive)
    const rentDate = new Date(monthStartDate);
    rentDate.setDate(omarConfig.rentDay);
    checkingBalance -= omarConfig.rentAmount;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(rentDate),
      account_id: "ACC_CHECKING_OMAR",
      type: "expense",
      amount: omarConfig.rentAmount,
      category: "Housing",
      description: "Dubai Marina Apartment Rent",
      balance_after: checkingBalance
    });
    
    // 2. Utilities
    const utilitiesDate = new Date(monthStartDate);
    utilitiesDate.setDate(omarConfig.utilitiesDay);
    const utilitiesAmount = generateRandomAmount(omarConfig.utilitiesBase, omarConfig.utilitiesVariation);
    checkingBalance -= utilitiesAmount;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(utilitiesDate),
      account_id: "ACC_CHECKING_OMAR",
      type: "expense",
      amount: utilitiesAmount,
      category: "Utilities",
      description: "DEWA Bill & Internet",
      balance_after: checkingBalance
    });
    
    // 3. Software Subscriptions (important for work)
    const subscriptionsDate = new Date(monthStartDate);
    subscriptionsDate.setDate(omarConfig.subscriptionsDay);
    checkingBalance -= omarConfig.subscriptionsAmount;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(subscriptionsDate),
      account_id: "ACC_CHECKING_OMAR",
      type: "expense",
      amount: omarConfig.subscriptionsAmount,
      category: "Subscriptions",
      description: "Adobe Creative Cloud, Stock Photos, etc.",
      balance_after: checkingBalance
    });

    // --- Variable Expenses ---
    // 1. Weekly Groceries
    for (let week = 0; week < 4; week++) {
      const groceryDate = addDays(monthStartDate, (week * 7) + Math.floor(Math.random() * 6) + 1);
      const groceryAmount = generateRandomAmount(omarConfig.groceryBase, omarConfig.groceryVariation);
      checkingBalance -= groceryAmount;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(groceryDate),
        account_id: "ACC_CHECKING_OMAR",
        type: "expense",
        amount: groceryAmount,
        category: "Groceries",
        description: "Weekly Groceries",
        balance_after: checkingBalance
      });
    }
    
    // 2. Entertainment & Social (more when income is good, less when it's tight)
    // Base entertainment on how good income was this month
    const monthlyIncome = freelanceTransactions.reduce((sum, t) => sum + t.amount, 0) + 
                         (Math.random() < omarConfig.supplementaryIncomeChance ? omarConfig.supplementaryIncome : 0);
    const incomeMultiplier = Math.min(2, Math.max(0.5, monthlyIncome / (omarConfig.baseFreelanceRate * 1.5)));
    
    for (let i = 0; i < omarConfig.entertainmentTransactionsPerMonth; i++) {
      const entertainmentDate = addDays(monthStartDate, Math.floor(Math.random() * daysInMonth));
      // Entertainment scales with income
      const baseAmount = omarConfig.entertainmentBase * incomeMultiplier / omarConfig.entertainmentTransactionsPerMonth;
      const entertainmentAmount = generateRandomAmount(baseAmount, omarConfig.entertainmentVariation);
      
      checkingBalance -= entertainmentAmount;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(entertainmentDate),
        account_id: "ACC_CHECKING_OMAR",
        type: "expense",
        amount: entertainmentAmount,
        category: "Entertainment",
        description: ["Dinner at Marina Restaurant", "Nightclub", "Weekend Brunch", "Beach Club"][Math.floor(Math.random() * 4)],
        balance_after: checkingBalance
      });
    }
    
    // 3. Professional Expenses (occasional but important)
    if (Math.random() < omarConfig.professionalExpensesChance) {
      const professionalDate = addDays(monthStartDate, Math.floor(Math.random() * daysInMonth));
      const professionalAmount = generateRandomAmount(
        omarConfig.professionalExpensesBase, 
        omarConfig.professionalExpensesVariation
      );
      
      checkingBalance -= professionalAmount;
      transactions.push({
        transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
        date: formatDate(professionalDate),
        account_id: "ACC_CHECKING_OMAR",
        type: "expense",
        amount: professionalAmount,
        category: "Professional",
        description: ["Design Conference", "New Graphics Tablet", "Online Course", "Networking Event"][Math.floor(Math.random() * 4)],
        balance_after: checkingBalance
      });
    }

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Return the simulated data
  return {
    persona: { 
      name: "Omar",
      description: "Freelance graphic designer, 28, living in Dubai Marina. Has unpredictable project-based income and wants to buy property in the next 3 years.",
      goals: [
        {
          goal_id: "PROPERTY_PURCHASE",
          description: "Save for property down payment",
          target_amount: 300000, // Target AED for down payment
          target_date: "2028-04-23", // 3 years from current date (April 23, 2025)
          current_amount: 20000 // Starting amount in savings
        }
      ]
    },
    accounts: [
        { 
          account_id: "ACC_CHECKING_OMAR", 
          type: "Checking", 
          currency: "AED",
          balance: checkingBalance 
        },
        { 
          account_id: "ACC_SAVEPOT_OMAR", 
          type: "Save Pot", 
          currency: "AED",
          balance: savePotBalance,
          linked_goal: "PROPERTY_PURCHASE"
        },
        { 
          account_id: "ACC_PLAYPOT_OMAR", 
          type: "Play Pot", 
          currency: "AED",
          balance: playPotBalance 
        }
    ],
    transactions: transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
  };
}