/*
  フェーズB: 世界史 地図・交流図コンポーネント群
  対象: 東アジア古代/中世・中東・ヨーロッパ中世/近代・産業革命・世界大戦・冷戦
*/

// ============================================================
// 共通ユーティリティ
// ============================================================

function Box({ label, sub, color, bold = false, small = false }) {
  return (
    <div style={{
      background: color + (bold ? "30" : "16"),
      border: `1.5px solid ${color}${bold ? "70" : "45"}`,
      borderRadius: 8,
      padding: small ? "3px 8px" : "5px 10px",
      display: "inline-block",
      textAlign: "center",
    }}>
      <div style={{ fontSize: small ? 10 : 12, fontWeight: bold ? 700 : 600 }}>{label}</div>
      {sub && <div style={{ fontSize: 9, color: "var(--color-text-light)", fontWeight: 400, marginTop: 1, lineHeight: 1.3 }}>{sub}</div>}
    </div>
  );
}

function Arrow({ dir = "down", color = "var(--color-border)", label }) {
  const isHoriz = dir === "right" || dir === "left";
  return (
    <div style={{
      display: "flex",
      flexDirection: isHoriz ? "row" : "column",
      alignItems: "center",
      gap: 2,
      flexShrink: 0,
    }}>
      {!isHoriz && <div style={{ width: 2, height: 10, background: color, margin: "0 auto" }} />}
      {isHoriz && <div style={{ height: 2, width: 14, background: color }} />}
      <span style={{ fontSize: 11, color, lineHeight: 1 }}>
        {dir === "down" ? "▼" : dir === "up" ? "▲" : dir === "right" ? "▶" : "◀"}
      </span>
      {isHoriz && <div style={{ height: 2, width: 14, background: color }} />}
      {label && (
        <div style={{
          fontSize: 9, color: "var(--color-text-light)",
          textAlign: "center", maxWidth: 60, lineHeight: 1.3,
        }}>
          {label}
        </div>
      )}
    </div>
  );
}

function DiagramWrapper({ title, color, note, children }) {
  return (
    <div style={{
      background: color + "08",
      border: `1px solid ${color}30`,
      borderRadius: 12,
      padding: "12px 14px",
      marginTop: 4,
    }}>
      {title && (
        <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 10, letterSpacing: "0.04em" }}>
          {title}
        </div>
      )}
      {children}
      {note && (
        <div style={{
          fontSize: 10, color: "var(--color-text-light)",
          marginTop: 8, paddingTop: 6,
          borderTop: `1px solid ${color}20`,
          lineHeight: 1.6,
        }}>
          💡 {note}
        </div>
      )}
    </div>
  );
}

function RowItem({ color, region, content, year }) {
  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "flex-start",
      padding: "5px 8px",
      background: color + "12",
      border: `1px solid ${color}35`,
      borderRadius: 7,
      marginBottom: 3,
    }}>
      <div style={{
        flexShrink: 0,
        background: color + "35",
        border: `1px solid ${color}60`,
        borderRadius: 5,
        padding: "2px 6px",
        fontSize: 10, fontWeight: 700,
        minWidth: 50, textAlign: "center",
      }}>
        {region}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600 }}>{content}</div>
        {year && <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>{year}</div>}
      </div>
    </div>
  );
}

// ============================================================
// 世界史全体俯瞰: 地域×時代 並列表
// ============================================================

export function WorldParallelDiagram() {
  const columns = [
    {
      period: "古代〜中世", years: "〜12C",
      rows: [
        { region: "東アジア", color: "#FF8FAB", content: "秦・漢→三国→隋・唐" },
        { region: "中東", color: "#FFD54F", content: "イスラム教成立・拡大" },
        { region: "欧州", color: "#90CAF9", content: "ローマ帝国→封建制" },
        { region: "日本", color: "#A5D6A7", content: "律令制・摂関政治" },
      ],
    },
    {
      period: "中世〜近世", years: "12〜17C",
      rows: [
        { region: "東アジア", color: "#FF8FAB", content: "元・明・清の時代" },
        { region: "中東", color: "#FFD54F", content: "オスマン帝国の勃興" },
        { region: "欧州", color: "#90CAF9", content: "十字軍→大航海時代" },
        { region: "日本", color: "#A5D6A7", content: "鎌倉→室町→戦国" },
      ],
    },
    {
      period: "近代", years: "17〜19C",
      rows: [
        { region: "東アジア", color: "#FF8FAB", content: "清朝・アヘン戦争" },
        { region: "中東", color: "#FFD54F", content: "オスマン帝国衰退" },
        { region: "欧州", color: "#90CAF9", content: "産業革命・帝国主義" },
        { region: "日本", color: "#A5D6A7", content: "江戸末期→明治維新" },
      ],
    },
    {
      period: "現代", years: "20C〜",
      rows: [
        { region: "東アジア", color: "#FF8FAB", content: "中国革命・冷戦" },
        { region: "中東", color: "#FFD54F", content: "独立・石油・紛争" },
        { region: "欧州", color: "#90CAF9", content: "二次大戦→EU統合" },
        { region: "日本", color: "#A5D6A7", content: "敗戦→高度経済成長" },
      ],
    },
  ];

  return (
    <div style={{
      background: "#F8F9FD",
      border: "1px solid var(--color-border)",
      borderRadius: 14,
      padding: "14px",
      marginBottom: 14,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-highlight)", marginBottom: 10 }}>
        🌍 世界史 地域×時代 俯瞰マップ
      </div>
      <div style={{ overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ display: "flex", gap: 8, minWidth: 600 }}>
          {columns.map(col => (
            <div key={col.period} style={{ flex: 1, minWidth: 130 }}>
              <div style={{
                background: "var(--color-border)",
                borderRadius: 7, padding: "4px 8px",
                textAlign: "center", marginBottom: 6,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{col.period}</div>
                <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>{col.years}</div>
              </div>
              {col.rows.map(row => (
                <div key={row.region} style={{
                  background: row.color + "20",
                  border: `1px solid ${row.color}50`,
                  borderRadius: 6,
                  padding: "4px 6px",
                  marginBottom: 3,
                }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: row.color }}>{row.region}</div>
                  <div style={{ fontSize: 10, lineHeight: 1.3 }}>{row.content}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 6 }}>← スクロールで全体を確認</div>
    </div>
  );
}

// ============================================================
// 東アジア古代: 中国王朝変遷フロー
// ============================================================

export function ChinaDynastyDiagram({ color = "#FF8FAB" }) {
  const dynasties = [
    { name: "夏・殷・周", years: "前2000〜前221", key: "青銅器・甲骨文字・封建制" },
    { name: "秦", years: "前221〜前206", key: "始皇帝・中国初統一・郡県制・万里の長城" },
    { name: "前漢", years: "前202〜8", key: "武帝・儒学官学化・シルクロード開通" },
    { name: "後漢", years: "25〜220", key: "班超の西域経営・仏教伝来" },
    { name: "三国", years: "220〜280", key: "魏（北）・呉（南東）・蜀（西）" },
    { name: "晋・南北朝", years: "280〜589", key: "五胡十六国・仏教の隆盛" },
    { name: "隋", years: "589〜618", key: "中国再統一・大運河・科挙制度" },
    { name: "唐", years: "618〜907", key: "太宗・則天武后・玄宗・シルクロード最盛期" },
  ];

  return (
    <DiagramWrapper
      title="📊 中国王朝変遷フロー（古代〜唐）"
      color={color}
      note="「夏→殷→周→秦→漢→三国→隋→唐」の流れは最重要。日本の律令制・仏教・漢字はこの時代の中国から伝わった"
    >
      {dynasties.map((d, i) => (
        <div key={d.name}>
          <div style={{
            display: "flex", gap: 8, alignItems: "baseline",
            background: color + (i % 2 === 0 ? "12" : "08"),
            border: `1px solid ${color}30`,
            borderRadius: 7, padding: "5px 10px",
          }}>
            <div style={{ flexShrink: 0, minWidth: 72 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{d.name}</span>
              <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>{d.years}</div>
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.5 }}>{d.key}</div>
          </div>
          {i < dynasties.length - 1 && (
            <div style={{ display: "flex", marginLeft: 16, margin: "1px 0 1px 16px" }}>
              <div style={{ width: 2, height: 6, background: color + "40" }} />
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: 10, borderTop: `1px dashed ${color}30`, paddingTop: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>諸子百家（春秋戦国時代の思想）</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { school: "儒家", rep: "孔子・孟子", idea: "仁・礼・徳治" },
            { school: "道家", rep: "老子・荘子", idea: "無為自然" },
            { school: "法家", rep: "韓非子", idea: "法による統治" },
            { school: "墨家", rep: "墨子", idea: "兼愛・非攻" },
          ].map(s => (
            <div key={s.school} style={{
              background: color + "15", border: `1px solid ${color}40`,
              borderRadius: 7, padding: "4px 8px", fontSize: 10,
            }}>
              <span style={{ fontWeight: 700 }}>{s.school}</span>
              <span style={{ color: "var(--color-text-light)" }}>（{s.rep}）</span>
              <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>{s.idea}</div>
            </div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 東アジア中世: モンゴル帝国と朝貢体制
// ============================================================

export function MongolDiagram({ color = "#FF8FAB" }) {
  return (
    <DiagramWrapper
      title="📊 モンゴル帝国の広がりと宋元明清"
      color={color}
      note="チンギス・ハンの子孫が各地に汗国を建設。元（フビライ）は日本にも侵攻（元寇：1274・1281年）"
    >
      {/* 王朝フロー */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>宋〜清 王朝変遷</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          {[
            { name: "宋", years: "960〜", key: "文治主義\n活版印刷" },
            { name: "→" },
            { name: "元", years: "1271〜", key: "フビライ\n元寇" },
            { name: "→" },
            { name: "明", years: "1368〜", key: "洪武帝\n鄭和遠征" },
            { name: "→" },
            { name: "清", years: "1644〜", key: "満州族\n最大版図" },
          ].map((item, i) => (
            item.name === "→"
              ? <span key={i} style={{ color, fontSize: 16, fontWeight: 700 }}>→</span>
              : (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    background: color + "25", border: `1.5px solid ${color}60`,
                    borderRadius: 8, padding: "5px 10px",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>{item.years}</div>
                  </div>
                  <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 2, lineHeight: 1.3, whiteSpace: "pre-line" }}>{item.key}</div>
                </div>
              )
          ))}
        </div>
      </div>

      {/* モンゴル帝国の分裂 */}
      <div style={{ marginBottom: 10, borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>モンゴル帝国の分裂（4汗国）</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{
            background: color + "25", border: `2px solid ${color}60`,
            borderRadius: 8, padding: "6px 12px", textAlign: "center",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>チンギス・ハン（1206年 モンゴル統一）</span>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", paddingLeft: 12 }}>
            {[
              { name: "元（大汗国）", area: "中国・モンゴル", who: "フビライ" },
              { name: "チャガタイ汗国", area: "中央アジア", who: "" },
              { name: "イルハン国", area: "ペルシャ・イラン", who: "" },
              { name: "キプチャク汗国", area: "南ロシア", who: "" },
            ].map(h => (
              <div key={h.name} style={{
                background: color + "12", border: `1px solid ${color}35`,
                borderRadius: 7, padding: "4px 8px", fontSize: 10,
              }}>
                <div style={{ fontWeight: 700 }}>{h.name}</div>
                <div style={{ color: "var(--color-text-light)", fontSize: 9 }}>{h.area}{h.who && `（${h.who}）`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 朝貢体制 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>朝貢体制（冊封体制）</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <div style={{
            background: color + "25", border: `2px solid ${color}60`,
            borderRadius: 8, padding: "6px 12px", textAlign: "center",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>中国皇帝（天子）</div>
            <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>称号・返礼品を授与</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Arrow dir="right" color={color} />
            <div style={{ fontSize: 9, color: "var(--color-text-light)", textAlign: "center" }}>朝貢（貢ぎ物）</div>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {["朝鮮", "日本", "琉球", "ベトナム"].map(c => (
              <div key={c} style={{
                background: "#A5D6A720", border: "1px solid #A5D6A750",
                borderRadius: 7, padding: "4px 8px", fontSize: 11, fontWeight: 600,
              }}>{c}</div>
            ))}
          </div>
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 中東: イスラム世界の拡大図
// ============================================================

export function IslamDiagram({ color = "#FFD54F" }) {
  const expansions = [
    { from: "アラビア半島", years: "622〜632", event: "ムハンマドがイスラム教を創始（ヒジュラ622年）" },
    { from: "中東・北アフリカ", years: "632〜750", event: "正統カリフ時代・ウマイヤ朝：東はインド・西は北アフリカ・イベリア半島まで拡大" },
    { from: "アッバース朝の繁栄", years: "750〜1258", event: "バグダードを首都に「イスラムの黄金時代」。数学・天文学・医学が発展" },
    { from: "十字軍との対立", years: "1095〜1291", event: "ヨーロッパのキリスト教国が聖地奪還を目指して遠征（7回）。最終的に失敗" },
    { from: "オスマン帝国", years: "1299〜1922", event: "コンスタンティノープル征服（1453）。スレイマン1世の時に最大版図" },
  ];

  return (
    <DiagramWrapper
      title="📊 イスラム世界の拡大と文明"
      color={color}
      note="イスラム文明はギリシア・ローマの知識を保存・発展させ、のちにヨーロッパのルネサンスに影響を与えた"
    >
      {/* 拡大フロー */}
      <div style={{ marginBottom: 10 }}>
        {expansions.map((e, i) => (
          <div key={i}>
            <div style={{
              background: color + (i % 2 === 0 ? "18" : "0C"),
              border: `1px solid ${color}35`,
              borderRadius: 8, padding: "6px 10px",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}>{e.from}</span>
                <span style={{ fontSize: 9, color: "var(--color-text-light)", flexShrink: 0 }}>{e.years}</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.5 }}>{e.event}</div>
            </div>
            {i < expansions.length - 1 && (
              <div style={{ margin: "2px 0 2px 12px" }}>
                <div style={{ width: 2, height: 6, background: color + "40" }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 概念地図 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 6 }}>拡大方向（概念図）</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Box label="イベリア半島" sub="ウマイヤ朝" color={color} small />
            <Arrow dir="right" color={color} />
            <Box label="アラビア半島" sub="発祥地・622年" color={color} bold />
            <Arrow dir="right" color={color} />
            <Box label="中央アジア" sub="→インド・中国" color={color} small />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 80 }} />
            <Arrow dir="down" color={color} />
            <div style={{ width: 80 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 80 }} />
            <Box label="北アフリカ" sub="エジプト・マグリブ" color={color} />
            <div style={{ width: 80 }} />
          </div>
        </div>
      </div>

      {/* イスラム文明の成果 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>イスラム文明の主な成果</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["アラビア数字（0の概念）", "代数学（アルゲブラ）", "天文学・医学", "製紙技術の伝播", "「千夜一夜物語」"].map(s => (
            <div key={s} style={{
              fontSize: 10, padding: "2px 8px",
              background: color + "20", border: `1px solid ${color}45`,
              borderRadius: 99, fontWeight: 500,
            }}>{s}</div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// ヨーロッパ中世: 封建制度と教会権力
// ============================================================

export function FeudalEuropeDiagram({ color = "#90CAF9" }) {
  return (
    <DiagramWrapper
      title="📊 中世ヨーロッパの封建制度と教会"
      color={color}
      note="「叙任権闘争」はカノッサの屈辱（1077）で皇帝が教皇に謝罪。十字軍遠征（1095〜1291）はローマ教皇が主導した"
    >
      {/* 封建制の階層 */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 6 }}>封建制の階層構造</div>
        {[
          { label: "国王", sub: "最高権力者（形式的）", indent: 0, width: "80%" },
          { label: "諸侯（大封建領主）", sub: "広大な領地・独自の軍事力", indent: 1, width: "72%" },
          { label: "騎士", sub: "諸侯に仕える武士・小領地", indent: 2, width: "62%" },
          { label: "農奴（農民）", sub: "土地に縛られた農業従事者", indent: 3, width: "52%" },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 6,
            paddingLeft: item.indent * 14,
            marginBottom: 3,
          }}>
            {item.indent > 0 && (
              <div style={{ fontSize: 12, color: color, flexShrink: 0 }}>└</div>
            )}
            <div style={{
              background: color + (item.indent === 0 ? "35" : item.indent === 1 ? "25" : item.indent === 2 ? "18" : "10"),
              border: `1.5px solid ${color}${item.indent === 0 ? "80" : "45"}`,
              borderRadius: 8, padding: "5px 12px",
              width: item.width,
            }}>
              <span style={{ fontSize: 12, fontWeight: item.indent === 0 ? 700 : 600 }}>{item.label}</span>
              <span style={{ fontSize: 9, color: "var(--color-text-light)", marginLeft: 6 }}>{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 教皇vs皇帝 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8, marginBottom: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 6 }}>教皇 vs 皇帝（叙任権闘争）</div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{
            flex: 1, background: "#FFD54F20", border: "2px solid #FFD54F60",
            borderRadius: 10, padding: "8px 10px", textAlign: "center",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>ローマ教皇</div>
            <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 3, lineHeight: 1.4 }}>
              魂の救済・叙任権主張<br />
              グレゴリウス7世
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 14 }}>⚡</div>
            <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>対立</div>
          </div>
          <div style={{
            flex: 1, background: color + "20", border: `2px solid ${color}60`,
            borderRadius: 10, padding: "8px 10px", textAlign: "center",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>神聖ローマ皇帝</div>
            <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 3, lineHeight: 1.4 }}>
              政治的権威・叙任権主張<br />
              ハインリヒ4世
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 6, background: "#A5D6A720", border: "1px solid #A5D6A750",
          borderRadius: 8, padding: "6px 10px", textAlign: "center",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>カノッサの屈辱（1077年）</div>
          <div style={{ fontSize: 10, color: "var(--color-text-light)" }}>皇帝ハインリヒ4世が雪の中で教皇に謝罪 → 教皇権の絶頂期</div>
        </div>
      </div>

      {/* 十字軍 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>十字軍（1095〜1291）</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <Box label="ヨーロッパ（キリスト教）" color={color} />
          <Arrow dir="right" color={color} label="聖地奪還" />
          <Box label="エルサレム（イスラム）" color="#FFD54F" />
        </div>
        <div style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 6, lineHeight: 1.5 }}>
          結果：最終的に失敗 → 教皇権威の低下・イタリア商業都市の発展・ルネサンスへ
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// ヨーロッパ近代: 大航海時代・ルネサンス・宗教改革
// ============================================================

export function EuropeModernDiagram({ color = "#90CAF9" }) {
  const routes = [
    { explorer: "コロンブス（スペイン）", year: "1492", route: "スペイン → 西インド諸島（アメリカ「発見」）" },
    { explorer: "バスコ・ダ・ガマ（ポルトガル）", year: "1498", route: "ポルトガル → アフリカ南端 → インド（カリカット）" },
    { explorer: "マゼラン（スペイン）", year: "1519〜22", route: "スペイン → 南アメリカ→太平洋→アジア（世界周航）" },
    { explorer: "カブラル（ポルトガル）", year: "1500", route: "ポルトガル → ブラジル（南米）到達" },
  ];

  return (
    <DiagramWrapper
      title="📊 大航海時代・ルネサンス・宗教改革"
      color={color}
      note="大航海時代により「世界の一体化」が始まった。スペイン・ポルトガルによるトルデシリャス条約（1494）で世界を二分"
    >
      {/* 大航海 */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>大航海時代の主要航路</div>
        {routes.map((r, i) => (
          <div key={i} style={{
            background: color + (i % 2 === 0 ? "12" : "08"),
            border: `1px solid ${color}30`,
            borderRadius: 7, padding: "6px 10px", marginBottom: 3,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>{r.explorer}</span>
              <span style={{ fontSize: 9, color: "var(--color-text-light)", flexShrink: 0 }}>{r.year}</span>
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color, fontSize: 10 }}>⛵</span>
              {r.route}
            </div>
          </div>
        ))}
      </div>

      {/* ルネサンス・宗教改革 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>ルネサンス・宗教改革の流れ</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { era: "ルネサンス", years: "14〜16C", content: "イタリア発：ダヴィンチ・ミケランジェロ・ラファエロ。人間中心主義・古典文化の復興", color: "#A5D6A7" },
            { era: "宗教改革", years: "16C〜", content: "ルター（ドイツ）が九十五ヶ条の論題（1517）。カルヴァン・英国国教会。プロテスタントの誕生", color: "#FFD54F" },
            { era: "主権国家体制", years: "17C〜", content: "ウェストファリア条約（1648）：宗教戦争終結・近代主権国家システムの確立", color: color },
          ].map(item => (
            <div key={item.era} style={{
              background: item.color + "15",
              border: `1px solid ${item.color}40`,
              borderRadius: 8, padding: "7px 10px",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>{item.era}</span>
                <span style={{ fontSize: 9, color: "var(--color-text-light)" }}>{item.years}</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.5 }}>{item.content}</div>
            </div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 産業革命〜帝国主義: 産業革命の波及と植民地
// ============================================================

export function IndustrialDiagram({ color = "#B39DDB" }) {
  return (
    <DiagramWrapper
      title="📊 産業革命の波及と帝国主義"
      color={color}
      note="「太陽の沈まない帝国」英国は19世紀末に世界の1/4を支配。産業革命→資本主義→帝国主義→植民地分割の連鎖"
    >
      {/* 産業革命の波及 */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>産業革命の波及</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {[
            { country: "英国", years: "18C後半〜", key: "蒸気機関（ワット）・紡績機械・製鉄・鉄道", color: "#E53935" },
            { country: "フランス・ドイツ・ベルギー", years: "19C前半〜", key: "英国から技術を導入・工業化加速", color: "#1565C0" },
            { country: "アメリカ", years: "19C中頃〜", key: "南北戦争後に急速工業化・電力・鉄鋼・石油", color: "#2E7D32" },
            { country: "日本（明治〜）", years: "1868〜", key: "官営工場・富国強兵・殖産興業・欧米技術を導入", color: "#F57C00" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: 8, alignItems: "baseline",
              background: item.color + "12", border: `1.5px solid ${item.color}40`,
              borderRadius: 8, padding: "5px 10px",
            }}>
              <div style={{
                flexShrink: 0, minWidth: 90,
                background: item.color + "25", border: `1px solid ${item.color}50`,
                borderRadius: 5, padding: "2px 6px",
                fontSize: 10, fontWeight: 700, textAlign: "center",
              }}>
                {item.country}
                <div style={{ fontSize: 8, fontWeight: 400, color: "var(--color-text-light)" }}>{item.years}</div>
              </div>
              <div style={{ fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.4 }}>{item.key}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 帝国主義・植民地 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>帝国主義と植民地分割</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { power: "英国", colonies: "インド・オーストラリア・アフリカ各地・香港" },
            { power: "フランス", colonies: "北アフリカ（アルジェリア）・インドシナ" },
            { power: "ドイツ", colonies: "アフリカ（遅れて参入）" },
            { power: "アメリカ", colonies: "フィリピン・キューバ（米西戦争1898）" },
            { power: "日本", colonies: "台湾（1895）・朝鮮（1910）・満洲" },
          ].map(item => (
            <div key={item.power} style={{
              background: color + "12", border: `1px solid ${color}35`,
              borderRadius: 7, padding: "5px 8px", fontSize: 10,
            }}>
              <div style={{ fontWeight: 700 }}>{item.power}</div>
              <div style={{ color: "var(--color-text-light)", fontSize: 9, lineHeight: 1.3 }}>{item.colonies}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.5 }}>
          アフリカ分割：ベルリン会議（1884〜85年）でヨーロッパ列強がアフリカを分割。
          エチオピア・リベリアのみ独立維持。
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 世界大戦: 第一次・第二次大戦の構図
// ============================================================

export function WorldWarDiagram({ color = "#B39DDB" }) {
  return (
    <DiagramWrapper
      title="📊 第一次・第二次世界大戦の対立構図"
      color={color}
      note="WWIは「民族主義・帝国主義・軍国主義・同盟関係」の複合で勃発。WWIIはベルサイユ体制への反発とナチズムの台頭"
    >
      {/* WWI */}
      <div style={{ marginBottom: 10 }}>
        <div style={{
          background: color + "20", border: `1px solid ${color}50`,
          borderRadius: 8, padding: "5px 10px", marginBottom: 6, textAlign: "center",
        }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>第一次世界大戦（1914〜1918）</span>
          <span style={{ fontSize: 10, color: "var(--color-text-light)", marginLeft: 6 }}>サラエボ事件が引き金</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
          <div style={{
            flex: 1, background: "#E5393515", border: "2px solid #E5393560",
            borderRadius: 10, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", marginBottom: 4 }}>三国同盟</div>
            {["ドイツ", "オーストリア", "イタリア（後に離脱）"].map(c => (
              <div key={c} style={{ fontSize: 10, padding: "2px 0" }}>• {c}</div>
            ))}
            <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 4 }}>→ 後に「同盟国」</div>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>⚡</span>
          </div>
          <div style={{
            flex: 1, background: "#1565C015", border: "2px solid #1565C060",
            borderRadius: 10, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0D47A1", marginBottom: 4 }}>三国協商</div>
            {["英国", "フランス", "ロシア"].map(c => (
              <div key={c} style={{ fontSize: 10, padding: "2px 0" }}>• {c}</div>
            ))}
            <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 4 }}>→「連合国」（日本も参加）</div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 5, lineHeight: 1.4 }}>
          結果：同盟国の敗北 → ベルサイユ条約（1919）。ドイツへの巨額賠償・領土縮小 → WWIIの遠因
        </div>
      </div>

      {/* WWII */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{
          background: color + "20", border: `1px solid ${color}50`,
          borderRadius: 8, padding: "5px 10px", marginBottom: 6, textAlign: "center",
        }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>第二次世界大戦（1939〜1945）</span>
          <span style={{ fontSize: 10, color: "var(--color-text-light)", marginLeft: 6 }}>ドイツのポーランド侵攻</span>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
          <div style={{
            flex: 1, background: "#E5393515", border: "2px solid #E5393560",
            borderRadius: 10, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C62828", marginBottom: 4 }}>枢軸国</div>
            {["ドイツ（ナチス・ヒトラー）", "イタリア（ムッソリーニ）", "日本（軍国主義）"].map(c => (
              <div key={c} style={{ fontSize: 10, padding: "2px 0", lineHeight: 1.3 }}>• {c}</div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontSize: 16 }}>⚡</span>
          </div>
          <div style={{
            flex: 1, background: "#1565C015", border: "2px solid #1565C060",
            borderRadius: 10, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#0D47A1", marginBottom: 4 }}>連合国</div>
            {["英国（チャーチル）", "アメリカ（ルーズベルト）", "ソ連（スターリン）"].map(c => (
              <div key={c} style={{ fontSize: 10, padding: "2px 0", lineHeight: 1.3 }}>• {c}</div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 5, lineHeight: 1.4 }}>
          結果：枢軸国の敗北 → 国際連合成立（1945）・冷戦体制へ移行・日本はポツダム宣言受諾
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 冷戦: 米ソ対立構造
// ============================================================

export function ColdWarDiagram({ color = "#B39DDB" }) {
  return (
    <DiagramWrapper
      title="📊 冷戦の対立構造（1945〜1991）"
      color={color}
      note="「熱戦」（直接戦争）ではなく「冷戦」（軍拡競争・イデオロギー対立・代理戦争）の時代。ソ連崩壊（1991）で終結"
    >
      {/* 米ソ対立 */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
          <div style={{
            flex: 1, background: "#1565C015", border: "2px solid #1565C060",
            borderRadius: 10, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0D47A1", marginBottom: 6, textAlign: "center" }}>🇺🇸 アメリカ陣営</div>
            <div style={{ fontSize: 10, marginBottom: 4 }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>体制：資本主義・民主主義</div>
              <div style={{ color: "var(--color-text-light)", lineHeight: 1.4 }}>
                NATO（北大西洋条約機構）<br />
                マーシャル・プラン（欧州復興）<br />
                西欧・日本・韓国・台湾
              </div>
            </div>
          </div>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color }}>対立</div>
            <div style={{ fontSize: 18 }}>⚡</div>
            <div style={{ fontSize: 9, color: "var(--color-text-light)", textAlign: "center", maxWidth: 50 }}>
              核兵器<br />競争
            </div>
          </div>
          <div style={{
            flex: 1, background: "#E5393515", border: "2px solid #E5393560",
            borderRadius: 10, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#C62828", marginBottom: 6, textAlign: "center" }}>🇷🇺 ソ連陣営</div>
            <div style={{ fontSize: 10, marginBottom: 4 }}>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>体制：共産主義・社会主義</div>
              <div style={{ color: "var(--color-text-light)", lineHeight: 1.4 }}>
                ワルシャワ条約機構<br />
                コミンフォルム（情報局）<br />
                東欧・中国・北朝鮮
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要な代理戦争・対立 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>主要な冷戦の出来事</div>
        {[
          { year: "1947", event: "トルーマン・ドクトリン / マーシャル・プラン（封じ込め政策）" },
          { year: "1950〜53", event: "朝鮮戦争（代理戦争・休戦協定で現在も分断）" },
          { year: "1962", event: "キューバ危機（核戦争寸前・最も緊迫した冷戦の瞬間）" },
          { year: "1965〜75", event: "ベトナム戦争（米軍撤退・南ベトナム消滅）" },
          { year: "1989", event: "ベルリンの壁崩壊 → 1991年ソ連崩壊で冷戦終結" },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", gap: 8, alignItems: "baseline",
            background: color + (i % 2 === 0 ? "10" : "06"),
            border: `1px solid ${color}25`,
            borderRadius: 7, padding: "5px 10px", marginBottom: 3,
          }}>
            <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color, minWidth: 50 }}>{item.year}</span>
            <span style={{ fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.4 }}>{item.event}</span>
          </div>
        ))}
      </div>

      {/* 第三世界 */}
      <div style={{ borderTop: `1px dashed ${color}30`, paddingTop: 8, marginTop: 4 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>第三世界・非同盟運動</div>
        <div style={{ fontSize: 10, color: "var(--color-text-light)", lineHeight: 1.5 }}>
          バンドン会議（1955）：アジア・アフリカ29か国が参加。平和十原則を採択。
          米ソどちらにも属さない「第三世界」の台頭。インド（ネルー）・エジプト（ナセル）が主導。
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// section ID → diagram のマッピング
// ============================================================

const SEKAISHI_DIAGRAM_IDS = new Set([
  "eastAsia_ancient", "eastAsia_medieval",
  "middleEast",
  "europe_medieval", "europe_modern",
  "industrial", "worldWar", "coldWar",
]);

export function hasSekaishiDiagram(sectionId) {
  return SEKAISHI_DIAGRAM_IDS.has(sectionId);
}

export function SekaishiSectionDiagram({ sectionId, color }) {
  switch (sectionId) {
    case "eastAsia_ancient":
      return <ChinaDynastyDiagram color={color} />;
    case "eastAsia_medieval":
      return <MongolDiagram color={color} />;
    case "middleEast":
      return <IslamDiagram color={color} />;
    case "europe_medieval":
      return <FeudalEuropeDiagram color={color} />;
    case "europe_modern":
      return <EuropeModernDiagram color={color} />;
    case "industrial":
      return <IndustrialDiagram color={color} />;
    case "worldWar":
      return <WorldWarDiagram color={color} />;
    case "coldWar":
      return <ColdWarDiagram color={color} />;
    default:
      return null;
  }
}
