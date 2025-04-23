import { getReemDetails } from '~/models/finance/user-details';

export default defineEventHandler(() => {
  // Get Reem's user details
  const userDetails = getReemDetails();
  
  // Return the user details
  return userDetails;
});