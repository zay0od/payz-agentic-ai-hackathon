import { getFatimaDetails } from '~/models/finance/user-details';
import { FinancialData, Transaction, Account } from '~/models/finance/types';

// Set specific date for March 2025
const MARCH_2025 = {
  year: 2025,
  month: 3, // March
  days: 31,
  startDate: '2025-03-01',
  endDate: '2025-03-31'
};

// Cards data
interface Card {
  id: string;
  name: string;
  number: string;
  expiryDate: string;
  type: string;
  balance: number;
  limit: number;
  currency: string;
}

// Pots with max limit
interface Pot extends Account {
  maxLimit: number;
}

// Overview data structure
interface OverviewData {
  period: {
    year: number;
    month: number;
    days: number;
    startDate: string;
    endDate: string;
  };
  userData: any;
  financialSummary: {
    totalIncome: number;
    totalExpense: number;
    netCashflow: number;
  };
  cards: Card[];
  pots: Pot[];
  accounts: Account[];
  transactions: Transaction[];
}

// Generate a fixed set of 50 transactions for March 2025
function generateMarchTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  let checkingBalance = 30000; // Starting balance
  
  // Income transactions (salary + bonus in March)
  const salaryTransaction: Transaction = {
    transaction_id: 'T2025030001',
    date: '2025-03-01',
    account_id: 'ACC_CHECKING_FATM',
    type: 'income',
    amount: 25000,
    category: 'Salary',
    description: 'Monthly Salary',
    balance_after: (checkingBalance += 25000)
  };
  transactions.push(salaryTransaction);
  
  const bonusTransaction: Transaction = {
    transaction_id: 'T2025030002',
    date: '2025-03-28',
    account_id: 'ACC_CHECKING_FATM',
    type: 'income',
    amount: 5400,
    category: 'Bonus',
    description: 'Performance Bonus',
    balance_after: (checkingBalance += 5400)
  };
  transactions.push(bonusTransaction);
  
  // Fixed expenses
  transactions.push({
    transaction_id: 'T2025030003',
    date: '2025-03-02',
    account_id: 'ACC_CHECKING_FATM',
    type: 'expense',
    amount: 5000,
    category: 'Housing',
    description: 'Rent/Mortgage Payment',
    balance_after: (checkingBalance -= 5000)
  });
  
  transactions.push({
    transaction_id: 'T2025030004',
    date: '2025-03-05',
    account_id: 'ACC_CHECKING_FATM',
    type: 'expense',
    amount: 3650,
    category: 'Childcare',
    description: 'Monthly Childcare Fees',
    balance_after: (checkingBalance -= 3650)
  });
  
  transactions.push({
    transaction_id: 'T2025030005',
    date: '2025-03-15',
    account_id: 'ACC_CHECKING_FATM',
    type: 'expense',
    amount: 620,
    category: 'Utilities',
    description: 'Utilities Bill',
    balance_after: (checkingBalance -= 620)
  });
  
  // Special March expense - School fees
  transactions.push({
    transaction_id: 'T2025030006',
    date: '2025-03-10',
    account_id: 'ACC_CHECKING_FATM',
    type: 'expense',
    amount: 8000,
    category: 'School Fees',
    description: 'Term Fee Due Month 3',
    balance_after: (checkingBalance -= 8000)
  });
  
  // Weekly groceries (4 times in March)
  const groceryDates = ['2025-03-03', '2025-03-10', '2025-03-17', '2025-03-24'];
  let tId = 7;
  
  for (const date of groceryDates) {
    const amount = 1150 + Math.floor(Math.random() * 150); // Random amount around 1200
    transactions.push({
      transaction_id: `T202503000${tId++}`,
      date,
      account_id: 'ACC_CHECKING_FATM',
      type: 'expense',
      amount,
      category: 'Groceries',
      description: 'Weekly Groceries',
      balance_after: (checkingBalance -= amount)
    });
  }
  
  // Entertainment expenses (3 in March)
  const entertainmentDetails = [
    { date: '2025-03-07', desc: 'Family Dinner', amount: 310 },
    { date: '2025-03-14', desc: 'Movie Night', amount: 280 },
    { date: '2025-03-28', desc: 'Weekend Outing', amount: 350 }
  ];
  
  for (const item of entertainmentDetails) {
    transactions.push({
      transaction_id: `T202503000${tId++}`,
      date: item.date,
      account_id: 'ACC_CHECKING_FATM',
      type: 'expense',
      amount: item.amount,
      category: 'Entertainment',
      description: item.desc,
      balance_after: (checkingBalance -= item.amount)
    });
  }
  
  // Self-care (1 in March)
  transactions.push({
    transaction_id: `T202503000${tId++}`,
    date: '2025-03-21',
    account_id: 'ACC_CHECKING_FATM',
    type: 'expense',
    amount: 160,
    category: 'Self-care',
    description: 'Spa Day',
    balance_after: (checkingBalance -= 160)
  });
  
  // Transfer to savings
  transactions.push({
    transaction_id: `T202503000${tId++}`,
    date: '2025-03-05',
    account_id: 'ACC_CHECKING_FATM',
    type: 'transfer',
    amount: 5000,
    category: 'Transfer',
    description: 'Monthly transfer to Save Pot',
    balance_after: (checkingBalance -= 5000),
    transfer_to: 'ACC_SAVEPOT_FATM'
  });
  
  // Transfer to play pot
  transactions.push({
    transaction_id: `T202503000${tId++}`,
    date: '2025-03-05',
    account_id: 'ACC_CHECKING_FATM',
    type: 'transfer',
    amount: 1200,
    category: 'Transfer',
    description: 'Monthly transfer to Play Pot',
    balance_after: (checkingBalance -= 1200),
    transfer_to: 'ACC_PLAYPOT_FATM'
  });
  
  // Generate remaining daily expenses to reach 50 transactions
  const remainingCount = 50 - transactions.length;
  const possibleDates = [];
  
  // Create array of dates excluding ones already used
  for (let day = 1; day <= 31; day++) {
    const dateStr = `2025-03-${day.toString().padStart(2, '0')}`;
    if (!transactions.some(t => t.date === dateStr)) {
      possibleDates.push(dateStr);
    }
  }
  
  // Categories for daily expenses
  const dailyCategories = [
    { category: 'Food', description: 'Lunch', min: 50, max: 120 },
    { category: 'Food', description: 'Dinner', min: 80, max: 180 },
    { category: 'Shopping', description: 'Clothing', min: 200, max: 500 },
    { category: 'Shopping', description: 'Home items', min: 100, max: 300 },
    { category: 'Transportation', description: 'Fuel', min: 150, max: 250 },
    { category: 'Transportation', description: 'Taxi', min: 40, max: 120 },
    { category: 'Health', description: 'Pharmacy', min: 80, max: 300 },
    { category: 'Education', description: 'Books', min: 100, max: 200 }
  ];
  
  for (let i = 0; i < remainingCount; i++) {
    const dateIndex = Math.floor(Math.random() * possibleDates.length);
    const date = possibleDates[dateIndex];
    
    // Remove used date
    possibleDates.splice(dateIndex, 1);
    
    const categoryInfo = dailyCategories[Math.floor(Math.random() * dailyCategories.length)];
    const amount = Math.floor(Math.random() * (categoryInfo.max - categoryInfo.min)) + categoryInfo.min;
    
    transactions.push({
      transaction_id: `T202503000${tId++}`,
      date,
      account_id: 'ACC_CHECKING_FATM',
      type: 'expense',
      amount,
      category: categoryInfo.category,
      description: categoryInfo.description,
      balance_after: (checkingBalance -= amount)
    });
  }
  
  // Sort transactions by date
  return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export default defineEventHandler((event) => {
  // Get Fatima's user details
  const userData = getFatimaDetails();
  
  // Update some fields to match fatimaConfig
  userData.monthlySalary = 25000;
  userData.occupation = "Mid-level marketing executive";
  userData.age = 34;
  
  // Generate the transactions for March 2025
  const marchTransactions = generateMarchTransactions();
  
  // Calculate financial summary
  const totalIncome = marchTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = marchTransactions
    .filter(t => t.type === 'expense' || (t.type === 'transfer' && t.transfer_to))
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Current account balances (based on last transaction's balance_after)
  const checkingBalance = marchTransactions
    .filter(t => t.account_id === 'ACC_CHECKING_FATM')
    .slice(-1)[0].balance_after;
  
  // Create cards data
  const cards: Card[] = [
    {
      id: "CARD001",
      name: "Fatima Ahmed",
      number: "**** **** **** 4567",
      expiryDate: "09/28",
      type: "Debit",
      balance: checkingBalance,
      limit: 50000,
      currency: "AED"
    },
    {
      id: "CARD002",
      name: "Fatima Ahmed",
      number: "**** **** **** 8901",
      expiryDate: "07/27",
      type: "Credit",
      balance: 3500,
      limit: 20000,
      currency: "AED"
    }
  ];
  
  // Create pots with maximum limits
  const pots: Pot[] = [
    {
      account_id: "ACC_SAVEPOT_FATM",
      type: "Save Pot",
      currency: "AED",
      balance: 40000, // 35000 + 5000 from March transfer
      linked_goal: "MORTGAGE_SAVINGS",
      maxLimit: 200000
    },
    {
      account_id: "ACC_PLAYPOT_FATM",
      type: "Play Pot",
      currency: "AED",
      balance: 2200, // 1000 + 1200 from March transfer
      maxLimit: 5000
    }
  ];
  
  // Create accounts array
  const accounts: Account[] = [
    {
      account_id: "ACC_CHECKING_FATM",
      type: "Checking",
      currency: "AED",
      balance: checkingBalance
    },
    ...pots
  ];
  
  // Construct the overview data
  const overviewData: OverviewData = {
    period: MARCH_2025,
    userData,
    financialSummary: {
      totalIncome,
      totalExpense,
      netCashflow: totalIncome - totalExpense
    },
    cards,
    pots,
    accounts,
    transactions: marchTransactions
  };
  
  return overviewData;
});