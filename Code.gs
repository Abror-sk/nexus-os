const SHEET_ID = "1dUoqQgbcAFxFw94kOf8P5vAK4ywOIxB2vSmwgDtP4yk";

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Frontend')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    if (action === 'getProducts') {
      return ContentService.createTextOutput(JSON.stringify(getProducts()))
        .setMimeType(ContentService.MimeType.JSON);
    } 
    else if (action === 'addProduct') {
      return ContentService.createTextOutput(JSON.stringify(addProduct(data)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    else if (action === 'createTransaction') {
      return ContentService.createTextOutput(JSON.stringify(createTransaction(data)))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Unknown action'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getProducts() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Products');
    const data = sheet.getDataRange().getValues();
    const products = [];
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) {
        products.push({
          sku: data[i][0],
          name: data[i][1],
          price: parseFloat(data[i][2]),
          category: data[i][3],
          stock: parseInt(data[i][4]),
          barcode: data[i][5]
        });
      }
    }
    
    return {success: true, products: products};
  } catch (err) {
    return {success: false, error: 'getProducts: ' + err.toString()};
  }
}

function addProduct(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Products');
    
    sheet.appendRow([
      'SKU_' + Date.now(),
      data.name,
      data.price,
      data.category,
      data.stock,
      'BAR_' + Date.now()
    ]);
    
    return {success: true, message: 'Товар добавлен успешно'};
  } catch (err) {
    return {success: false, error: 'addProduct: ' + err.toString()};
  }
}

function createTransaction(data) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('Transactions');
    
    // Правильное время Алматы
    const now = new Date();
    const almaty = Utilities.formatDate(now, 'Asia/Almaty', 'yyyy-MM-dd HH:mm:ss');
    
    // Правильный формат товаров
    const itemsJson = JSON.stringify(data.items.map(item => ({
      name: item.name,
      price: item.price
    })));
    
    sheet.appendRow([
      'TXN_' + Date.now(),
      almaty,
      'sale',
      'ORG_001',
      itemsJson,
      data.total,
      'cash'
    ]);
    
    return {success: true, transactionId: 'TXN_' + Date.now(), total: data.total};
  } catch (err) {
    return {success: false, error: 'createTransaction: ' + err.toString()};
  }
}
