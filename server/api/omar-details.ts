import { getOmarDetails } from '~/models/finance/user-details';

export default defineEventHandler(() => {
  // Get Omar's user details
  const userDetails = getOmarDetails();
  
  // Return the user details
  return userDetails;
});