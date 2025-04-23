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

// Configuration for Fatima
const fatimaConfig = {
  baseSalary: 25000,
  salaryDay: 1, // Day of month salary arrives
  bonusChance: 0.15, // 15% chance of a bonus each quarter
  bonusAmountBase: 5000,
  bonusVariation: 30, // +/- 30% variation
  housingCost: 5000,
  housingCostDay: 2,
  childcareBase: 3600,
  childcareVariation: 10, // +/- 10% monthly variation
  childcareDay: 5,
  schoolFeeAmount: 8000,
  schoolFeeMonths: [1, 5, 9], // Months when school fees are due (1=Jan, 5=May, 9=Sep)
  schoolFeeDay: 10,
  groceryBase: 1200, // Per week
  groceryVariation: 15,
  utilityBase: 600,
  utilityVariation: 10,
  utilityDay: 15,
  entertainmentBase: 300, // Average monthly 'play pot' type spending
  entertainmentVariation: 50,
  entertainmentTransactionsPerMonth: 3, // How many 'fun' spends per month
  selfCareBase: 150,
  selfCareVariation: 40,
  selfCareTransactionsPerMonth: 1
};

// Main simulation function
export function simulateFatimaData(numMonths: number = 12): FinancialData {
  const startDate = new Date(new Date().getFullYear() - 1, 0, 1); // Start Jan 1st last year
  let currentDate = new Date(startDate);
  const transactions: Transaction[] = [];
  let transactionIdCounter = 1;

  // Initial state (could be fetched or set)
  let checkingBalance = 15000; // Example starting balance
  let savePotBalance = 35000;
  let playPotBalance = 1000;

  for (let month = 0; month < numMonths; month++) {
    const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // --- Income ---
    const salaryDate = new Date(monthStartDate);
    salaryDate.setDate(fatimaConfig.salaryDay);
    const salaryAmount = fatimaConfig.baseSalary;
    checkingBalance += salaryAmount;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(salaryDate),
      account_id: "ACC_CHECKING_FATM",
      type: "income",
      amount: salaryAmount,
      category: "Salary",
      description: "Monthly Salary",
      balance_after: checkingBalance
    });

    // Quarterly Bonus Check (e.g., end of Mar, Jun, Sep, Dec)
    if ([2, 5, 8, 11].includes(monthStartDate.getMonth()) && Math.random() < fatimaConfig.bonusChance) {
        const bonusAmount = generateRandomAmount(fatimaConfig.bonusAmountBase, fatimaConfig.bonusVariation);
        const bonusDate = new Date(monthStartDate);
        bonusDate.setDate(28); // Example bonus date
        checkingBalance += bonusAmount;
        transactions.push({
            transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
            date: formatDate(bonusDate),
            account_id: "ACC_CHECKING_FATM",
            type: "income",
            amount: bonusAmount,
            category: "Bonus",
            description: "Performance Bonus",
            balance_after: checkingBalance
        });
    }

    // --- Fixed & Recurring Expenses ---
    const housingDate = new Date(monthStartDate);
    housingDate.setDate(fatimaConfig.housingCostDay);
    checkingBalance -= fatimaConfig.housingCost;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(housingDate),
      account_id: "ACC_CHECKING_FATM",
      type: "expense",
      amount: fatimaConfig.housingCost,
      category: "Housing",
      description: "Rent/Mortgage Payment",
      balance_after: checkingBalance
    });

    const utilityDate = new Date(monthStartDate);
    utilityDate.setDate(fatimaConfig.utilityDay);
    const utilityAmount = generateRandomAmount(fatimaConfig.utilityBase, fatimaConfig.utilityVariation);
    checkingBalance -= utilityAmount;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(utilityDate),
      account_id: "ACC_CHECKING_FATM",
      type: "expense",
      amount: utilityAmount,
      category: "Utilities",
      description: "Utilities Bill",
      balance_after: checkingBalance
    });

    // --- Fluctuating Necessary Expenses ---
    const childcareDate = new Date(monthStartDate);
    childcareDate.setDate(fatimaConfig.childcareDay);
    const childcareAmount = generateRandomAmount(fatimaConfig.childcareBase, fatimaConfig.childcareVariation);
    checkingBalance -= childcareAmount;
    transactions.push({
      transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
      date: formatDate(childcareDate),
      account_id: "ACC_CHECKING_FATM",
      type: "expense",
      amount: childcareAmount,
      category: "Childcare",
      description: "Monthly Childcare Fees",
      balance_after: checkingBalance
    });

    // Weekly Groceries (simplified - placing them randomly within weeks)
    for (let week = 0; week < 4; week++) {
        const groceryDate = addDays(monthStartDate, (week * 7) + Math.floor(Math.random() * 6) + 1); // Random day within week
        const groceryAmount = generateRandomAmount(fatimaConfig.groceryBase, fatimaConfig.groceryVariation);
        checkingBalance -= groceryAmount;
        transactions.push({
            transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
            date: formatDate(groceryDate),
            account_id: "ACC_CHECKING_FATM",
            type: "expense",
            amount: groceryAmount,
            category: "Groceries",
            description: "Weekly Groceries",
            balance_after: checkingBalance
        });
    }

    // --- Periodic Large Expenses ---
    if (fatimaConfig.schoolFeeMonths.includes(monthStartDate.getMonth() + 1)) {
        const feeDate = new Date(monthStartDate);
        feeDate.setDate(fatimaConfig.schoolFeeDay);
        checkingBalance -= fatimaConfig.schoolFeeAmount;
        transactions.push({
            transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
            date: formatDate(feeDate),
            account_id: "ACC_CHECKING_FATM",
            type: "expense",
            amount: fatimaConfig.schoolFeeAmount,
            category: "School Fees",
            description: `Term Fee Due Month ${monthStartDate.getMonth() + 1}`,
            balance_after: checkingBalance
        });
    }

    // --- Discretionary ('Play Pot' type) Expenses ---
    for(let i=0; i < fatimaConfig.entertainmentTransactionsPerMonth; i++) {
        const entertainmentDate = addDays(monthStartDate, Math.floor(Math.random() * daysInMonth));
        const entertainmentAmount = generateRandomAmount(
          fatimaConfig.entertainmentBase / fatimaConfig.entertainmentTransactionsPerMonth, 
          fatimaConfig.entertainmentVariation
        );
        // Simulate taking from checking, AI would move to Play Pot first
        checkingBalance -= entertainmentAmount;
        transactions.push({
            transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
            date: formatDate(entertainmentDate),
            account_id: "ACC_CHECKING_FATM", // AI would ideally debit Play Pot
            type: "expense",
            amount: entertainmentAmount,
            category: "Entertainment",
            description: "Family Outing/Fun",
            balance_after: checkingBalance
        });
    }
    
    for(let i=0; i < fatimaConfig.selfCareTransactionsPerMonth; i++) {
        const selfCareDate = addDays(monthStartDate, Math.floor(Math.random() * daysInMonth));
        const selfCareAmount = generateRandomAmount(
          fatimaConfig.selfCareBase / fatimaConfig.selfCareTransactionsPerMonth, 
          fatimaConfig.selfCareVariation
        );
        checkingBalance -= selfCareAmount;
        transactions.push({
            transaction_id: `T${String(transactionIdCounter++).padStart(4, '0')}`,
            date: formatDate(selfCareDate),
            account_id: "ACC_CHECKING_FATM", // AI would ideally debit Play Pot
            type: "expense",
            amount: selfCareAmount,
            category: "Self-care",
            description: "Personal Treat",
            balance_after: checkingBalance
        });
    }

    // Move to the next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Return the simulated data
  return {
    persona: { 
      name: "Fatima",
      description: "Mid-level marketing executive, 34, working mother with husband and two kids in Downtown Dubai. Wants to save for a mortgage but has fluctuating childcare and school fee expenses.",
      goals: [
        {
          goal_id: "MORTGAGE_SAVINGS",
          description: "Save for future mortgage",
          target_amount: 200000, // Example target AED
          target_date: "2027-12-31",
          current_amount: 35000 // Example starting amount
        }
      ]
    },
    accounts: [
        { 
          account_id: "ACC_CHECKING_FATM", 
          type: "Checking", 
          currency: "AED",
          balance: checkingBalance 
        },
        { 
          account_id: "ACC_SAVEPOT_FATM", 
          type: "Save Pot", 
          currency: "AED",
          balance: savePotBalance,
          linked_goal: "MORTGAGE_SAVINGS"
        },
        { 
          account_id: "ACC_PLAYPOT_FATM", 
          type: "Play Pot", 
          currency: "AED",
          balance: playPotBalance 
        }
    ],
    transactions: transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
  };
}