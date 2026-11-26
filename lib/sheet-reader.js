/* קורא קובץ פירוט (Excel או CSV) בתוך Worker נפרד, מבודד מהאפליקציה.
   ספריית האקסל (0.18.5) כוללת שתי פרצות מוכרות בקריאת קבצים: זיהום prototype ו-ReDoS.
   כאן הן לא מגיעות לאפליקציה: הזיהום נשאר בתוך ה-Worker, תקיעה נקטעת אחרי זמן קצוב,
   ומה שחוזר הוא רק טבלאות של ערכים פשוטים (מספרים ומחרוזות) */
self.onmessage = function (e) {
  try {
    importScripts('xlsx.full.min.js');
    var m = e.data || {};
    var wb = m.text != null
      ? XLSX.read(String(m.text), { type: 'string', raw: true, dense: true })
      : XLSX.read(new Uint8Array(m.buf), { type: 'array', cellDates: false, dense: true });
    var out = [];
    var names = (wb.SheetNames || []).slice(0, 8);
    for (var s = 0; s < names.length; s++) {
      var rows = XLSX.utils.sheet_to_json(wb.Sheets[names[s]], { header: 1, raw: true, defval: '', blankrows: false });
      var clean = [];
      for (var r = 0; r < rows.length && r < 5000; r++) {
        var row = rows[r] || [], cr = [];
        for (var c = 0; c < row.length && c < 40; c++) {
          var v = row[c];
          cr.push(typeof v === 'number' && isFinite(v) ? v : String(v == null ? '' : v).slice(0, 200));
        }
        clean.push(cr);
      }
      out.push(clean);
    }
    postMessage({ ok: true, sheets: out });
  } catch (err) {
    postMessage({ ok: false });
  }
};
