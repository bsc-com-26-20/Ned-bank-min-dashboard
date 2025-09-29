import React, { useState, useEffect } from "react";
import CustomersPage from "../components/Customers/CustomersPage";
import "./Dashboard.css";
import {
  fetchStats,
  fetchRecentTransactions,
  sendAndDownloadReport,
} from "../api/dashboard";

function Dashboard() {
  const [page, setPage] = useState("home");
  const [stats, setStats] = useState({
    total_customers: 0,
    total_accounts: 0,
    total_balance: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const refreshDashboard = async () => {
    try {
      const statsData = await fetchStats();

      // ✅ ensure numbers are parsed
      setStats({
        total_customers: Number(statsData.total_customers) || 0,
        total_accounts: Number(statsData.total_accounts) || 0,
        total_balance: Number(statsData.total_balance) || 0,
      });

      const transactionsData = await fetchRecentTransactions();

      // ✅ ensure it's always an array & amounts are numbers
      setRecentTransactions(
        Array.isArray(transactionsData)
          ? transactionsData.map((tx) => ({
              ...tx,
              amount: Number(tx.amount) || 0,
            }))
          : []
      );
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
      setRecentTransactions([]);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        await refreshDashboard();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      await sendAndDownloadReport();
      alert("Report successfully sent to HR manager!");
    } catch (err) {
      console.error("Report error:", err);
      alert("Failed to send report. Check server logs.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">NED Bank System</h2>
        <nav>
          <ul>
            <li
              className={page === "home" ? "active" : ""}
              onClick={() => setPage("home")}
            >
              Home
            </li>
            <li
              className={page === "customers" ? "active" : ""}
              onClick={() => setPage("customers")}
            >
              Customers
            </li>
            <li onClick={handleLogout} className="logout-btn">
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        {page === "home" && (
          <div className="home-dashboard">
            <h2>Welcome to the Bank Dashboard</h2>

            {loading ? (
              <p>Loading dashboard data...</p>
            ) : (
              <>
                <div className="kpi-cards">
                  <div className="kpi-card">
                    <h3>Total Customers</h3>
                    <p>{stats.total_customers}</p>
                  </div>
                  <div className="kpi-card">
                    <h3>Total Accounts</h3>
                    <p>{stats.total_accounts}</p>
                  </div>
                  <div className="kpi-card">
                    <h3>Total Balance</h3>
                    <p>MWK{stats.total_balance.toLocaleString()}</p>
                  </div>
                </div>

                <div className="transactions-section">
                  <h3>Recent Transactions</h3>
                  <ul className="transactions-list">
                    {recentTransactions.length === 0 ? (
                      <li>No recent transactions</li>
                    ) : (
                      recentTransactions.map((tx) => (
                        <li key={tx.id} className="transaction-item">
                          <div>
                            <span
                              className={`tx-type ${tx.type.toLowerCase()}`}
                            >
                              {tx.type}
                            </span>{" "}
                            — MWK{tx.amount.toLocaleString()}
                          </div>
                          <div className="tx-meta">
                            👤 {tx.first_name} {tx.last_name} &nbsp; | &nbsp; 💳{" "}
                            {tx.account_number}
                            <span className="tx-date">
                              {new Date(tx.created_at).toLocaleDateString()}{" "}
                              {new Date(tx.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                <button
                  onClick={handleGenerateReport}
                  className="report-btn"
                  disabled={reportLoading}
                >
                  {reportLoading
                    ? "Generating..."
                    : "📤 Generate & Send Report"}
                </button>
              </>
            )}
          </div>
        )}

        {page === "customers" && (
          <CustomersPage refreshDashboard={refreshDashboard} />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
