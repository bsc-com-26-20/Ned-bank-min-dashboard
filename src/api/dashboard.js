import { apiRequest } from "./api";

// Get overall stats
export async function fetchStats() {
  return await apiRequest("/stats");
}

// Get recent transactions
export async function fetchRecentTransactions() {
  return await apiRequest("/accounts/recent/all");
}

// Generate and download report
export async function generateReport() {
  const response = await apiRequest("/reports/daily", {
    method: "GET",
    responseType: "blob",
  });

  const blob = await response.blob(); // PDF data
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "report.pdf";
  link.click();
  window.URL.revokeObjectURL(url);
}

// Generate, download, and send report to HR
export async function sendAndDownloadReport() {
  const response = await apiRequest("/reports/daily/send", {
    method: "GET",
    responseType: "blob", // ensures we get PDF data
  });

  // Convert response to blob and download
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "report.pdf";
  link.click();
  window.URL.revokeObjectURL(url);
}
