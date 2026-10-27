import type { Language } from './loremGenerator.ts';

// Independently selected common vocabulary for layout testing. No literary excerpts.
const vocabularies: Record<Language, string> = {
  ko: '디자인|화면|문장|공간|색상|간격|제목|본문|단어|문단|목록|정렬|크기|너비|높이|순서|페이지|버튼|메뉴|창문|나무|바다|하늘|바람|구름|숲|강물|빛|시간|기록|연결|변화',
  en: 'design|screen|sentence|space|color|margin|title|text|word|paragraph|list|alignment|size|width|height|order|page|button|menu|window|tree|sea|sky|wind|cloud|forest|river|light|time|record|connection|change',
  es: 'diseño|pantalla|frase|espacio|color|margen|título|texto|palabra|párrafo|lista|alineación|tamaño|ancho|altura|orden|página|botón|menú|ventana|árbol|mar|cielo|viento|nube|bosque|río|luz|tiempo|registro|conexión|cambio',
  fr: 'dessin|écran|phrase|espace|couleur|marge|titre|texte|mot|paragraphe|liste|alignement|taille|largeur|hauteur|ordre|page|bouton|menu|fenêtre|arbre|mer|ciel|vent|nuage|forêt|rivière|lumière|temps|registre|lien|changement',
  de: 'Gestaltung|Bildschirm|Satz|Raum|Farbe|Rand|Titel|Text|Wort|Absatz|Liste|Ausrichtung|Größe|Breite|Höhe|Reihenfolge|Seite|Schaltfläche|Menü|Fenster|Baum|Meer|Himmel|Wind|Wolke|Wald|Fluss|Licht|Zeit|Eintrag|Verbindung|Wandel',
  la: 'forma|tabula|sententia|spatium|color|margo|titulus|textus|verbum|pars|index|ordo|mensura|latitudo|altitudo|series|pagina|signum|porta|fenestra|arbor|mare|caelum|ventus|nubes|silva|flumen|lux|tempus|memoria|nexus|mutatio',
  ru: 'дизайн|экран|предложение|пространство|цвет|поле|заголовок|текст|слово|абзац|список|выравнивание|размер|ширина|высота|порядок|страница|кнопка|меню|окно|дерево|море|небо|ветер|облако|лес|река|свет|время|запись|связь|изменение',
  ja: '設計|画面|文章|空間|色|余白|見出し|本文|言葉|段落|一覧|配置|寸法|幅|高さ|順番|頁|ボタン|メニュー|窓|木|海|空|風|雲|森|川|光|時間|記録|接続|変化',
  zh: '设计|屏幕|句子|空间|颜色|边距|标题|正文|词语|段落|列表|对齐|尺寸|宽度|高度|顺序|页面|按钮|菜单|窗户|树木|海洋|天空|风|云|森林|河流|光线|时间|记录|连接|变化',
  vi: 'thiết kế|màn hình|câu|không gian|màu sắc|lề|tiêu đề|văn bản|từ|đoạn|danh sách|căn chỉnh|kích thước|chiều rộng|chiều cao|thứ tự|trang|nút|trình đơn|cửa sổ|cây|biển|bầu trời|gió|mây|rừng|sông|ánh sáng|thời gian|bản ghi|kết nối|thay đổi',
  th: 'ออกแบบ|หน้าจอ|ประโยค|พื้นที่|สี|ขอบ|หัวข้อ|ข้อความ|คำ|ย่อหน้า|รายการ|จัดวาง|ขนาด|ความกว้าง|ความสูง|ลำดับ|หน้า|ปุ่ม|เมนู|หน้าต่าง|ต้นไม้|ทะเล|ท้องฟ้า|ลม|เมฆ|ป่า|แม่น้ำ|แสง|เวลา|บันทึก|เชื่อมต่อ|เปลี่ยนแปลง',
};

export const corpus = Object.fromEntries(
  Object.entries(vocabularies).map(([language, words]) => [language, {
    words: words.split('|'),
    punctuation: ['ja', 'zh'].includes(language) ? ['。', '。', '、', '！', '？'] : ['.', '.', ',', '!', '?'],
  }]),
) as Record<Language, { words: string[]; punctuation: string[] }>;
