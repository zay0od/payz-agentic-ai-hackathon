// Define user details type
export interface UserDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  monthlySalary: number;
  age: number;
  address: string;
  joinDate: string;
  preferredLanguage: string;
  accountType: string;
}

// Generate mock user data for Fatima
export function getFatimaDetails(): UserDetails {
  return {
    id: "USR001",
    name: "Fatima Ahmed",
    email: "fatima.ahmed@example.com",
    phone: "+971 50 123 4567",
    occupation: "Software Engineer",
    monthlySalary: 18000,
    age: 28,
    address: "Downtown Dubai, UAE",
    joinDate: "2022-03-15",
    preferredLanguage: "Arabic",
    accountType: "Platinum"
  };
}

// Generate mock user data for Omar
export function getOmarDetails(): UserDetails {
  return {
    id: "USR002",
    name: "Omar Khan",
    email: "omar.khan@example.com",
    phone: "+971 55 987 6543",
    occupation: "Marketing Manager",
    monthlySalary: 22000,
    age: 34,
    address: "Jumeirah, Dubai, UAE",
    joinDate: "2021-09-10",
    preferredLanguage: "English",
    accountType: "Gold"
  };
}

// Generate mock user data for Reem
export function getReemDetails(): UserDetails {
  return {
    id: "USR003",
    name: "Reem Al Hashmi",
    email: "reem.alhashmi@example.com",
    phone: "+971 52 456 7890",
    occupation: "Financial Analyst",
    monthlySalary: 25000,
    age: 32,
    address: "Abu Dhabi, UAE",
    joinDate: "2023-01-20",
    preferredLanguage: "Arabic",
    accountType: "Diamond"
  };
}