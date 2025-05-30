import { GroqApiClient, GROQ_MODELS } from '~/models/groq-client';
import { H3Event } from 'h3';

// Initialize Groq API client
let groqClient: GroqApiClient | null = null;

/**
 * Get the Groq API client instance
 */
export const getGroqClient = (event?: H3Event): GroqApiClient => {
  // If client already exists, return it
  if (groqClient) {
    return groqClient;
  }

  // Get API key from runtime config
  const config = useRuntimeConfig();
  const apiKey = config.groqApiKey;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in runtime config');
  }

  // Create and return a new client
  groqClient = new GroqApiClient(apiKey);
  return groqClient;
};

/**
 * Get the available Groq models
 */
export const getAvailableModels = () => {
  return Object.values(GROQ_MODELS);
};