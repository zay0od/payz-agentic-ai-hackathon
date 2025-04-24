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

      <!-- Agentic Tooling Test Section -->
      <div class="border rounded-lg p-6 bg-gray-50 shadow-sm">
        <h2 class="text-xl font-semibold mb-4">Groq Agentic Tooling Test</h2>
        
        <!-- Updated Real-Time Financial Data section -->
        <div class="mb-6">
          <h3 class="font-medium text-gray-700 mb-3">Real-Time Financial Data</h3>
          <div class="flex gap-2 mb-4">
            <button @click="fetchRealTimeData" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Fetch Real-Time Data
            </button>
            <select v-model="selectedCountry" class="border rounded px-2 py-2">
              <option value="UAE">UAE</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Singapore">Singapore</option>
            </select>
            <input v-model="goalInput" class="border rounded px-2" placeholder="Goals (comma-separated)" />
          </div>
          <div v-if="realTimeDataLoading" class="flex items-center text-gray-500">
            <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading real-time financial data...
          </div>
          <div v-else-if="realTimeData">
            <!-- Interest Rates Section -->
            <div class="mt-4">
              <h4 class="font-semibold mb-2">Current Interest Rates</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-3 bg-blue-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Mortgage Rates</div>
                  <div class="text-lg font-bold">{{ realTimeData.interest_rates.mortgage.average_rate }}%</div>
                  <div class="text-xs text-gray-500 mt-1">
                    Range: {{ realTimeData.interest_rates.mortgage.lowest_rate }}% - {{ realTimeData.interest_rates.mortgage.highest_rate }}%
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.interest_rates.mortgage.source.join(', ') }}
                  </div>
                </div>
                <div class="p-3 bg-green-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Savings Accounts</div>
                  <div class="text-lg font-bold">{{ realTimeData.interest_rates.savings_accounts.average_rate }}%</div>
                  <div class="text-xs text-gray-500 mt-1">
                    Highest Rate: {{ realTimeData.interest_rates.savings_accounts.highest_rate }}%
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.interest_rates.savings_accounts.source.join(', ') }}
                  </div>
                </div>
                <div class="p-3 bg-red-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Personal Loans</div>
                  <div class="text-lg font-bold">{{ realTimeData.interest_rates.personal_loans.average_rate }}%</div>
                  <div class="text-xs text-gray-500 mt-1">
                    Range: {{ realTimeData.interest_rates.personal_loans.lowest_rate }}% - {{ realTimeData.interest_rates.personal_loans.highest_rate }}%
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.interest_rates.personal_loans.source.join(', ') }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Housing Market Trends -->
            <div class="mt-4">
              <h4 class="font-semibold mb-2">Housing Market Trends</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-3 bg-yellow-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Dubai</div>
                  <div class="text-lg font-bold">{{ realTimeData.market_trends.housing_market.dubai.average_price.toLocaleString() }} AED</div>
                  <div class="text-sm text-gray-600">
                    Growth Rate: <span class="font-semibold" :class="{'text-green-600': realTimeData.market_trends.housing_market.dubai.growth_rate > 0}">
                      {{ realTimeData.market_trends.housing_market.dubai.growth_rate }}%
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.market_trends.housing_market.dubai.source.join(', ') }}
                  </div>
                </div>
                <div class="p-3 bg-yellow-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Abu Dhabi</div>
                  <div class="text-lg font-bold">{{ realTimeData.market_trends.housing_market.abu_dhabi.average_price.toLocaleString() }} AED</div>
                  <div class="text-sm text-gray-600">
                    Growth Rate: <span class="font-semibold" :class="{'text-green-600': realTimeData.market_trends.housing_market.abu_dhabi.growth_rate > 0}">
                      {{ realTimeData.market_trends.housing_market.abu_dhabi.growth_rate }}%
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.market_trends.housing_market.abu_dhabi.source.join(', ') }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Stock Market Trends -->
            <div class="mt-4">
              <h4 class="font-semibold mb-2">Stock Market Trends</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-3 bg-purple-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Abu Dhabi Securities Exchange (ADX)</div>
                  <div class="text-lg font-bold">{{ realTimeData.market_trends.stock_market.adx.current_value.toLocaleString() }}</div>
                  <div class="text-sm text-gray-600">
                    Growth Rate: <span class="font-semibold" :class="{'text-green-600': realTimeData.market_trends.stock_market.adx.growth_rate > 0}">
                      {{ realTimeData.market_trends.stock_market.adx.growth_rate }}%
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.market_trends.stock_market.adx.source.join(', ') }}
                  </div>
                </div>
                <div class="p-3 bg-purple-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Dubai Financial Market (DFM)</div>
                  <div class="text-lg font-bold">{{ realTimeData.market_trends.stock_market.dfm.current_value.toLocaleString() }}</div>
                  <div class="text-sm text-gray-600">
                    Growth Rate: <span class="font-semibold" :class="{'text-green-600': realTimeData.market_trends.stock_market.dfm.growth_rate > 0}">
                      {{ realTimeData.market_trends.stock_market.dfm.growth_rate }}%
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.market_trends.stock_market.dfm.source.join(', ') }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Economic Indicators -->
            <div class="mt-4">
              <h4 class="font-semibold mb-2">Economic Indicators</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-3 bg-indigo-50 border rounded-lg">
                  <div class="text-sm text-gray-600">GDP Growth</div>
                  <div class="text-lg font-bold">{{ realTimeData.economic_indicators.gdp_growth.current_growth }}%</div>
                  <div class="text-sm text-gray-600">
                    Forecast: <span class="font-semibold">
                      {{ realTimeData.economic_indicators.gdp_growth.forecast }}%
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.economic_indicators.gdp_growth.source.join(', ') }}
                  </div>
                </div>
                <div class="p-3 bg-pink-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Unemployment</div>
                  <div class="text-lg font-bold">{{ realTimeData.economic_indicators.unemployment.current_rate }}%</div>
                  <div class="text-sm text-gray-600">
                    Forecast: <span class="font-semibold">
                      {{ realTimeData.economic_indicators.unemployment.forecast }}%
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.economic_indicators.unemployment.source.join(', ') }}
                  </div>
                </div>
                <div class="p-3 bg-teal-50 border rounded-lg">
                  <div class="text-sm text-gray-600">Consumer Spending</div>
                  <div class="text-lg font-bold">+{{ realTimeData.economic_indicators.consumer_spending.current_growth }}%</div>
                  <div class="text-sm text-gray-600">
                    Forecast: <span class="font-semibold">
                      {{ realTimeData.economic_indicators.consumer_spending.forecast }}%
                    </span>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    Sources: {{ realTimeData.economic_indicators.consumer_spending.source.join(', ') }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Inflation Rate -->
            <div class="mt-4">
              <h4 class="font-semibold mb-2">Inflation</h4>
              <div class="p-3 bg-orange-50 border rounded-lg">
                <div class="text-sm text-gray-600">Inflation Rate</div>
                <div class="text-lg font-bold">{{ realTimeData.market_trends.inflation_rate.current_rate }}%</div>
                <div class="text-sm text-gray-600">
                  Forecast: <span class="font-semibold">
                    {{ realTimeData.market_trends.inflation_rate.forecast }}%
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Sources: {{ realTimeData.market_trends.inflation_rate.source.join(', ') }}
                </div>
              </div>
            </div>
            
            <!-- Financial News -->
            <div class="mt-4">
              <h4 class="font-semibold mb-2">Recent Financial News</h4>
              <div class="space-y-3">
                <div v-for="(news, index) in realTimeData.recent_financial_news" :key="index"
                     class="p-3 bg-white border rounded-lg">
                  <div class="font-medium">{{ news.title }}</div>
                  <div class="text-sm text-gray-600 mt-1">{{ news.description }}</div>
                  <div class="text-xs text-gray-500 mt-1">
                    Source: {{ news.source }}
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Updated timestamp -->
            <div class="mt-4 p-3 bg-gray-100 rounded-lg">
              <div class="text-sm">
                <div><span class="font-medium">Last Updated:</span> {{ new Date(realTimeData.updated).toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Agentic Recommendations Test -->
        <div>
          <h3 class="font-medium text-gray-700 mb-3">Agentic Financial Recommendations</h3>
          <div class="flex gap-2 mb-4">
            <button @click="getAgenticRecommendations" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Get Recommendations with Real-Time Data
            </button>
            <div class="flex items-center gap-2">
              <input type="checkbox" id="useRealtime" v-model="useRealtimeData" class="rounded">
              <label for="useRealtime">Use real-time data</label>
            </div>
          </div>
          <div v-if="agenticRecommendationsLoading" class="flex items-center text-gray-500">
            <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading recommendations with agentic capabilities...
          </div>
          <div v-else-if="agenticRecommendations" class="mt-4">
            <!-- If real-time data was used, show a badge -->
            <div v-if="realtimeDataUsed" class="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm mb-2">
              Recommendations include real-time market data
            </div>
            <div v-else class="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm mb-2">
              Using simulated data only
            </div>
            
            <!-- Analysis summary section -->
            <div v-if="agenticResponse && agenticResponse.analysis" class="mb-6 bg-white border rounded-lg p-4">
              <h4 class="font-semibold text-lg mb-2">Financial Analysis</h4>
              <div class="text-sm text-gray-700 mb-4">{{ agenticResponse.analysis.summary }}</div>
              
              <!-- Expandable full analysis -->
              <details class="bg-gray-50 p-3 rounded-lg">
                <summary class="font-medium cursor-pointer">View Full Analysis</summary>
                <div class="mt-3 text-sm whitespace-pre-line">{{ agenticResponse.analysis.full }}</div>
              </details>
            </div>
            
            <!-- Financial summary section -->
            <div v-if="agenticResponse && agenticResponse.summary" class="mb-6">
              <h4 class="font-semibold text-lg mb-2">Financial Summary</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-600">Income</div>
                  <div class="text-lg font-bold text-blue-700">{{ agenticResponse.summary.income.toFixed(2) }} AED</div>
                </div>
                <div class="p-4 bg-red-50 border border-red-100 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-600">Total Expenses</div>
                  <div class="text-lg font-bold text-red-700">{{ agenticResponse.summary.totalExpenses.toFixed(2) }} AED</div>
                </div>
                <div class="p-4 bg-green-50 border border-green-100 rounded-lg shadow-sm">
                  <div class="text-sm text-gray-600">Current Savings</div>
                  <div class="text-lg font-bold text-green-700">{{ agenticResponse.summary.currentSavings.toFixed(2) }} AED</div>
                </div>
              </div>
              
              <!-- Expense breakdown -->
              <div class="mb-4">
                <h5 class="font-medium mb-2">Expense Breakdown</h5>
                <div class="bg-white border rounded-lg overflow-hidden">
                  <div class="grid grid-cols-2 gap-1 p-3">
                    <div v-for="(amount, category) in agenticResponse.summary.expenses" :key="category" 
                         class="flex justify-between items-center p-2 rounded">
                      <span class="text-sm">{{ category }}</span>
                      <span class="font-medium">{{ amount.toFixed(2) }} AED</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Spending patterns -->
              <div v-if="agenticResponse.summary.spendingPatterns && agenticResponse.summary.spendingPatterns.length > 0">
                <h5 class="font-medium mb-2">Spending Patterns</h5>
                <div class="overflow-x-auto">
                  <table class="min-w-full border bg-white rounded-lg">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="py-2 px-3 text-left text-xs font-medium text-gray-500">Category</th>
                        <th class="py-2 px-3 text-left text-xs font-medium text-gray-500">Monthly Avg</th>
                        <th class="py-2 px-3 text-left text-xs font-medium text-gray-500">Trend</th>
                        <th class="py-2 px-3 text-left text-xs font-medium text-gray-500">Variability</th>
                        <th class="py-2 px-3 text-left text-xs font-medium text-gray-500">Type</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="pattern in agenticResponse.summary.spendingPatterns" :key="pattern.category">
                        <td class="py-2 px-3 text-sm">{{ pattern.category }}</td>
                        <td class="py-2 px-3 text-sm font-medium">{{ pattern.avgMonthly.toFixed(2) }} AED</td>
                        <td class="py-2 px-3 text-sm">
                          <span class="px-2 py-1 text-xs rounded-full" 
                                :class="{
                                  'bg-green-100 text-green-800': pattern.trend === 'increasing',
                                  'bg-red-100 text-red-800': pattern.trend === 'decreasing',
                                  'bg-gray-100 text-gray-800': pattern.trend === 'stable'
                                }">
                            {{ pattern.trend }}
                          </span>
                        </td>
                        <td class="py-2 px-3 text-sm">{{ (pattern.variability * 100).toFixed(1) }}%</td>
                        <td class="py-2 px-3 text-sm">
                          <span class="px-2 py-1 text-xs rounded-full" 
                                :class="{
                                  'bg-red-100 text-red-800': pattern.importance === 'essential',
                                  'bg-blue-100 text-blue-800': pattern.importance === 'variable',
                                  'bg-purple-100 text-purple-800': pattern.importance === 'discretionary'
                                }">
                            {{ pattern.importance }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Savings Goal -->
              <div class="mt-4">
                <h5 class="font-medium mb-2">Savings Goal</h5>
                <div class="bg-white border rounded-lg p-4">
                  <div class="font-medium">{{ agenticResponse.summary.goal.description }}</div>
                  <div class="mt-2 flex items-center">
                    <div class="w-full bg-gray-200 rounded-full h-4 mr-2">
                      <div class="bg-green-500 h-4 rounded-full" 
                           :style="`width: ${(agenticResponse.summary.goal.current_amount / agenticResponse.summary.goal.target_amount) * 100}%`">
                      </div>
                    </div>
                    <span class="text-sm whitespace-nowrap">{{ Math.round((agenticResponse.summary.goal.current_amount / agenticResponse.summary.goal.target_amount) * 100) }}%</span>
                  </div>
                  <div class="text-sm mt-2">
                    <span class="text-gray-600">Target: </span>
                    <span class="font-medium">{{ agenticResponse.summary.goal.target_amount.toLocaleString() }} AED</span>
                    <span class="text-gray-600 ml-4">by </span>
                    <span class="font-medium">{{ new Date(agenticResponse.summary.goal.target_date).toLocaleDateString() }}</span>
                  </div>
                  <div class="text-sm">
                    <span class="text-gray-600">Current: </span>
                    <span class="font-medium">{{ agenticResponse.summary.goal.current_amount.toLocaleString() }} AED</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Recommendations -->
            <h4 class="font-semibold text-lg mb-2">Recommendations</h4>
            <div v-for="(rec, index) in agenticRecommendations" :key="index" 
                class="p-4 rounded-lg border shadow-sm mb-4"
                :class="getRecommendationClass(rec.type)">
              <div class="flex justify-between items-start">
                <div class="font-semibold">{{ rec.description }}</div>
                <span class="px-2 py-1 text-xs rounded-full capitalize"
                      :class="{
                        'bg-blue-100 text-blue-800': rec.type === 'savings_allocation',
                        'bg-yellow-100 text-yellow-800': rec.type === 'spending_alert',
                        'bg-green-100 text-green-800': rec.type === 'goal_adjustment'
                      }">
                  {{ rec.type.replace('_', ' ') }}
                </span>
              </div>
              <div v-if="rec.amount && rec.amount > 0" class="text-lg font-bold mt-1 text-green-700">{{ rec.amount.toFixed(2) }} AED</div>
              <div class="text-sm text-gray-600 mt-1">{{ rec.reason }}</div>
              <div class="text-sm text-gray-500 mt-2">Recommendation ID: {{ rec.recommendation_id }} | Date: {{ new Date(rec.date).toLocaleDateString() }}</div>
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
const selectedCountry = ref('UAE');
const goalInput = ref('');
const useRealtimeData = ref(false);
const realtimeDataUsed = ref(false);

const personaData = ref(null);
const dataLoading = ref(false);

const analysisData = ref(null);
const analysisLoading = ref(false);

const groqRecommendations = ref(null);
const groqLoading = ref(false);
const groqError = ref(null);

const autoActionsData = ref(null);
const autoActionsLoading = ref(false);

const realTimeData = ref(null);
const realTimeDataLoading = ref(false);

const agenticRecommendations = ref(null);
const agenticRecommendationsLoading = ref(false);

const toolUsage = ref({
  toolsExecuted: 0
});

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

// Function to fetch real-time financial data
async function fetchRealTimeData() {
  realTimeDataLoading.value = true;
  try {
    const response = await fetch(`/api/real-time-data?country=${selectedCountry.value}&goals=${goalInput.value}`);
    const data = await response.json();
    realTimeData.value = data;
    toolUsage.value.toolsExecuted += 1;
  } catch (error) {
    console.error('Error fetching real-time financial data:', error);
  } finally {
    realTimeDataLoading.value = false;
  }
}

// Function to get agentic recommendations
async function getAgenticRecommendations() {
  agenticRecommendationsLoading.value = true;
  try {
    const response = await fetch(`/api/agentic-recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        persona: activePersona.value,
        useRealtimeData: useRealtimeData.value
      })
    });
    const data = await response.json();
    agenticRecommendations.value = data.recommendations || [];
    realtimeDataUsed.value = useRealtimeData.value;
  } catch (error) {
    console.error('Error fetching agentic recommendations:', error);
  } finally {
    agenticRecommendationsLoading.value = false;
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