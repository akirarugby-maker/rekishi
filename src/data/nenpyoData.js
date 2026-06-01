// Piecewise-linear scale: more pixels for modern (event-dense) periods
const BP = [
  [-250, 0],
  [0,    200],
  [600,  700],
  [1000, 1200],
  [1500, 2200],
  [1700, 2800],
  [1868, 3600],
  [1945, 4400],
  [2025, 4800],
];
export const TL_TOTAL_W = 4800;
export const TL_START = -250;
export const TL_END = 2025;

export function yearToX(year) {
  for (let i = 0; i < BP.length - 1; i++) {
    const [y0, x0] = BP[i];
    const [y1, x1] = BP[i + 1];
    if (year >= y0 && year <= y1) {
      return x0 + ((year - y0) / (y1 - y0)) * (x1 - x0);
    }
  }
  if (year < BP[0][0]) return BP[0][1];
  return BP[BP.length - 1][1];
}

// imp: 3=重要★★★, 2=重要★★
// eraId: 日本史タブの時代ID  sectionId: 世界史タブのセクションID
export const NIHONSHI_EVENTS = [
  { year: -57,  label: "倭奴国、後漢に朝貢",        imp: 2, eraId: "genshi" },
  { year: 57,   label: "倭の奴国王が印綬",           imp: 2, eraId: "genshi" },
  { year: 239,  label: "卑弥呼、魏に遣使",           imp: 3, eraId: "genshi" },
  { year: 538,  label: "仏教伝来（百済）",            imp: 3, eraId: "kofun" },
  { year: 593,  label: "聖徳太子が摂政に",           imp: 3, eraId: "asuka" },
  { year: 604,  label: "十七条憲法",                 imp: 2, eraId: "asuka" },
  { year: 630,  label: "第1回遣唐使",                imp: 2, eraId: "asuka" },
  { year: 645,  label: "大化の改新",                 imp: 3, eraId: "asuka" },
  { year: 672,  label: "壬申の乱",                   imp: 2, eraId: "asuka" },
  { year: 701,  label: "大宝律令",                   imp: 3, eraId: "asuka" },
  { year: 710,  label: "奈良遷都（平城京）",          imp: 3, eraId: "nara" },
  { year: 743,  label: "墾田永年私財法",              imp: 2, eraId: "nara" },
  { year: 752,  label: "東大寺大仏開眼",              imp: 2, eraId: "nara" },
  { year: 794,  label: "平安京遷都",                 imp: 3, eraId: "heian" },
  { year: 894,  label: "遣唐使廃止",                 imp: 2, eraId: "heian" },
  { year: 1016, label: "藤原道長が摂政に",            imp: 2, eraId: "heian" },
  { year: 1086, label: "白河上皇が院政開始",          imp: 3, eraId: "heian" },
  { year: 1156, label: "保元の乱",                   imp: 2, eraId: "heian" },
  { year: 1185, label: "平氏滅亡・守護地頭設置",      imp: 3, eraId: "kamakura" },
  { year: 1192, label: "源頼朝が征夷大将軍",          imp: 3, eraId: "kamakura" },
  { year: 1221, label: "承久の乱",                   imp: 2, eraId: "kamakura" },
  { year: 1232, label: "御成敗式目（貞永式目）",       imp: 2, eraId: "kamakura" },
  { year: 1274, label: "文永の役（元寇1回目）",        imp: 3, eraId: "kamakura" },
  { year: 1281, label: "弘安の役（元寇2回目）",        imp: 3, eraId: "kamakura" },
  { year: 1333, label: "鎌倉幕府滅亡",                imp: 3, eraId: "nanbokucho" },
  { year: 1334, label: "建武の新政（後醍醐天皇）",     imp: 2, eraId: "nanbokucho" },
  { year: 1336, label: "湊川の戦い・南朝成立",         imp: 3, eraId: "nanbokucho" },
  { year: 1338, label: "室町幕府成立（足利尊氏）",     imp: 3, eraId: "muromachi" },
  { year: 1350, label: "観応の擾乱",                  imp: 2, eraId: "nanbokucho" },
  { year: 1392, label: "南北朝合一（足利義満）",       imp: 3, eraId: "muromachi" },
  { year: 1397, label: "金閣建立（北山文化）",         imp: 2, eraId: "muromachi" },
  { year: 1404, label: "勘合貿易開始",                imp: 2, eraId: "muromachi" },
  { year: 1428, label: "正長の土一揆",                imp: 3, eraId: "muromachi" },
  { year: 1441, label: "嘉吉の変（赤松満祐）",         imp: 3, eraId: "muromachi" },
  { year: 1467, label: "応仁の乱",                   imp: 3, eraId: "muromachi" },
  { year: 1485, label: "山城の国一揆",                imp: 3, eraId: "muromachi" },
  { year: 1488, label: "加賀一向一揆（〜1580）",       imp: 2, eraId: "muromachi" },
  { year: 1543, label: "鉄砲伝来（種子島）",           imp: 3, eraId: "sengoku" },
  { year: 1549, label: "キリスト教伝来（ザビエル）",   imp: 2, eraId: "sengoku" },
  { year: 1555, label: "厳島の戦い（毛利元就）",       imp: 3, eraId: "sengoku" },
  { year: 1560, label: "桶狭間の戦い（信長）",         imp: 3, eraId: "sengoku" },
  { year: 1568, label: "信長が京に上洛",               imp: 2, eraId: "sengoku" },
  { year: 1573, label: "室町幕府滅亡",                imp: 2, eraId: "sengoku" },
  { year: 1575, label: "長篠の戦い（鉄砲3000丁）",     imp: 3, eraId: "azuchimomoyama" },
  { year: 1577, label: "但馬攻め（竹田城・秀吉）",       imp: 2, eraId: "azuchimomoyama" },
  { year: 1578, label: "竹田城落城・三木合戦開始",       imp: 2, eraId: "azuchimomoyama" },
  { year: 1580, label: "三木城開城・別所長治自害",       imp: 2, eraId: "azuchimomoyama" },
  { year: 1582, label: "本能寺の変（明智光秀）",        imp: 3, eraId: "azuchimomoyama" },
  { year: 1582, label: "山崎の戦い（秀吉）",           imp: 3, eraId: "azuchimomoyama" },
  { year: 1583, label: "賤ヶ岳の戦い",                imp: 2, eraId: "azuchimomoyama" },
  { year: 1585, label: "秀吉が関白就任",               imp: 3, eraId: "azuchimomoyama" },
  { year: 1587, label: "バテレン追放令",               imp: 2, eraId: "azuchimomoyama" },
  { year: 1588, label: "刀狩令（兵農分離）",            imp: 3, eraId: "azuchimomoyama" },
  { year: 1590, label: "豊臣秀吉が天下統一",           imp: 3, eraId: "azuchimomoyama" },
  { year: 1591, label: "身分統制令",                  imp: 2, eraId: "azuchimomoyama" },
  { year: 1592, label: "文禄の役（朝鮮出兵）",          imp: 2, eraId: "azuchimomoyama" },
  { year: 1600, label: "関ヶ原の戦い",                imp: 3, eraId: "azuchimomoyama" },
  { year: 1603, label: "江戸幕府成立",                imp: 3, eraId: "edo" },
  { year: 1615, label: "大坂夏の陣・豊臣氏滅亡",       imp: 3, eraId: "edo" },
  { year: 1635, label: "参勤交代制定",                imp: 2, eraId: "edo" },
  { year: 1637, label: "島原の乱（キリシタン一揆）",    imp: 3, eraId: "edo" },
  { year: 1641, label: "鎖国完成（4つの窓口）",        imp: 2, eraId: "edo" },
  { year: 1702, label: "赤穂事件（討入り）",            imp: 2, eraId: "edo" },
  { year: 1716, label: "享保の改革（吉宗）",           imp: 2, eraId: "edo" },
  { year: 1787, label: "寛政の改革（松平定信）",        imp: 2, eraId: "edo" },
  { year: 1837, label: "大塩平八郎の乱",               imp: 3, eraId: "edo" },
  { year: 1841, label: "天保の改革（水野忠邦）",        imp: 2, eraId: "edo" },
  { year: 1853, label: "ペリー来航（黒船）",            imp: 3, eraId: "edo" },
  { year: 1858, label: "日米修好通商条約（不平等）",    imp: 3, eraId: "edo" },
  { year: 1866, label: "薩長同盟（龍馬仲介）",          imp: 3, eraId: "edo" },
  { year: 1868, label: "明治維新・五箇条の御誓文",      imp: 3, eraId: "meiji" },
  { year: 1871, label: "廃藩置県",                    imp: 2, eraId: "meiji" },
  { year: 1873, label: "徴兵令・地租改正",              imp: 2, eraId: "meiji" },
  { year: 1877, label: "西南戦争（西郷隆盛）",          imp: 2, eraId: "meiji" },
  { year: 1889, label: "大日本帝国憲法発布",            imp: 3, eraId: "meiji" },
  { year: 1894, label: "日清戦争・領事裁判権撤廃",      imp: 3, eraId: "meiji" },
  { year: 1902, label: "日英同盟締結",                 imp: 2, eraId: "meiji" },
  { year: 1904, label: "日露戦争開始",                 imp: 3, eraId: "meiji" },
  { year: 1910, label: "韓国併合",                    imp: 2, eraId: "meiji" },
  { year: 1914, label: "第一次世界大戦参戦",            imp: 2, eraId: "taisho" },
  { year: 1918, label: "米騒動・原敬内閣成立",          imp: 2, eraId: "taisho" },
  { year: 1923, label: "関東大震災",                   imp: 3, eraId: "taisho" },
  { year: 1925, label: "普通選挙法・治安維持法",         imp: 3, eraId: "taisho" },
  { year: 1931, label: "満洲事変",                    imp: 3, eraId: "showa" },
  { year: 1937, label: "日中戦争（盧溝橋事件）",         imp: 3, eraId: "showa" },
  { year: 1941, label: "太平洋戦争開始",               imp: 3, eraId: "showa" },
  { year: 1945, label: "終戦（ポツダム宣言受諾）",       imp: 3, eraId: "showa" },
  { year: 1946, label: "日本国憲法公布",               imp: 3, eraId: "showa" },
  { year: 1951, label: "サンフランシスコ条約",          imp: 3, eraId: "showa" },
  { year: 1955, label: "55年体制（自民党成立）",        imp: 2, eraId: "showa" },
  { year: 1964, label: "東京五輪・新幹線開通",          imp: 2, eraId: "showa" },
  { year: 1972, label: "日中国交正常化・沖縄復帰",      imp: 3, eraId: "showa" },
  { year: 1989, label: "昭和終わる",                  imp: 2, eraId: "gendai" },
  { year: 1993, label: "55年体制崩壊（細川内閣）",      imp: 2, eraId: "gendai" },
  { year: 2011, label: "東日本大震災（M9.0）",         imp: 3, eraId: "gendai" },
];

export const SEKAISHI_EVENTS = [
  { year: -221, label: "秦の中国統一（始皇帝）",          imp: 3, sectionId: "eastAsia_ancient" },
  { year: -206, label: "漢の成立（劉邦）",                imp: 2, sectionId: "eastAsia_ancient" },
  { year: -44,  label: "カエサル暗殺",                   imp: 2, sectionId: "europe_medieval" },
  { year: -27,  label: "ローマ帝国成立（アウグストゥス）", imp: 3, sectionId: "europe_medieval" },
  { year: 105,  label: "蔡倫が紙を改良（後漢）",          imp: 2, sectionId: "eastAsia_ancient" },
  { year: 220,  label: "後漢滅亡・三国時代",              imp: 2, sectionId: "eastAsia_ancient" },
  { year: 313,  label: "ミラノ勅令（キリスト教公認）",     imp: 3, sectionId: "europe_medieval" },
  { year: 375,  label: "ゲルマン民族の大移動",            imp: 2, sectionId: "europe_medieval" },
  { year: 476,  label: "西ローマ帝国滅亡",               imp: 3, sectionId: "europe_medieval" },
  { year: 589,  label: "隋の中国統一",                   imp: 2, sectionId: "eastAsia_ancient" },
  { year: 618,  label: "唐の成立",                       imp: 3, sectionId: "eastAsia_ancient" },
  { year: 622,  label: "ムハンマドのヒジュラ（イスラム元年）", imp: 3, sectionId: "middleEast" },
  { year: 750,  label: "アッバース朝成立",                imp: 2, sectionId: "middleEast" },
  { year: 800,  label: "カール大帝の戴冠",               imp: 3, sectionId: "europe_medieval" },
  { year: 907,  label: "唐の滅亡",                       imp: 2, sectionId: "eastAsia_ancient" },
  { year: 960,  label: "宋の成立（中国）",               imp: 2, sectionId: "eastAsia_medieval" },
  { year: 1096, label: "第1回十字軍の出発",              imp: 3, sectionId: "europe_medieval" },
  { year: 1206, label: "チンギス・ハンがモンゴル統一",    imp: 3, sectionId: "eastAsia_medieval" },
  { year: 1215, label: "マグナ・カルタ制定",             imp: 3, sectionId: "europe_medieval" },
  { year: 1271, label: "元（モンゴル帝国）の成立",        imp: 2, sectionId: "eastAsia_medieval" },
  { year: 1337, label: "百年戦争開始（英vs仏）",          imp: 2, sectionId: "europe_medieval" },
  { year: 1347, label: "黒死病（ペスト）大流行",          imp: 3, sectionId: "europe_medieval" },
  { year: 1368, label: "明の成立",                       imp: 2, sectionId: "eastAsia_medieval" },
  { year: 1453, label: "東ローマ帝国滅亡（オスマン）",    imp: 3, sectionId: "middleEast" },
  { year: 1492, label: "コロンブスがアメリカ大陸到達",    imp: 3, sectionId: "europe_modern" },
  { year: 1498, label: "バスコ・ダ・ガマがインド航路開拓", imp: 2, sectionId: "europe_modern" },
  { year: 1517, label: "ルターが宗教改革を開始",          imp: 3, sectionId: "europe_modern" },
  { year: 1543, label: "コペルニクスが地動説を発表",       imp: 3, sectionId: "europe_modern" },
  { year: 1588, label: "スペイン無敵艦隊がイギリスに敗北", imp: 2, sectionId: "europe_modern" },
  { year: 1618, label: "三十年戦争（〜1648年）",          imp: 2, sectionId: "europe_modern" },
  { year: 1644, label: "清の成立（中国）",               imp: 2, sectionId: "eastAsia_medieval" },
  { year: 1648, label: "ウェストファリア条約",            imp: 3, sectionId: "europe_modern" },
  { year: 1688, label: "名誉革命（イギリス）",            imp: 3, sectionId: "europe_modern" },
  { year: 1765, label: "ワットが蒸気機関を改良",          imp: 3, sectionId: "industrial" },
  { year: 1776, label: "アメリカ独立宣言",               imp: 3, sectionId: "europe_modern" },
  { year: 1789, label: "フランス革命・人権宣言",          imp: 3, sectionId: "europe_modern" },
  { year: 1804, label: "ナポレオンが皇帝に即位",          imp: 3, sectionId: "europe_modern" },
  { year: 1815, label: "ウィーン会議（ナポレオン後）",     imp: 2, sectionId: "europe_modern" },
  { year: 1840, label: "アヘン戦争（中国vsイギリス）",    imp: 3, sectionId: "eastAsia_medieval" },
  { year: 1848, label: "共産党宣言（マルクス）",          imp: 3, sectionId: "industrial" },
  { year: 1861, label: "南北戦争（アメリカ）",            imp: 2, sectionId: "industrial" },
  { year: 1871, label: "ドイツ帝国成立（ビスマルク）",     imp: 3, sectionId: "industrial" },
  { year: 1884, label: "ベルリン会議（アフリカ分割）",     imp: 2, sectionId: "industrial" },
  { year: 1911, label: "辛亥革命（清の滅亡）",           imp: 3, sectionId: "eastAsia_medieval" },
  { year: 1914, label: "第一次世界大戦勃発（サラエボ事件）", imp: 3, sectionId: "worldWar" },
  { year: 1917, label: "ロシア革命（レーニン）",          imp: 3, sectionId: "worldWar" },
  { year: 1919, label: "ヴェルサイユ条約・国際連盟設立",   imp: 3, sectionId: "worldWar" },
  { year: 1929, label: "世界恐慌（ウォール街の暴落）",     imp: 3, sectionId: "worldWar" },
  { year: 1933, label: "ヒトラーが首相就任",              imp: 3, sectionId: "worldWar" },
  { year: 1939, label: "第二次世界大戦勃発",              imp: 3, sectionId: "worldWar" },
  { year: 1945, label: "第二次世界大戦終結・国連設立",     imp: 3, sectionId: "worldWar" },
  { year: 1947, label: "トルーマン・ドクトリン（冷戦開始）", imp: 2, sectionId: "coldWar" },
  { year: 1949, label: "中華人民共和国成立（毛沢東）",     imp: 3, sectionId: "coldWar" },
  { year: 1950, label: "朝鮮戦争勃発（〜1953年）",        imp: 3, sectionId: "coldWar" },
  { year: 1955, label: "バンドン会議（非同盟運動）",       imp: 2, sectionId: "coldWar" },
  { year: 1962, label: "キューバ危機（核戦争寸前）",       imp: 3, sectionId: "coldWar" },
  { year: 1975, label: "ベトナム戦争終結",               imp: 2, sectionId: "coldWar" },
  { year: 1989, label: "ベルリンの壁崩壊",               imp: 3, sectionId: "coldWar" },
  { year: 1991, label: "ソ連崩壊",                       imp: 3, sectionId: "coldWar" },
  { year: 2001, label: "9.11テロ・アフガン戦争",          imp: 3, sectionId: "coldWar" },
];

export const NIHONSHI_ERAS_TL = [
  { name: "弥生",       start: -300, end: 250,  color: "#D4E6F1" },
  { name: "古墳",       start: 250,  end: 593,  color: "#D5E8D4" },
  { name: "飛鳥",       start: 593,  end: 710,  color: "#FFE6CC" },
  { name: "奈良",       start: 710,  end: 794,  color: "#E1D5E7" },
  { name: "平安",       start: 794,  end: 1185, color: "#DAE8FC" },
  { name: "鎌倉",       start: 1185, end: 1336, color: "#FFF2CC" },
  { name: "南北朝・室町", start: 1336, end: 1573, color: "#FFE6E6" },
  { name: "安土桃山",   start: 1573, end: 1603, color: "#E6FFE6" },
  { name: "江戸",       start: 1603, end: 1868, color: "#FFF9E6" },
  { name: "明治",       start: 1868, end: 1912, color: "#E6F3FF" },
  { name: "大正",       start: 1912, end: 1926, color: "#F3E6FF" },
  { name: "昭和",       start: 1926, end: 1989, color: "#FFE6E6" },
  { name: "平成・令和",  start: 1989, end: 2025, color: "#E6FFE6" },
];

export const SEKAISHI_ERAS_TL = [
  { name: "古代文明",    start: -250, end: 476,  color: "#AED6F1" },
  { name: "中世",        start: 476,  end: 1453, color: "#FDEBD0" },
  { name: "大航海〜宗教改革", start: 1453, end: 1648, color: "#D5F5E3" },
  { name: "絶対主義・市民革命", start: 1648, end: 1815, color: "#E8DAEF" },
  { name: "産業革命・帝国主義", start: 1815, end: 1914, color: "#FDFDC8" },
  { name: "世界大戦",    start: 1914, end: 1945, color: "#FAD7D7" },
  { name: "冷戦〜現代",  start: 1945, end: 2025, color: "#D7F5FA" },
];

// Year axis markers (every 100 years)
export const YEAR_MARKERS = [];
for (let y = -200; y <= 2000; y += 100) YEAR_MARKERS.push(y);

// Era jump shortcuts
export const ERA_JUMPS = [
  { label: "BC古代",     year: -200, color: "#AED6F1" },
  { label: "飛鳥・奈良", year: 593,  color: "#FFE6CC" },
  { label: "平安",       year: 800,  color: "#DAE8FC" },
  { label: "鎌倉時代",   year: 1185, color: "#FFF2CC" },
  { label: "南北朝・室町", year: 1333, color: "#FFE6E6" },
  { label: "戦国時代",   year: 1543, color: "#FFDAB9" },
  { label: "安土桃山",   year: 1573, color: "#E6FFE6" },
  { label: "江戸時代",   year: 1610, color: "#FFF9E6" },
  { label: "幕末・明治", year: 1850, color: "#E6F3FF" },
  { label: "昭和・現代", year: 1930, color: "#FFE6E6" },
];

// Pre-compute lane assignments (3 lanes per side)
function assignLanes(events, numLanes = 3) {
  const GAP = 6;
  const laneEnd = Array(numLanes).fill(-99999);
  return [...events]
    .sort((a, b) => a.year - b.year)
    .map(ev => {
      const cx    = yearToX(ev.year);
      const w     = ev.imp >= 3 ? 128 : 100;
      const left  = cx - w / 2;
      let lane = numLanes - 1;
      for (let l = 0; l < numLanes; l++) {
        if (laneEnd[l] <= left - GAP) { lane = l; break; }
      }
      laneEnd[lane] = left + w;
      return { ...ev, cx, w, lane };
    });
}

export const JP_EVENTS = assignLanes(NIHONSHI_EVENTS, 3);
export const WD_EVENTS = assignLanes(SEKAISHI_EVENTS, 3);
