// ================================================================
// RSVP Backend — Google Apps Script
// Routes submissions to separate tabs based on form_source:
//   "Church" → Church RSVPs
//   "Yoga"   → Caroline's Birthday RSVPs
//   (default) → Pool Party RSVPs
// ================================================================

var SHEET_ID = '1a6ZyugW4aa3XtzduFRiqsZmI63jzm8Z5cLRnllUMIPU';

// ── Receive a form submission ────────────────────────────────────
function doPost(e) {
  try {
    var ss     = SpreadsheetApp.openById(SHEET_ID);
    var source = (e.parameter.form_source || '').trim();

    var tabName = source === 'Church' ? 'Church RSVPs'
                : source === 'Yoga'   ? "Caroline's Birthday RSVPs"
                : 'Pool Party RSVPs';

    var sheet = ss.getSheetByName(tabName) || ss.insertSheet(tabName);

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
    var ss     = SpreadsheetApp.openById(SHEET_ID);
    var source = (e.parameter.form_source || '').trim();

    var tabName = source === 'Church' ? 'Church RSVPs'
                : source === 'Yoga'   ? "Caroline's Birthday RSVPs"
                : 'Pool Party RSVPs';

    var sheet = ss.getSheetByName(tabName);
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
