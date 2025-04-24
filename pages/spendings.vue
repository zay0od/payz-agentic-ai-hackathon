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
              <p class="amount">AED 2,421.10</p>
            </div>
            <div class="stat-card">
              <h3>Daily Average</h3>
              <p class="amount">AED 78.10</p>
              <p class="period">March 2025 (31 days)</p>
            </div>
          </div>

          <!-- Budget Cards Section -->
          <div class="budget-cards">
            <h2>Budget Progress</h2>
            <div class="card-grid">
              <div v-for="budget in budgets" :key="budget.category" class="budget-card">
                <div class="card-icon-wrapper">
                  <!-- Placeholder for icon -->
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="card-icon">
                     <path v-if="budget.category === 'Shopping'" d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                     <line v-if="budget.category === 'Shopping'" x1="3" x2="21" y1="6" y2="6"/>
                     <path v-if="budget.category === 'Shopping'" d="M16 10a4 4 0 0 1-8 0"/>
                     
                     <path v-if="budget.category === 'Food'" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/> 
                     <circle v-if="budget.category === 'Food'" cx="12" cy="10" r="3"/> 

                     <!-- Default icon -->
                     <circle v-if="!['Shopping', 'Food'].includes(budget.category)" cx="12" cy="12" r="10"/>
                  </svg>
                </div>
                <div class="card-details">
                  <h3 class="card-category">{{ budget.category }}</h3>
                  <p class="card-amount">AED {{ budget.spent.toFixed(2) }} / AED {{ budget.limit.toFixed(2) }}</p>
                  <div class="progress-bar-container">
                    <div class="progress-bar" :style="{ width: budget.percentage + '%' }"></div>
                  </div>
                  <span class="card-percentage">{{ budget.percentage }}%</span>
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

// Sample budget data
const budgetsData = ref([
  { category: 'Shopping', spent: 420, limit: 500, icon: 'shopping-bag' },
  { category: 'Food', spent: 200, limit: 200, icon: 'utensils' },
  { category: 'Transport', spent: 150, limit: 250, icon: 'car' },
  { category: 'Entertainment', spent: 120, limit: 150, icon: 'film' },
  { category: 'Bills & Utilities', spent: 100, limit: 135, icon: 'file-text' },
]);

// Computed property to add percentage calculation
const budgets = computed(() => {
  return budgetsData.value.map(budget => ({
    ...budget,
    percentage: Math.min(Math.round((budget.spent / budget.limit) * 100), 100) // Calculate percentage
  }));
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
  border: 2px solid #333;
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
  margin-bottom: 1.5rem;
}

.budget-cards h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.budget-card {
  background-color: #fff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid #eee;
}

.card-icon-wrapper {
  background-color: #f0f0f0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.card-icon {
  width: 20px;
  height: 20px;
  color: #333;
}

.card-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-category {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.card-amount {
  font-size: 0.8rem;
  color: #777;
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #333;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.card-percentage {
  font-size: 0.8rem;
  font-weight: 500;
  color: #555;
  align-self: flex-end;
  margin-top: -26px;
  margin-right: 5px;
  display: none;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .spendings-container {
    max-width: 480px;
  }
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .spendings-container {
    max-width: 500px;
  }
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 450px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  .spending-stats {
    grid-template-columns: 1fr;
  }
  .card-percentage {
    margin-top: -24px;
  }
}
</style> 