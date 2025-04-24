<template>
  <div class="page-wrapper">
    <PageTransition>
      <div class="savings-container">
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
          <h1 class="page-title">Savings Goals</h1>
          <p class="page-subtitle">Manage and track your savings goals.</p>
        </div>
        
        <div class="content">
          
          <div class="savings-stats">
            <div class="stat-card">
              <h3>Total Saved</h3>
              <p class="amount">AED 4,278.90</p>
              <p class="period">March 2025</p>
            </div>
            <div class="stat-card">
              <h3>Daily Average</h3>
              <p class="amount">AED 138.03</p>
              <p class="period">March 2025 (31 days)</p>
            </div>
          </div>

          <div class="savings-goals">
            <h2>AI-Managed Goals</h2>
            <p class="section-description">Your savings are automatically allocated and managed by our AI assistant.</p>
            <div class="goal-list">
              <div class="goal-item">
                <div class="goal-info">
                  <h3>Thailand Adventure</h3>
                  <div class="progress-bar">
                    <div class="progress" style="width: 75%"/>
                  </div>
                  <p class="goal-progress">AED 7,500.00 / AED 10,000.00</p>
                  <p class="ai-status">AI is adjusting based on your spending patterns</p>
                </div>
                <div class="goal-actions">
                  <button class="icon-button" aria-label="Invite">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" y1="8" x2="19" y2="14"></line>
                      <line x1="22" y1="11" x2="16" y2="11"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="goal-item">
                <div class="goal-info">
                  <h3>Dream Home Fund</h3>
                  <div class="progress-bar">
                    <div class="progress" style="width: 45%"/>
                  </div>
                  <p class="goal-progress">AED 45,000.00 / AED 100,000.00</p>
                  <p class="ai-status">AI is adjusting based on your spending patterns</p>
                </div>
                <div class="goal-actions">
                  <button class="icon-button" aria-label="Invite">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" y1="8" x2="19" y2="14"></line>
                      <line x1="22" y1="11" x2="16" y2="11"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Savings Tips Section -->
          <div class="savings-tips">
            <h2>AI Tips</h2>
            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div class="tip-content">
                  <h3>Save 10% More on Dining</h3>
                  <p>Based on your spending patterns, you could save AED 250 monthly by reducing restaurant visits by 10%.</p>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20V10"></path>
                    <path d="m18 20-6-6-6 6"></path>
                    <path d="M18 4H6"></path>
                  </svg>
                </div>
                <div class="tip-content">
                  <h3>Switch to a Cheaper Gym Plan</h3>
                  <p>Your current gym membership is AED 350/month. A similar plan at Fitness First would save you AED 100 monthly.</p>
                </div>
              </div>
              
              <div class="tip-item">
                <div class="tip-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    <path d="M3 3v18"></path>
                    <path d="M21 3v18"></path>
                  </svg>
                </div>
                <div class="tip-content">
                  <h3>Bundle Your Streaming Services</h3>
                  <p>You're currently paying AED 450 for 5 separate streaming services. Bundling them could save you AED 120 monthly.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- UAE Market Investment Suggestions -->
          <div class="uae-market-suggestions">
            <h2>UAE Market Investment Opportunities</h2>
            <p class="section-description">AI-powered investment suggestions based on real-time UAE market data.</p>
            <div class="investment-list">
              <div class="investment-item">
                <div class="investment-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    <path d="M3 3v18"></path>
                    <path d="M21 3v18"></path>
                  </svg>
                </div>
                <div class="investment-content">
                  <h3>Real Estate Investment Trusts (REITs)</h3>
                  <p>Based on current market conditions, UAE REITs are showing strong potential with an average yield of 7.5% and stable property valuations.</p>
                  <div class="investment-metrics">
                    <span class="metric">
                      <span class="label">Risk Level:</span>
                      <span class="value">Moderate</span>
                    </span>
                    <span class="metric">
                      <span class="label">Min Investment:</span>
                      <span class="value">5,000 AED</span>
                    </span>
                  </div>
                  <button class="invest-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      <path d="M3 3v18"></path>
                      <path d="M21 3v18"></path>
                    </svg>
                    Invest
                  </button>
                </div>
              </div>

              <div class="investment-item">
                <div class="investment-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div class="investment-content">
                  <h3>UAE Tech Sector ETFs</h3>
                  <p>The UAE's technology sector is experiencing rapid growth, with local tech companies showing strong performance and increasing market share.</p>
                  <div class="investment-metrics">
                    <span class="metric">
                      <span class="label">Risk Level:</span>
                      <span class="value">High</span>
                    </span>
                    <span class="metric">
                      <span class="label">Min Investment:</span>
                      <span class="value">3,000 AED</span>
                    </span>
                  </div>
                  <button class="invest-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      <path d="M3 3v18"></path>
                      <path d="M21 3v18"></path>
                    </svg>
                    Invest
                  </button>
                </div>
              </div>

              <div class="investment-item">
                <div class="investment-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    <path d="M3 3v18"></path>
                    <path d="M21 3v18"></path>
                  </svg>
                </div>
                <div class="investment-content">
                  <h3>UAE Government Bonds</h3>
                  <p>UAE government bonds are offering attractive yields with strong credit ratings, making them a stable investment option for conservative investors.</p>
                  <div class="investment-metrics">
                    <span class="metric">
                      <span class="label">Risk Level:</span>
                      <span class="value">Low</span>
                    </span>
                    <span class="metric">
                      <span class="label">Min Investment:</span>
                      <span class="value">10,000 AED</span>
                    </span>
                  </div>
                  <button class="invest-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      <path d="M3 3v18"></path>
                      <path d="M21 3v18"></path>
                    </svg>
                    Invest
                  </button>
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
}

.savings-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 0;
}

.stat-card {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  padding: 1.5rem;
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
  padding: 1.5rem;
  margin-bottom: 0;
}

.savings-goals h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
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

/* Savings Tips Styles */
.savings-tips {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 0;
}

.savings-tips h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.tip-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.tip-icon {
  background-color: #f0f0f0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  color: #81c784;
}

.tip-icon svg {
  width: 20px;
  height: 20px;
}

.tip-content {
  flex: 1;
}

.tip-content h3 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  font-weight: 600;
  color: #555;
}

.tip-content p {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.4;
}

/* UAE Market Investment Suggestions Styles */
.uae-market-suggestions {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 0;
}

.uae-market-suggestions h2 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.investment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.investment-item {
  display: flex;
  align-items: flex-start;
  padding: 1.25rem;
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.investment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.investment-icon {
  background-color: #f0f0f0;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  color: #4CAF50;
}

.investment-icon svg {
  width: 20px;
  height: 20px;
}

.investment-content {
  flex: 1;
}

.investment-content h3 {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.investment-content p {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.investment-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.metric {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.metric .label {
  color: #666;
}

.metric .value {
  font-weight: 500;
  color: #333;
}

.invest-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.invest-button:hover {
  background-color: #43A047;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.invest-button svg {
  width: 16px;
  height: 16px;
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

.section-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.ai-status {
  font-size: 0.75rem;
  color: #81c784;
  font-style: italic;
  margin-top: 0.25rem;
}
</style> 