# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

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
