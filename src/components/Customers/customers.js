import { apiRequest } from "../../api/api";

// Get all customers
export async function fetchCustomers() {
  return await apiRequest("/customers");
}

// Create a new customer
export async function createCustomer(form) {
  return await apiRequest("/customers", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

// Get accounts for a customer
export async function fetchCustomerAccounts(customerId) {
  return await apiRequest(`/customers/${customerId}/accounts`);
}
