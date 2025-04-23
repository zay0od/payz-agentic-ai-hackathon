<template>
  <div class="page-wrapper">
    <PageTransition>
      <div class="savings-container">
        <header class="header">
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
            <button class="icon-button" aria-label="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </button>
          </div>
        </header>
        
        <div class="page-header">
          <h1 class="page-title">Savings</h1>
          <p class="page-subtitle">Manage and track your savings goals.</p>
        </div>
        
        <div class="content">
          <h1 class="page-title">Savings Goals</h1>
          
          <div class="savings-stats">
            <div class="stat-card">
              <h3>Total Saved</h3>
              <p class="amount">AED 5,678.90</p>
              <p class="period">This Year</p>
            </div>
            <div class="stat-card">
              <h3>Monthly Average</h3>
              <p class="amount">AED 473.24</p>
              <p class="period">Last 12 Months</p>
            </div>
          </div>

          <div class="savings-goals">
            <h2>Active Goals</h2>
            <div class="goal-list">
              <div class="goal-item">
                <div class="goal-info">
                  <h3>Emergency Fund</h3>
                  <div class="progress-bar">
                    <div class="progress" style="width: 75%"/>
                  </div>
                  <p class="goal-progress">AED 7,500 / AED 10,000</p>
                </div>
                <div class="goal-actions">
                  <button class="action-button">Add</button>
                </div>
              </div>
              
              <div class="goal-item">
                <div class="goal-info">
                  <h3>New Car</h3>
                  <div class="progress-bar">
                    <div class="progress" style="width: 30%"/>
                  </div>
                  <p class="goal-progress">AED 6,000 / AED 20,000</p>
                </div>
                <div class="goal-actions">
                  <button class="action-button">Add</button>
                </div>
              </div>
              
              <div class="goal-item">
                <div class="goal-info">
                  <h3>Vacation Fund</h3>
                  <div class="progress-bar">
                    <div class="progress" style="width: 45%"/>
                  </div>
                  <p class="goal-progress">AED 900 / AED 2,000</p>
                </div>
                <div class="goal-actions">
                  <button class="action-button">Add</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PageTransition from '~/components/PageTransition.vue';

const router = useRouter();
const route = useRoute();
const currentRoute = ref(route.path);

const navigateTo = (path) => {
  router.push(path);
  currentRoute.value = path;
};

definePageMeta({
  title: "Savings",
});
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  min-height: 100vh;
}

.savings-container {
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  box-sizing: border-box;
  border: 2px solid #333;
  border-radius: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
  padding: 1rem;
  flex-grow: 1;
  overflow-y: auto;
  height: calc(100vh - 80px); /* Adjust based on your header height */
}

.page-header {
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #666;
  font-weight: 400;
}

.savings-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.stat-card h3 {
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 0.5rem;
}

.amount {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #555;
}

.period {
  font-size: 0.7rem;
  color: #999;
}

.savings-goals {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.savings-goals h2 {
  font-size: 1rem;
  margin-bottom: 1.25rem;
  font-weight: 600;
  color: #555;
}

.goal-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-item {
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

.goal-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.goal-info {
  flex: 1;
}

.goal-info h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #555;
}

.progress-bar {
  width: 100%;
  height: 0.6rem;
  background-color: #e5e5e5;
  border-radius: 0.3rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress {
  height: 100%;
  background-color: #81c784;
  border-radius: 0.3rem;
  transition: width 0.3s ease;
}

.goal-progress {
  font-size: 0.85rem;
  color: #999;
  font-weight: 500;
}

.goal-actions {
  margin-left: 1.25rem;
}

.action-button {
  background-color: #81c784;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.action-button:hover {
  background-color: #66bb6a;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
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

/* Responsive adjustments */
@media (min-width: 640px) {
  .savings-container {
    max-width: 480px;
  }
}

@media (min-width: 768px) {
  .savings-container {
    max-width: 500px;
  }
}
</style> 