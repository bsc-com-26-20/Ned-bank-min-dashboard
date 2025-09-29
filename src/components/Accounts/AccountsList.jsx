import React, { useState } from "react";
import {
  fetchTransactions,
  depositMoney,
  withdrawMoney,
  transferMoney,
  createAccount,
} from "./accounts";
import "./AccountsList.css";

function AccountsList({ customer, accounts, onAccountCreated, refreshDashboard }) {
  const [transactions, setTransactions] = useState({});
  const [transactionForms, setTransactionForms] = useState({});
  const [newAccount, setNewAccount] = useState({
    account_type: "savings",
    initial_balance: 0,
  });

  // Fetch transactions for a specific account
  const handleFetchTransactions = async (accountId) => {
    const data = await fetchTransactions(accountId);
    setTransactions((prev) => ({ ...prev, [accountId]: data }));
  };

  // Update form values for deposit, withdraw, transfer
  const handleTxChange = (accountId, field, value) => {
    setTransactionForms((prev) => ({
      ...prev,
      [accountId]: { ...prev[accountId], [field]: value },
    }));
  };

  // Deposit money
  const handleDeposit = async (accountId) => {
    const { amountDw } = transactionForms[accountId] || {};
    if (!amountDw) return;

    const updated = await depositMoney(accountId, Number(amountDw));
    if (updated.account) updateAccountInList(updated.account);

    handleFetchTransactions(accountId);
    if (refreshDashboard) refreshDashboard();
  };

  // Withdraw money
  const handleWithdraw = async (accountId) => {
    const { amountDw } = transactionForms[accountId] || {};
    if (!amountDw) return;

    const updated = await withdrawMoney(accountId, Number(amountDw));
    if (updated.account) updateAccountInList(updated.account);

    handleFetchTransactions(accountId);
    if (refreshDashboard) refreshDashboard();
  };

  // Transfer money
  const handleTransfer = async (accountId) => {
    const { amountTx, toAccount } = transactionForms[accountId] || {};
    if (!amountTx || !toAccount) return;

    const updated = await transferMoney(accountId, Number(toAccount), Number(amountTx));
    if (updated.from_account) updateAccountInList(updated.from_account);
    if (updated.to_account) updateAccountInList(updated.to_account);

    handleFetchTransactions(accountId);
    if (refreshDashboard) refreshDashboard();
  };

  // Update account locally
  const updateAccountInList = (updatedAccount) => {
    const index = accounts.findIndex((a) => a.id === updatedAccount.id);
    if (index !== -1) {
      accounts[index] = updatedAccount;
    }
  };

  // Create new account
  const handleNewAccountSubmit = async (e) => {
    e.preventDefault();
    const data = await createAccount(customer.id, newAccount);
    if (data.account) {
      onAccountCreated(data.account);
      setNewAccount({ account_type: "savings", initial_balance: 0 });
      if (refreshDashboard) refreshDashboard();
    }
  };

  return (
    <div className="accounts-container">
      <h3>Accounts for {customer.first_name} {customer.last_name}</h3>

      <ul className="accounts-list">
        {accounts.map((a) => (
          <li key={a.id} className="account-card">
            <strong>{a.account_number}</strong> ({a.account_type})<br />
            <small>Account ID: {a.id}</small><br />
            Balance: <span className="balance">{a.balance}</span><br />

            {/* Deposit / Withdraw */}
            <div className="transaction-form">
              <input
                type="number"
                placeholder="Amount"
                onChange={(e) => handleTxChange(a.id, "amountDw", e.target.value)}
              />
              <button onClick={() => handleDeposit(a.id)}>Deposit</button>
              <button onClick={() => handleWithdraw(a.id)}>Withdraw</button>
            </div>

            {/* Transfer */}
            <div className="transaction-form">
              <input
                type="number"
                placeholder="To Account ID"
                onChange={(e) => handleTxChange(a.id, "toAccount", e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount"
                onChange={(e) => handleTxChange(a.id, "amountTx", e.target.value)}
              />
              <button onClick={() => handleTransfer(a.id)}>Transfer</button>
            </div>

            <button className="view-btn" onClick={() => handleFetchTransactions(a.id)}>
              View Transactions
            </button>

            {transactions[a.id] && (
              <ul className="transactions-list">
                {transactions[a.id].length === 0 ? (
                  <li>No transactions yet</li>
                ) : (
                  transactions[a.id].map((t) => (
                    <li key={t.id}>
                      {t.type.toUpperCase()} — {t.amount} ({t.description})
                    </li>
                  ))
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {/* New Account Form */}
      <form onSubmit={handleNewAccountSubmit} className="new-account-form">
        <h4>Create New Account</h4>

        <div className="form-group">
          <label>Account Type</label>
          <select
            value={newAccount.account_type}
            onChange={(e) =>
              setNewAccount((prev) => ({ ...prev, account_type: e.target.value }))
            }
          >
            <option value="savings">Savings</option>
            <option value="checking">Checking</option>
          </select>
        </div>

        <div className="form-group">
          <label>Initial Balance</label>
          <input
            type="number"
            value={newAccount.initial_balance}
            onChange={(e) =>
              setNewAccount((prev) => ({ ...prev, initial_balance: e.target.value }))
            }
            placeholder="Enter initial balance"
          />
        </div>

        <button type="submit" className="btn-primary">
          ➕ Create Account
        </button>
      </form>
    </div>
  );
}

export default AccountsList;
