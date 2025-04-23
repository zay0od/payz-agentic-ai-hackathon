<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">API Testing Dashboard</h1>
    
    <!-- Persona Selection Tabs -->
    <div class="mb-6">
      <div class="flex border-b border-gray-200">
        <button 
          v-for="persona in personas" 
          :key="persona.id"
          @click="activePersona = persona.id"
          class="py-2 px-4 font-medium text-sm focus:outline-none"
          :class="activePersona === persona.id 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'"
        >
          {{ persona.name }}
        </button>
      </div>
    </div>
    
    <!-- Main Content Area -->
    <div class="flex flex-col gap-8">
      <!-- User Details Section -->
      <div class="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">{{ activePersonaObj.name }}'s Profile Details</h2>
        <div class="flex gap-2 mb-4">
          <button @click="loadUserDetails" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Load Profile
          </button>
        </div>
        <div v-if="userDetailsLoading" class="flex items-center text-gray-500">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
        <div v-else-if="userDetails" class="mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div class="border p-5 rounded-lg shadow-sm bg-white">
              <h3 class="font-semibold text-gray-700 mb-3 border-b pb-2">Personal Information</h3>
              <div class="space-y-2">
                <div class="flex">
                  <div class="w-32 text-gray-600">Name:</div>
                  <div class="font-medium">{{ userDetails.name }}</div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Email:</div>
                  <div class="font-medium">{{ userDetails.email }}</div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Phone:</div>
                  <div class="font-medium">{{ userDetails.phone }}</div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Age:</div>
                  <div class="font-medium">{{ userDetails.age }} years</div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Address:</div>
                  <div class="font-medium">{{ userDetails.address }}</div>
                </div>
              </div>
            </div>

            <!-- Account Information -->
            <div class="border p-5 rounded-lg shadow-sm bg-white">
              <h3 class="font-semibold text-gray-700 mb-3 border-b pb-2">Account Information</h3>
              <div class="space-y-2">
                <div class="flex">
                  <div class="w-32 text-gray-600">ID:</div>
                  <div class="font-medium">{{ userDetails.id }}</div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Occupation:</div>
                  <div class="font-medium">{{ userDetails.occupation }}</div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Monthly Salary:</div>
                  <div class="font-medium text-green-600">{{ userDetails.monthlySalary.toLocaleString() }} AED</div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Join Date:</div>
                  <div class="font-medium">{{ new Date(userDetails.joinDate).toLocaleDateString() }}</div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Account Type:</div>
                  <div class="font-medium">
                    <span class="px-2 py-1 text-xs rounded-full" 
                          :class="getAccountTypeClass(userDetails.accountType)">
                      {{ userDetails.accountType }}
                    </span>
                  </div>
                </div>
                <div class="flex">
                  <div class="w-32 text-gray-600">Language:</div>
                  <div class="font-medium">{{ userDetails.preferredLanguage }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Financial Data Section -->
      <div class="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">{{ activePersonaObj.name }}'s Financial Data</h2>
        <div class="flex gap-2 mb-4">
          <button @click="loadPersonaData" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Load Data
          </button>
          <input v-model="dataMonths" type="number" min="1" max="36" class="border rounded px-2" placeholder="Months" />
        </div>
        <div v-if="dataLoading" class="flex items-center text-gray-500">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
        <div v-else-if="personaData" class="mt-4">
          <!-- Accounts Summary -->
          <h3 class="font-medium text-gray-700 mb-2">Accounts</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div v-for="account in personaData.accounts" :key="account.account_id" 
                 class="p-4 rounded-lg border shadow-sm" 
                 :class="{
                   'bg-green-50 border-green-200': account.type === 'Save Pot', 
                   'bg-purple-50 border-purple-200': account.type === 'Play Pot', 
                   'bg-blue-50 border-blue-200': account.type === 'Checking'
                 }">
              <div class="font-semibold text-gray-700">{{ account.type }}</div>
              <div class="text-lg font-bold mt-1">{{ account.balance.toFixed(2) }} {{ account.currency }}</div>
            </div>
          </div>
          
          <!-- Transactions -->
          <h3 class="font-medium text-gray-700 mb-2">Recent Transactions</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full bg-white rounded-lg overflow-hidden">
              <thead class="bg-gray-100">
                <tr>
                  <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(tx, index) in personaData.transactions.slice(0, 5)" :key="index" class="hover:bg-gray-50">
                  <td class="py-2 px-4 text-sm whitespace-nowrap">{{ new Date(tx.date).toLocaleDateString() }}</td>
                  <td class="py-2 px-4 text-sm whitespace-nowrap">{{ tx.description }}</td>
                  <td class="py-2 px-4 text-sm whitespace-nowrap" :class="tx.amount < 0 ? 'text-red-600' : 'text-green-600'">
                    {{ tx.amount.toFixed(2) }} {{ tx.currency }}
                  </td>
                  <td class="py-2 px-4 text-sm whitespace-nowrap">
                    <span class="px-2 py-1 text-xs rounded-full" :class="getCategoryClass(tx.category)">
                      {{ tx.category }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="text-sm text-gray-600 mt-2">Showing 5 of {{ personaData.transactions.length }} transactions</div>
        </div>
      </div>
      
      <!-- AI Analysis Section -->
      <div class="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">AI Financial Analysis</h2>
        <div class="flex gap-2 mb-4">
          <button @click="loadAnalysisData" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Get Analysis
          </button>
          <input v-model="analysisMonths" type="number" min="1" max="36" class="border rounded px-2" placeholder="Months" />
        </div>
        <div v-if="analysisLoading" class="flex items-center text-gray-500">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
        <div v-else-if="analysisData" class="mt-4">
          <h3 class="font-medium text-gray-700 mb-3">Monthly Overview</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Income</div>
              <div class="text-lg font-bold text-blue-700">{{ analysisData.monthly_overview.total_income.toFixed(2) }} AED</div>
            </div>
            <div class="p-4 bg-red-50 border border-red-100 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Expenses</div>
              <div class="text-lg font-bold text-red-700">{{ analysisData.monthly_overview.total_expenses.toFixed(2) }} AED</div>
            </div>
            <div class="p-4 bg-green-50 border border-green-100 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Savings Rate</div>
              <div class="text-lg font-bold text-green-700">{{ (analysisData.monthly_overview.savings_rate * 100).toFixed(1) }}%</div>
            </div>
            <div class="p-4 bg-purple-50 border border-purple-100 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Discretionary</div>
              <div class="text-lg font-bold text-purple-700">{{ analysisData.monthly_overview.discretionary_spending.toFixed(2) }} AED</div>
            </div>
          </div>
          
          <h3 class="font-medium text-gray-700 mb-3">Recommendations</h3>
          <div v-if="analysisData.recommendations.length === 0" class="text-gray-500 italic">No recommendations available</div>
          <div v-else class="space-y-3">
            <div v-for="(rec, index) in analysisData.recommendations" :key="index" 
                 class="p-4 rounded-lg border shadow-sm"
                 :class="getRecommendationClass(rec.type)">
              <div class="font-semibold">{{ rec.description }}</div>
              <div v-if="rec.amount" class="text-lg font-bold mt-1">{{ rec.amount.toFixed(2) }} AED</div>
              <div class="text-sm text-gray-600 mt-1">{{ rec.reason }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Groq API Recommendations -->
      <div class="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Groq API Recommendations</h2>
        <div class="flex gap-2 mb-4">
          <button @click="loadGroqRecommendations" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Get Groq Recommendations
          </button>
          <input v-model="groqMonths" type="number" min="1" max="36" class="border rounded px-2" placeholder="Months" />
        </div>
        <div v-if="groqLoading" class="flex items-center text-gray-500">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
        <div v-else-if="groqError" class="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
          <div class="font-medium">Error:</div>
          <div>{{ groqError }}</div>
        </div>
        <div v-else-if="groqRecommendations && groqRecommendations.length > 0" class="mt-4 space-y-3">
          <div v-for="(rec, index) in groqRecommendations" :key="index" 
               class="p-4 rounded-lg border shadow-sm"
               :class="getRecommendationClass(rec.type)">
            <div class="font-semibold">{{ rec.description }}</div>
            <div v-if="rec.amount" class="text-lg font-bold mt-1">{{ rec.amount.toFixed(2) }} AED</div>
            <div class="text-sm text-gray-600 mt-1">{{ rec.reason }}</div>
          </div>
        </div>
        <div v-else-if="groqRecommendations && groqRecommendations.length === 0" class="text-gray-500 italic">
          No recommendations from Groq API
        </div>
      </div>
      
      <!-- Auto-actions Test -->
      <div class="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Auto-Actions Test</h2>
        <div class="flex gap-2 mb-4">
          <button @click="runAutoActions" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
            Run Auto Actions
          </button>
          <select v-model="autoExecuteMode" class="border rounded px-2 py-2">
            <option value="full_auto">Full Auto</option>
            <option value="semi_auto">Semi Auto</option>
            <option value="dry_run">Dry Run</option>
          </select>
        </div>
        <div v-if="autoActionsLoading" class="flex items-center text-gray-500">
          <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
        <div v-else-if="autoActionsData" class="mt-4">
          <h3 class="font-medium text-gray-700 mb-3">Action Logs</h3>
          <div class="bg-black text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-60">
            <div v-for="(log, index) in autoActionsData.logs" :key="index" class="mb-1">
              > {{ log }}
            </div>
          </div>
          
          <h3 class="font-medium text-gray-700 mt-6 mb-3">Implemented Recommendations</h3>
          <div v-if="autoActionsData.implementedRecommendations.length === 0" class="text-gray-500 italic">No recommendations implemented</div>
          <div v-else class="space-y-3">
            <div v-for="(rec, index) in autoActionsData.implementedRecommendations" :key="index" 
                 class="p-4 rounded-lg border border-green-200 bg-green-50 shadow-sm">
              <div class="font-semibold">{{ rec.description }}</div>
              <div v-if="rec.amount" class="text-lg font-bold mt-1">{{ rec.amount.toFixed(2) }} AED</div>
              <div class="text-sm text-gray-600 mt-1">{{ rec.reason }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const activePersona = ref('fatima');
const dataMonths = ref(12);
const analysisMonths = ref(12);
const groqMonths = ref(12);
const autoExecuteMode = ref('full_auto');

const personaData = ref(null);
const dataLoading = ref(false);

const analysisData = ref(null);
const analysisLoading = ref(false);

const groqRecommendations = ref(null);
const groqLoading = ref(false);
const groqError = ref(null);

const autoActionsData = ref(null);
const autoActionsLoading = ref(false);

// User details data
const userDetails = ref(null);
const userDetailsLoading = ref(false);

const personas = [
  { id: 'fatima', name: 'Fatima' },
  { id: 'omar', name: 'Omar' },
  { id: 'reem', name: 'Reem' }
];

const activePersonaObj = computed(() => {
  return personas.find(p => p.id === activePersona.value);
});

// Reset data when changing personas
watch(activePersona, () => {
  personaData.value = null;
  analysisData.value = null;
  groqRecommendations.value = null;
  groqError.value = null;
  autoActionsData.value = null;
  userDetails.value = null;
});

// Function to load user details
async function loadUserDetails() {
  userDetailsLoading.value = true;
  try {
    const response = await fetch(`/api/${activePersona.value}-details`);
    userDetails.value = await response.json();
  } catch (error) {
    console.error(`Error loading ${activePersonaObj.value.name}'s details:`, error);
  } finally {
    userDetailsLoading.value = false;
  }
}

// Function to load persona data
async function loadPersonaData() {
  dataLoading.value = true;
  try {
    const response = await fetch(`/api/${activePersona.value}-data?months=${dataMonths.value}`);
    personaData.value = await response.json();
  } catch (error) {
    console.error(`Error loading ${activePersonaObj.value.name} data:`, error);
  } finally {
    dataLoading.value = false;
  }
}

// Function to load analysis data
async function loadAnalysisData() {
  analysisLoading.value = true;
  try {
    const response = await fetch(`/api/${activePersona.value}-analysis?months=${analysisMonths.value}`);
    analysisData.value = await response.json();
  } catch (error) {
    console.error(`Error loading ${activePersonaObj.value.name} analysis data:`, error);
  } finally {
    analysisLoading.value = false;
  }
}

// Function to load Groq recommendations
async function loadGroqRecommendations() {
  groqLoading.value = true;
  groqError.value = null;
  
  try {
    const response = await fetch(`/api/groq-recommendations?persona=${activePersona.value}&months=${groqMonths.value}`);
    const data = await response.json();
    
    if (data.success) {
      groqRecommendations.value = data.recommendations || [];
    } else {
      groqError.value = data.message || 'Failed to get recommendations from Groq';
      groqRecommendations.value = [];
    }
  } catch (error) {
    console.error('Error loading Groq recommendations:', error);
    groqError.value = error.message || 'An error occurred';
    groqRecommendations.value = [];
  } finally {
    groqLoading.value = false;
  }
}

// Function to run auto actions
async function runAutoActions() {
  autoActionsLoading.value = true;
  
  try {
    const response = await fetch(`/api/${activePersona.value}-auto-actions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        autoExecuteMode: autoExecuteMode.value
      })
    });
    
    const data = await response.json();
    autoActionsData.value = data.data;
  } catch (error) {
    console.error(`Error running ${activePersonaObj.value.name} auto actions:`, error);
  } finally {
    autoActionsLoading.value = false;
  }
}

// Helper function to get appropriate CSS class for transaction category
function getCategoryClass(category) {
  const categoryMap = {
    'Food & Dining': 'bg-yellow-100 text-yellow-800',
    'Entertainment': 'bg-purple-100 text-purple-800',
    'Shopping': 'bg-blue-100 text-blue-800',
    'Health & Fitness': 'bg-green-100 text-green-800',
    'Bills & Utilities': 'bg-red-100 text-red-800',
    'Salary': 'bg-green-100 text-green-800',
    'Transfer': 'bg-gray-100 text-gray-800',
    'Groceries': 'bg-yellow-100 text-yellow-800',
    'Transportation': 'bg-blue-100 text-blue-800',
    'Travel': 'bg-purple-100 text-purple-800',
    'Education': 'bg-blue-100 text-blue-800',
    'Income': 'bg-green-100 text-green-800',
  };
  
  return categoryMap[category] || 'bg-gray-100 text-gray-800';
}

// Helper function to get appropriate CSS class for recommendation type
function getRecommendationClass(type) {
  const typeMap = {
    'savings_allocation': 'bg-blue-50 border-blue-200',
    'spending_alert': 'bg-yellow-50 border-yellow-200',
    'goal_adjustment': 'bg-green-50 border-green-200',
    'debt_management': 'bg-red-50 border-red-200',
    'investment': 'bg-purple-50 border-purple-200'
  };
  
  return typeMap[type] || 'bg-gray-50 border-gray-200';
}

// Helper function to get appropriate CSS class for account type
function getAccountTypeClass(accountType) {
  const typeMap = {
    'Platinum': 'bg-gray-800 text-white',
    'Gold': 'bg-yellow-500 text-white',
    'Diamond': 'bg-blue-500 text-white',
    'Standard': 'bg-gray-200 text-gray-800'
  };
  
  return typeMap[accountType] || 'bg-gray-100 text-gray-800';
}
</script>