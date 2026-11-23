# מוסיף לקישור לקוד גרסה לפי התוכן, כדי שהדפדפן לא ישתמש בעותק ישן אחרי עדכון
import hashlib,re,pathlib
d=pathlib.Path(__file__).parent
v=hashlib.sha256((d/'app.js').read_bytes()).hexdigest()[:10]
p=d/'index.html';h=p.read_text(encoding='utf8')
h=re.sub(r'<script src="app\.js(\?v=[0-9a-f]+)?"></script>',f'<script src="app.js?v={v}"></script>',h)
p.write_text(h,encoding='utf8');print('app.js?v='+v)
