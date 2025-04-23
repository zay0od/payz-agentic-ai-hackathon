import { getFatimaDetails } from '~/models/finance/user-details';

export default defineEventHandler(() => {
  // Get Fatima's user details
  const userDetails = getFatimaDetails();
  
  // Return the user details
  return userDetails;
});