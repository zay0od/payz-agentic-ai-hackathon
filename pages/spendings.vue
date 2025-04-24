<template>
  <div class="page-wrapper">
    <PageTransition>
      <div class="spendings-container">
        <header class="header">
          <div class="header-top">
            <button class="icon-button" aria-label="Home" @click="navigateTo('/dashboard')">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </button>
            <div class="tabs">
              <button class="tab-button" :class="{ active: currentRoute === '/spendings' }" @click="navigateTo('/spendings')">Spendings</button>
              <button class="tab-button" :class="{ active: currentRoute === '/savings' }" @click="navigateTo('/savings')">Savings Goal</button>
            </div>
            <div class="header-icons">
              <button class="icon-button" aria-label="Add">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <button class="icon-button" aria-label="Settings" @click="navigateTo('/settings')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="month-label">March, 2025</div>
        </header>
        
        <div class="page-header">
          <h1 class="page-title">Spendings</h1>
          <p class="page-subtitle">Track and analyze your spending patterns.</p>
        </div>
        
        <div class="content">
          
          <div class="total-balance">
            <h2>Total Balance</h2>
            <p class="amount">AED 4,278.90</p>
          </div>

          <div class="spending-stats">
            <div class="stat-card">
              <h3>Total Spent</h3>
              <p class="amount">AED {{ totalSpent.toFixed(2) }}</p>
            </div>
            <div class="stat-card">
              <h3>Daily Average</h3>
              <p class="amount">AED {{ dailyAverage.toFixed(2) }}</p>
              <p class="period">March 2025 (31 days)</p>
            </div>
          </div>

          <!-- Budget Cards Section -->
          <div class="budget-cards">
            <h2>Budget Progress</h2>
            <div class="card-grid">
              <div v-for="budget in budgets" :key="budget.category" class="budget-card">
                <div class="card-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon">
                    <!-- Food Icon -->
                    <template v-if="budget.category === 'Food'">
                      <path d="M17 9V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3"/>
                      <path d="M12 13v9"/>
                      <path d="M8 22h8"/>
                      <path d="M18 9H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z"/>
                    </template>
                    
                    <!-- Transport Icon -->
                    <template v-if="budget.category === 'Transport'">
                      <rect x="1" y="3" width="15" height="13"/>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/>
                      <circle cx="18.5" cy="18.5" r="2.5"/>
                    </template>
                    
                    <!-- Shopping Icon -->
                    <template v-if="budget.category === 'Shopping'">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </template>
                    
                    <!-- Entertainment Icon -->
                    <template v-if="budget.category === 'Entertainment'">
                      <path d="M12 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3Z"/>
                      <path d="M19 6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V9a3 3 0 0 0-3-3Z"/>
                      <path d="M5 6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V9a3 3 0 0 0-3-3Z"/>
                    </template>
                    
                    <!-- Fitness Icon -->
                    <template v-if="budget.category === 'Fitness'">
                      <path d="M18.6 9.2c2.7 2.7 2.7 7.1 0 9.8s-7.1 2.7-9.8 0-2.7-7.1 0-9.8 7.1-2.7 9.8 0"/>
                      <circle cx="13.7" cy="14.1" r="2.5"/>
                    </template>
                  </svg>
                </div>
                <div class="card-details">
                  <h3 class="card-category">{{ budget.category }}</h3>
                  <p class="card-amount">AED {{ budget.spent.toFixed(2) }} / AED {{ budget.limit.toFixed(2) }}</p>
                  <div class="progress-bar-container">
                    <div class="progress-bar" :class="{ 'over-budget': budget.percentage > 100 }" :style="{ width: Math.min(budget.percentage, 100) + '%' }"></div>
                  </div>
                  <span class="card-percentage" :class="{ 'over-budget': budget.percentage > 100 }">{{ budget.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
          <!-- End Budget Cards Section -->

       
        </div>
      </div>
    </PageTransition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PageTransition from '~/components/PageTransition.vue';

const router = useRouter();
const route = useRoute();
const currentRoute = ref(route.path);

const navigateTo = (path) => {
  router.push(path);
  currentRoute.value = path;
};

// Transaction data from dashboard
const transactions = ref([
  { name: 'Grocery Shopping', type: 'Food', amount: -150.50, category: 'food', date: 'Mar 15' },
  { name: 'Restaurant Dinner', type: 'Food', amount: -85.00, category: 'food', date: 'Mar 14' },
  { name: 'Uber Ride', type: 'Transport', amount: -45.00, category: 'transport', date: 'Mar 13' },
  { name: 'Movie Tickets', type: 'Entertainment', amount: -120.00, category: 'entertainment', date: 'Mar 12' },
  { name: 'Shopping Mall', type: 'Shopping', amount: -420.00, category: 'shopping', date: 'Mar 11' },
  { name: 'Gym Membership', type: 'Fitness', amount: -200.00, category: 'fitness', date: 'Mar 10' },
  { name: 'Bus Fare', type: 'Transport', amount: -15.00, category: 'transport', date: 'Mar 9' },
  { name: 'Coffee Shop', type: 'Food', amount: -25.50, category: 'food', date: 'Mar 8' },
]);

// Calculate total spent
const totalSpent = computed(() => {
  return Math.abs(transactions.value.reduce((sum, transaction) => sum + transaction.amount, 0));
});

// Calculate daily average
const dailyAverage = computed(() => {
  const daysInMonth = 31; // March 2025
  return totalSpent.value / daysInMonth;
});

// Calculate spending by category
const spendingByCategory = computed(() => {
  const categories = {};
  transactions.value.forEach(transaction => {
    if (!categories[transaction.category]) {
      categories[transaction.category] = 0;
    }
    categories[transaction.category] += Math.abs(transaction.amount);
  });
  return categories;
});

// Budget limits for each category
const budgetLimits = {
  food: 300,
  transport: 250,
  shopping: 500,
  entertainment: 200,
  fitness: 250
};

// Computed property for budget data
const budgets = computed(() => {
  return Object.entries(spendingByCategory.value).map(([category, spent]) => {
    const limit = budgetLimits[category] || 0;
    const percentage = Math.min(Math.round((spent / limit) * 100), 100);
    
    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      spent,
      limit,
      percentage,
      icon: category
    };
  });
});

definePageMeta({
  title: "Spendings",
});
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  min-height: 100vh;
}

.spendings-container {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;
  /* border: 2px solid #333; */
  border-radius: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 100vh;
}

.header {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  gap: 0.5rem;
  margin-bottom: 0;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.month-label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  text-align: center;
  padding: 0.75rem 0;
  border-top: 1px solid #eee;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 0 0 0.75rem 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  background-color: #f5f5f5;
  padding: 0.25rem;
  border-radius: 1rem;
  flex-grow: 1;
  justify-content: center;
  margin: 0 0.5rem;
}

.tab-button {
  border: none;
  background: none;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  cursor: pointer;
  color: #666;
  transition: all 0.2s ease;
}

.tab-button.active {
  background-color: white;
  color: black;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-icons {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.icon-button:hover {
  background-color: #f5f5f5;
}

.icon-button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.content {
  padding: 0;
  flex-grow: 1;
  overflow-y: auto;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  padding: 0;
  margin-bottom: 0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #666;
  font-weight: 400;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.total-balance {
  margin-bottom: 1.4rem;
}

.total-balance h2 {
  font-size: 1rem;
  color: #999;
  margin-bottom: 0.75rem;
}

.amount {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #555;
}

.spending-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.stat-card h3 {
  font-size: 0.8rem;
  color: #999;
  padding-bottom: 0.75rem;
}

.period {
  font-size: 0.7rem;
  color: #999;
}

.spending-categories {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 0;
}

.spending-categories h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.category-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.category-name {
  font-size: 0.95rem;
  font-weight: 500;
}

.category-amount {
  font-size: 0.95rem;
  font-weight: 600;
  color: #555;
}

.category-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.category-icon.food {
  background-color: #81c784;
}

.category-icon.transport {
  background-color: #64b5f6;
}

.category-icon.shopping {
  background-color: #ba68c8;
}

.category-icon.entertainment {
  background-color: #ffb74d;
}

.category-icon.fitness {
  background-color: #e57373;
}

.category-icon.other {
  background-color: #90a4ae;
}

/* Add smooth scrollbar styling */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* Budget Cards Styles */
.budget-cards {
  margin-top: 2rem;
}

.budget-cards h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.budget-card {
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  transition: transform 0.2s ease;
  width: 100%;
}

.budget-card:hover {
  transform: translateY(-2px);
}

.card-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  width: 24px;
  height: 24px;
  color: #666;
}

.card-details {
  flex-grow: 1;
  min-width: 0;
}

.card-category {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #333;
}

.card-amount {
  font-size: 0.875rem;
  color: #666;
  margin: 0 0 0.75rem 0;
}

.progress-bar-container {
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 100%;
  background: #4CAF50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-bar.over-budget {
  background: #f44336;
}

.card-percentage {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.card-percentage.over-budget {
  color: #f44336;
}

@media (min-width: 640px) {
  .spendings-container {
    max-width: 480px;
  }
}

@media (min-width: 768px) {
  .spendings-container {
    max-width: 500px;
  }
}

@media (max-width: 450px) {
  .spending-stats {
    grid-template-columns: 1fr;
  }
  .card-percentage {
    margin-top: -24px;
  }
}
</style> 