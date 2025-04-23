<template>
  <div class="page-wrapper">
    <PageTransition>
      <div class="dashboard-container">
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
          <h1 class="page-title">Overview</h1>
          <p class="page-subtitle">Save <span class="highlight" :class="currentHighlightClass"><span class="typing-container"><span class="typing-text">{{ currentWord }}</span><span class="cursor">|</span></span></span>, live <span class="highlight highlight-blue">better</span>—with Agentic AI by your side.</p>
        </div>
        
        <div class="chart-container">
          <div class="stats-grid">
            <div class="stat-card income">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>Income</h3>
                <p class="amount">$1,823.45</p>
              </div>
            </div>
            <div class="stat-card expense">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>Expense</h3>
                <p class="amount">$658.25</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="action-button play-pot">
            <span class="button-text">PLAY POT</span>
            <span class="button-label">A</span>
          </button>
          <button class="action-button save-pot">
            <span class="button-text">SAVE POT</span>
            <span class="button-label">B</span>
          </button>
        </div>
        
        <div class="insight-container">
          <h2 class="section-title">INSIGHT</h2>
          <div class="insight-line"/>
        </div>
        
        <div class="transactions-container">
          <h2 class="section-title">Transactions</h2>
          <div class="transactions-list">
            <div v-for="(transaction, index) in transactions" :key="index" class="transaction-item">
              <div class="transaction-avatar" :class="transaction.category">
                <svg v-if="getTransactionIcon(transaction.category)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <template v-if="transaction.category === 'food'">
                    <path d="M17 9V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v3"/>
                    <path d="M12 13v9"/>
                    <path d="M8 22h8"/>
                    <path d="M18 9H6a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2Z"/>
                  </template>
                  <template v-else-if="transaction.category === 'transport'">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </template>
                  <template v-else-if="transaction.category === 'shopping'">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </template>
                  <template v-else-if="transaction.category === 'entertainment'">
                    <path d="M12 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3Z"/>
                    <path d="M19 6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V9a3 3 0 0 0-3-3Z"/>
                    <path d="M5 6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3 3 3 0 0 0 3-3V9a3 3 0 0 0-3-3Z"/>
                  </template>
                  <template v-else-if="transaction.category === 'fitness'">
                    <path d="M18.6 9.2c2.7 2.7 2.7 7.1 0 9.8s-7.1 2.7-9.8 0-2.7-7.1 0-9.8 7.1-2.7 9.8 0"/>
                    <circle cx="13.7" cy="14.1" r="2.5"/>
                  </template>
                  <template v-else>
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                    <line x1="12" y1="6" x2="12" y2="18"/>
                  </template>
                </svg>
                <span v-else>{{ transaction.initials }}</span>
              </div>
              <div class="transaction-details">
                <div class="transaction-name">{{ transaction.name }}</div>
                <div class="transaction-type">{{ transaction.type }}</div>
              </div>
              <div class="transaction-amount" :class="{ 'positive': transaction.amount > 0, 'negative': transaction.amount < 0 }">
                {{ transaction.amount > 0 ? '+' : '' }}AED {{ Math.abs(transaction.amount).toFixed(2) }}
                <div class="transaction-date">{{ transaction.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PageTransition from '~/components/PageTransition.vue';

const router = useRouter();
const route = useRoute();
const currentRoute = ref(route.path);
const currentWord = ref('smarter');
const words = ['smarter', 'wisely', 'intelligently'];
const highlightClasses = ['highlight-green', 'highlight-blue', 'highlight-purple'];
let wordInterval;
let typingTimeout;

const currentHighlightClass = ref(highlightClasses[0]);

const toggleWord = () => {
  // Fade out
  const typingText = document.querySelector('.typing-text');
  if (typingText) {
    typingText.style.opacity = '0';
    
    // After fade out, change the word and fade in
    setTimeout(() => {
      const currentIndex = words.indexOf(currentWord.value);
      const nextIndex = (currentIndex + 1) % words.length;
      currentWord.value = words[nextIndex];
      currentHighlightClass.value = highlightClasses[nextIndex];
      typingText.style.opacity = '1';
    }, 500);
  }
};

onMounted(() => {
  currentRoute.value = route.path;
  wordInterval = setInterval(toggleWord, 5000);
});

onUnmounted(() => {
  if (wordInterval) {
    clearInterval(wordInterval);
  }
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
});

const navigateTo = (path) => {
  router.push(path);
  currentRoute.value = path;
};

const getTransactionIcon = (category) => {
  return ['food', 'transport', 'shopping', 'entertainment', 'fitness'].includes(category);
};

definePageMeta({
  title: "Overview",
});

const transactions = ref([
  {
    initials: "AD",
    name: "Adam Driver",
    type: "Transfer",
    amount: 150,
    date: "Dec 23, 2023",
    category: "transfer"
  },
  {
    initials: "NF",
    name: "Next Fitness",
    type: "Gym Membership",
    amount: -284.69,
    date: "Dec 22, 2023",
    category: "fitness"
  },
  {
    initials: "BC",
    name: "Brian Cooper",
    type: "Transfer",
    amount: 120,
    date: "Dec 22, 2023",
    category: "transfer"
  },
  {
    initials: "S",
    name: "Whole Foods",
    type: "Groceries",
    amount: -28.69,
    date: "Dec 19, 2023",
    category: "food"
  },
  {
    initials: "UB",
    name: "Uber",
    type: "Transportation",
    amount: -22.50,
    date: "Dec 15, 2023",
    category: "transport"
  },
  {
    initials: "NF",
    name: "Netflix",
    type: "Entertainment",
    amount: -15.99,
    date: "Dec 15, 2023",
    category: "entertainment"
  },
  {
    initials: "AM",
    name: "Amazon",
    type: "Shopping",
    amount: -67.35,
    date: "Dec 14, 2023",
    category: "shopping"
  },
  {
    initials: "SB",
    name: "Starbucks",
    type: "Food & Drink",
    amount: -6.75,
    date: "Dec 14, 2023",
    category: "food"
  },
  {
    initials: "TG",
    name: "Target",
    type: "Shopping",
    amount: -124.32,
    date: "Dec 13, 2023",
    category: "shopping"
  },
  {
    initials: "LY",
    name: "Lyft",
    type: "Transportation",
    amount: -18.45,
    date: "Dec 13, 2023",
    category: "transport"
  },
  {
    initials: "CB",
    name: "Chipotle",
    type: "Food & Drink",
    amount: -12.99,
    date: "Dec 12, 2023",
    category: "food"
  },
  {
    initials: "SP",
    name: "Spotify",
    type: "Entertainment",
    amount: -9.99,
    date: "Dec 12, 2023",
    category: "entertainment"
  },
  {
    initials: "WM",
    name: "Walmart",
    type: "Shopping",
    amount: -89.75,
    date: "Dec 11, 2023",
    category: "shopping"
  },
  {
    initials: "PF",
    name: "Planet Fitness",
    type: "Gym",
    amount: -10.00,
    date: "Dec 10, 2023",
    category: "fitness"
  }
]);
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  min-height: 100vh;
}

.dashboard-container {
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

.chart-container {
  border: none;
  border-radius: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: stretch;
  height: auto;
  margin-bottom: 0.5rem;
  width: 100%;
}

.stats-grid {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.stat-card {
  flex: 1;
  background-color: white;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #e0e0e0;
  width: 100%;
}

.stat-icon {
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.2rem;
}

.income .stat-icon {
  color: #4caf4fb5;
}

.expense .stat-icon {
  color: #f44336b5;
}

.stat-content {
  text-align: center;
}

.stat-content h3 {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.amount {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.action-button {
  flex: 1;
  background-color: #f5f5f5;
  border: 1px solid #333;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
}

.button-text {
  margin-bottom: 0.25rem;
}

.button-label {
  font-size: 1.5rem;
  font-weight: bold;
}

.insight-container {
  background-color: #f5f5f5;
  border: 1px solid #333;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.insight-line {
  height: 2px;
  background-color: #333;
  width: 100%;
}

.transactions-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
  overflow: hidden;
  height: calc(100vh - 250px); /* Adjust based on your header height */
}

.transactions-list {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

.transaction-item:hover {
  background-color: #fafafa;
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
}

.transaction-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.transaction-avatar.food {
  background-color: #81c784;
}

.transaction-avatar.transport {
  background-color: #64b5f6;
}

.transaction-avatar.shopping {
  background-color: #ba68c8;
}

.transaction-avatar.entertainment {
  background-color: #ffb74d;
}

.transaction-avatar.fitness {
  background-color: #e57373;
}

.transaction-avatar.transfer {
  background-color: #90a4ae;
}

.transaction-details {
  flex-grow: 1;
  min-width: 0;
}

.transaction-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
}

.transaction-type {
  font-size: 0.8rem;
  color: #999;
}

.transaction-amount {
  text-align: right;
  font-weight: 600;
  white-space: nowrap;
  font-size: 0.95rem;
}

.transaction-amount.positive {
  color: #66bb6a;
}

.transaction-amount.negative {
  color: #ef5350;
}

.transaction-date {
  font-size: 0.75rem;
  color: #999;
  text-align: right;
  font-weight: normal;
  margin-top: 0.25rem;
}

/* Add smooth scrollbar styling */
.transactions-list::-webkit-scrollbar {
  width: 6px;
}

.transactions-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.transactions-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.transactions-list::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* Responsive adjustments */
@media (min-width: 640px) {
  .dashboard-container {
    max-width: 480px;
  }
}

@media (min-width: 768px) {
  .dashboard-container {
    max-width: 500px;
  }

}

.page-header {
  padding: 0 1rem;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.75rem;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #666;
  font-weight: 400;
}

.highlight {
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.highlight-green {
  background-color: rgba(255, 152, 0, 0.2);
  color: #e65100;
}

.highlight-blue {
  background-color: rgba(233, 30, 99, 0.2);
  color: #c2185b;
}

.highlight-purple {
  background-color: rgba(0, 188, 212, 0.2);
  color: #00838f;
}

.typing-container {
  display: inline-block;
  position: relative;
}

.typing-text {
  display: inline-block;
  transition: opacity 0.5s ease;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: #2e7d32;
  margin-left: 2px;
  animation: blink 1s infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style> 