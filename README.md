# Payz Agentic AI Hackathon

This project showcases intelligent financial management using advanced AI capabilities via the Groq API.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more about the framework.

## API Documentation

The application provides various API endpoints for financial data analysis and automated actions for different users (Fatima, Omar, and Reem).

### User Details

Endpoints that provide basic profile information for users:

- `GET /api/fatima-details`: Returns Fatima's profile information
- `GET /api/omar-details`: Returns Omar's profile information
- `GET /api/reem-details`: Returns Reem's profile information

Response example:
```json
{
  "id": "USR001",
  "name": "Fatima Ahmed",
  "email": "fatima.ahmed@example.com",
  "phone": "+971 50 123 4567",
  "occupation": "Software Engineer",
  "monthlySalary": 18000,
  "age": 28,
  "address": "Downtown Dubai, UAE",
  "joinDate": "2022-03-15",
  "preferredLanguage": "Arabic",
  "accountType": "Platinum"
}
```

### User Financial Analysis

Endpoints that provide AI-powered analysis of financial data:

- `GET /api/fatima-analysis`: Analyzes Fatima's financial data
- `GET /api/omar-analysis`: Analyzes Omar's financial data
- `GET /api/reem-analysis`: Analyzes Reem's financial data

Query parameters:
- `months` (optional): Number of months of data to analyze (default: 12)

Example:
```
GET /api/fatima-analysis?months=6
```

### User Financial Data

Endpoints that return raw financial data:

- `GET /api/fatima-data`: Returns Fatima's financial data
- `GET /api/omar-data`: Returns Omar's financial data
- `GET /api/reem-data`: Returns Reem's financial data

Query parameters:
- `months` (optional): Number of months of data to return (default: 12)

### User Actions

Endpoints for manual financial actions:

- `POST /api/fatima-actions`: Perform financial actions for Fatima
- `POST /api/omar-actions`: Perform financial actions for Omar
- `POST /api/reem-actions`: Perform financial actions for Reem

### Automated Actions

Endpoints for AI-recommended automated financial actions:

- `GET /api/fatima-auto-actions`: Get AI-recommended actions for Fatima
- `GET /api/omar-auto-actions`: Get AI-recommended actions for Omar
- `GET /api/reem-auto-actions`: Get AI-recommended actions for Reem

### GROQ Integration

Advanced AI analysis endpoints:

- `GET /api/groq-analysis`: Performs advanced AI analysis using GROQ
- `GET /api/groq-recommendations`: Provides AI-powered financial recommendations

### Real-Time Data and Agentic Capabilities

New endpoints with advanced AI capabilities:

- `GET /api/groq-realtime-data`: Fetches current market data through Groq's agentic API
  - Query parameters:
    - `country` (optional): Target country for financial data (default: 'UAE')
    - `goals` (optional): Comma-separated financial goals (default: 'mortgage,retirement,education')
    - `timeframe` (optional): Planning timeframe (default: '12 months')
  - Returns real-time interest rates, market trends, economic indicators, and relevant financial news

- `POST /api/agentic-recommendations`: Generates intelligent financial recommendations using both historical data and real-time market information
  - Request body:
    ```json
    {
      "persona": "fatima", // or "omar", "reem"
      "useRealtimeData": true
    }
    ```
  - Returns comprehensive analysis including:
    - Detailed financial analysis (strengths, weaknesses, opportunities, risks)
    - Financial summary with income, expenses, and savings
    - Spending pattern analysis with trends and variability
    - Goal progress tracking
    - Actionable recommendations with amounts and rationale

- `GET /api/real-time-data`: Simplified version of real-time data providing current market information without requiring Groq API access
  - Query parameters:
    - `country` (optional): Target country (default: 'UAE')
    - `goals` (optional): Financial goals context

## Advanced Features

### Agentic Recommendations

The `/api/agentic-recommendations` endpoint combines multiple AI models to provide sophisticated financial advice:

1. It first analyzes financial data using the LLAMA_70B model for in-depth pattern recognition
2. The analysis is then used to generate specific, actionable recommendations with the Compound Beta model
3. When `useRealtimeData` is true, it enriches recommendations with current market conditions

Example request:
```bash
curl -X POST http://localhost:3000/api/agentic-recommendations \
  -H "Content-Type: application/json" \
  -d '{"persona": "fatima", "useRealtimeData": true}'
```

### Real-Time Financial Data

The `/api/groq-realtime-data` endpoint leverages Groq's agentic capabilities to search for current financial information:

- Interest rates (mortgage, savings, personal loans)
- Housing and stock market trends
- Inflation rates
- Economic indicators (GDP growth, unemployment, consumer spending)
- Recent financial news relevant to the user's goals

Example request:
```bash
curl "http://localhost:3000/api/groq-realtime-data?country=UAE&goals=mortgage,education&timeframe=24%20months"
```

## API Testing Dashboard

The application includes a comprehensive API testing dashboard located at `/test-api`. This dashboard allows you to interact with all available API endpoints and visualize the results.

### How to Use the Dashboard

1. **Access the dashboard**: Navigate to `http://localhost:3000/test-api` in your browser after starting the development server.

2. **Select a persona**: Use the tabs at the top to switch between Fatima, Omar, and Reem.

3. **User Profile Section**:
   - Click the "Load Profile" button to fetch and display the user's basic profile information.
   - View personal details (name, email, phone, age, address) and account information (occupation, monthly salary, account type).

4. **Financial Data Section**:
   - Specify the number of months (1-36) of financial data to retrieve.
   - Click "Load Data" to fetch the user's financial information.
   - View account balances and recent transactions with category indicators.

5. **AI Financial Analysis**:
   - Specify the time period for analysis (1-36 months).
   - Click "Get Analysis" to fetch AI-powered financial insights.
   - Review monthly overview metrics (income, expenses, savings rate) and personalized recommendations.

6. **Groq API Recommendations**:
   - Set the analysis period using the months input.
   - Click "Get Groq Recommendations" to fetch advanced AI-powered recommendations.
   - View detailed financial advice generated using the Groq LLM.

7. **Auto-Actions Test**:
   - Select an execution mode (Full Auto, Semi Auto, or Dry Run).
   - Click "Run Auto Actions" to simulate automated financial actions.
   - Review the action logs and implemented recommendations.

8. **Groq Agentic Tooling Test**:
   - **Real-Time Financial Data**: Fetch current market data for different countries and financial goals.
   - **Agentic Financial Recommendations**: Get sophisticated recommendations by analyzing both historical and real-time data.
   - Toggle between using simulated data only or including real-time market information.

### Execution Modes for Auto-Actions

- **Full Auto**: Automatically executes all recommended actions without user intervention.
- **Semi Auto**: Presents recommendations for user approval before execution.
- **Dry Run**: Simulates the execution process without making actual changes.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Environment Variables

Create a `.env` file with the following variables:

```
GROQ_API_KEY=your_groq_api_key
```

You can obtain a Groq API key by signing up at [https://console.groq.com](https://console.groq.com).

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
