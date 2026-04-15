// ================================================================
// POOL PARTY RSVP — Google Apps Script Backend
// ================================================================
// SETUP (takes ~3 minutes):
//
// 1. Go to sheets.google.com and create a new blank spreadsheet
//    Name it "Pool Party RSVPs"
//
// 2. Copy the ID from the URL — it's the long string between /d/ and /edit
//    e.g. https://docs.google.com/spreadsheets/d/THIS_PART_HERE/edit
//    Paste it as the value of SHEET_ID below.
//
// 3. In the spreadsheet go to Extensions > Apps Script
//    Delete any existing code and paste this entire file.
//
// 4. Click Deploy > New Deployment
//    - Type: Web App
//    - Execute as: Me
//    - Who has access: Anyone
//    Click Deploy, authorise when prompted, then copy the Web App URL.
//
// 5. Paste that URL into rsvp.html (APPS_SCRIPT_URL) and dashboard.html
// ================================================================

var SHEET_ID   = 'YOUR_SHEET_ID_HERE'; // ← paste your Google Sheet ID
var SHEET_NAME = 'RSVPs';

// ── Receive a form submission ────────────────────────────────────
function doPost(e) {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    // Write header row if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Name', 'Email', 'Attending',
        'Adults', 'Kids', 'Dietary', 'Message'
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    }

    var d = e.parameter;
    sheet.appendRow([
      new Date().toLocaleString('en-GB'),
      d.name      || '',
      d.email     || '',
      d.attending || '',
      parseInt(d.adults) || 0,
      parseInt(d.kids)   || 0,
      d.dietary   || 'None',
      d.message   || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Return all rows as JSON (used by dashboard.html) ────────────
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ rows: [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var values  = sheet.getDataRange().getValues();
    var headers = values[0];
    var rows    = values.slice(1).map(function(row) {
      var obj = {};
      headers.forEach(function(h, i) { obj[h] = row[i]; });
      return obj;
    });

    return ContentService
      .createTextOutput(JSON.stringify({ rows: rows }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
