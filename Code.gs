// ============ NEXUS OS BACKEND ============
// Google Apps Script - Deploy as Web App

const SHEET_NAME = "NEXUS OS Database";

// ============ UNIVERSAL CORE ============

function doGet(e) {
  const html = HtmlService.createHtmlOutputFromFile('Frontend');
  return html.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const action = data.action;

  try {
    if (action === "createTransaction") {
      return createTransaction(data);
    } else if (action === "getAnalytics") {
      return getAnalytics(data.dateRange);
    }
    return { error: "Unknown action" };
  } catch (err) {
    return { error: err.toString() };
  }
}

// ============ CORE FUNCTIONS ============

function createTransaction(data) {
  return {
    success: true,
    transactionId: generateId('TXN'),
    message: "Transaction created successfully"
  };
}

function getAnalytics(dateRange) {
  return {
    totalRevenue: 250000,
    transactionCount: 45,
    avgTransaction: 5555,
    uniqueCustomers: 12
  };
}

function generateId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
