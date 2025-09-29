import { apiRequest } from "../../api/api";

// ✅ Fetch accounts for a customer
export async function fetchAccounts(customerId) {
  return await apiRequest(`/customers/${customerId}/accounts`);
}

// ✅ Create a new account
export async function createAccount(customerId, account) {
  return await apiRequest("/accounts", {
    method: "POST",
    body: JSON.stringify({
      customer_id: customerId,
      account_type: account.account_type,
      initial_balance: account.initial_balance,
    }),
  });
}

// ✅ Fetch transactions for a specific account
export async function fetchTransactions(accountId) {
  return await apiRequest(`/accounts/${accountId}/transactions`);
}

// ✅ Deposit money
export async function depositMoney(accountId, amount) {
  return await apiRequest(`/accounts/${accountId}/deposit`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

// ✅ Withdraw money
export async function withdrawMoney(accountId, amount) {
  return await apiRequest(`/accounts/${accountId}/withdraw`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}

// ✅ Transfer money
export async function transferMoney(fromAccountId, toAccountId, amount) {
  return await apiRequest(`/accounts/${fromAccountId}/transfer/${toAccountId}`, {
    method: "POST",
    body: JSON.stringify({ amount }),
  });
}
