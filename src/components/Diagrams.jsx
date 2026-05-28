/*
  フェーズA: 日本史 構造・組織図コンポーネント群
  対象時代: 飛鳥・奈良・平安・鎌倉・南北朝/室町・戦国・江戸・明治
*/

// ============================================================
// 共通ユーティリティ
// ============================================================

function DNode({ label, sub, color, isRoot = false, children }) {
  return (
    <div style={{ marginBottom: 3 }}>
      <div style={{
        display: "inline-block",
        background: isRoot ? color + "35" : color + "18",
        border: `1.5px solid ${isRoot ? color + "80" : color + "45"}`,
        borderRadius: 8,
        padding: isRoot ? "7px 14px" : "4px 10px",
        fontSize: isRoot ? 13 : 11,
        fontWeight: isRoot ? 700 : 600,
        lineHeight: 1.4,
        color: "var(--color-text)",
      }}>
        {label}
        {sub && (
          <span style={{
            fontSize: 9,
            color: "var(--color-text-light)",
            fontWeight: 400,
            marginLeft: 4,
          }}>
            {sub}
          </span>
        )}
      </div>
      {children && (
        <div style={{
          marginLeft: 14,
          paddingLeft: 10,
          borderLeft: `2px dashed ${color}30`,
          marginTop: 3,
          paddingTop: 2,
        }}>
          {children}
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
        <div style={{
          fontSize: 11,
          fontWeight: 700,
          color: color,
          marginBottom: 10,
          letterSpacing: "0.04em",
        }}>
          {title}
        </div>
      )}
      {children}
      {note && (
        <div style={{
          fontSize: 10,
          color: "var(--color-text-light)",
          marginTop: 8,
          paddingTop: 6,
          borderTop: `1px solid ${color}20`,
          lineHeight: 1.6,
        }}>
          💡 {note}
        </div>
      )}
    </div>
  );
}

function GridChips({ items, color }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
      {items.map(s => (
        <div key={s} style={{
          fontSize: 10, padding: "3px 6px",
          background: color + "12", border: `1px solid ${color}30`,
          borderRadius: 5, textAlign: "center", fontWeight: 500,
        }}>
          {s}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 飛鳥時代: 聖徳太子の改革図
// ============================================================

export function AsukaDiagram({ color = "#FFAB91" }) {
  return (
    <DiagramWrapper
      title="📊 飛鳥時代の政治改革"
      color={color}
      note="聖徳太子（厩戸王）が推古天皇の摂政として実施。蘇我馬子と協力して天皇中心の国家を目指した"
    >
      <DNode label="推古天皇（女帝）" isRoot color={color}>
        <DNode label="聖徳太子（摂政）" sub="蘇我馬子と協力" color={color}>
          <DNode label="冠位十二階（603年）" sub="家柄でなく能力で官位を授与" color={color} />
          <DNode label="憲法十七条（604年）" sub="仏教・儒教に基づく政治の道徳規範" color={color} />
          <DNode label="遣隋使の派遣（607年）" sub="小野妹子を派遣・対等外交を目指す" color={color} />
        </DNode>
      </DNode>
      <div style={{ marginTop: 8, borderTop: `1px dashed ${color}30`, paddingTop: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>大化改新（645年）への流れ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {[
            { label: "蘇我入鹿暗殺", sub: "中大兄皇子・中臣鎌足" },
            { label: "→", sub: "" },
            { label: "改新の詔", sub: "公地公民・国郡制度" },
            { label: "→", sub: "" },
            { label: "律令国家へ", sub: "天智・天武天皇" },
          ].map((item, i) => (
            item.label === "→"
              ? <span key={i} style={{ color, fontSize: 14 }}>→</span>
              : (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{
                    background: color + "20", border: `1.5px solid ${color}50`,
                    borderRadius: 8, padding: "4px 8px", fontSize: 11, fontWeight: 600,
                  }}>
                    {item.label}
                  </div>
                  {item.sub && <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 1 }}>{item.sub}</div>}
                </div>
              )
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 奈良時代: 律令制の構造図（二官八省）
// ============================================================

export function RitsuryoDiagram({ color = "#CE93D8" }) {
  return (
    <DiagramWrapper
      title="📊 律令制の構造（二官八省）"
      color={color}
      note="二官＝神祇官・太政官。八省は中央行政機関。国司は中央から任期制で派遣（地方に定住不可）"
    >
      <DNode label="天皇" isRoot color={color}>
        <DNode label="神祇官" sub="祭祀・宗教を管轄（格は太政官より上位）" color={color} />
        <DNode label="太政官" sub="行政の最高機関" color={color}>
          <DNode label="左大臣・右大臣・大納言" color={color} />
          <DNode label="八省（中央行政）" color={color}>
            <GridChips
              color={color}
              items={["中務省", "式部省", "治部省", "民部省", "兵部省", "刑部省", "大蔵省", "宮内省"]}
            />
          </DNode>
        </DNode>
      </DNode>
      <div style={{ marginTop: 8, borderTop: `1px dashed ${color}30`, paddingTop: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>地方制度</div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 4, flexWrap: "wrap" }}>
          {[
            { label: "国", sub: "国司（中央派遣・任期制）" },
            { label: "郡", sub: "郡司（地方豪族・世襲）" },
            { label: "里", sub: "50戸で構成" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color, fontSize: 14, marginTop: -8 }}>→</span>}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  background: color + "20", border: `1.5px solid ${color}50`,
                  borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700,
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 2, maxWidth: 70 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 平安時代: 摂関政治の構造図
// ============================================================

export function SekkanDiagram({ color = "#90CAF9" }) {
  return (
    <DiagramWrapper
      title="📊 摂関政治の構造"
      color={color}
      note="「この世をば わが世とぞ思ふ 望月の 欠けたることも なしと思へば」（藤原道長）。全盛期は道長・頼通の時代（11世紀）"
    >
      <DNode label="天皇（幼少・形式的）" isRoot color={color}>
        <div style={{
          background: color + "25", border: `2px solid ${color}70`,
          borderRadius: 8, padding: "8px 12px", marginBottom: 4, display: "inline-block",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700 }}>摂政 / 関白（実権掌握）</div>
          <div style={{ fontSize: 10, color: "var(--color-text-light)" }}>天皇幼少時→摂政　成人後→関白</div>
          <div style={{
            marginTop: 4, display: "inline-block",
            background: "#F4A46030", border: "1px solid #F4A46060",
            borderRadius: 5, padding: "2px 8px", fontSize: 10, fontWeight: 700, color: "#A0522D",
          }}>
            藤原北家（道長・頼通）
          </div>
        </div>
        <div style={{ marginLeft: 14, paddingLeft: 10, borderLeft: `2px dashed ${color}30`, marginTop: 3 }}>
          <DNode label="太政官" sub="形骸化・実質的機能低下" color={color} />
          <DNode label="受領（国司）" sub="地方の実権・税収を藤原氏に納める" color={color} />
          <DNode label="荘園" sub="藤原氏の経済基盤・不輸不入の権" color={color} />
        </div>
      </DNode>
      <div style={{ marginTop: 8, borderTop: `1px dashed ${color}30`, paddingTop: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>摂関家の系譜（主要）</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[
            { name: "藤原良房", role: "初の摂政（866）" },
            { name: "藤原基経", role: "初の関白（887）" },
            { name: "藤原道長", role: "「望月の歌」（1018）" },
            { name: "藤原頼通", role: "平等院鳳凰堂建立" },
          ].map(p => (
            <div key={p.name} style={{
              background: color + "15", border: `1px solid ${color}40`,
              borderRadius: 7, padding: "4px 8px", fontSize: 10,
            }}>
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              <span style={{ color: "var(--color-text-light)", marginLeft: 4 }}>{p.role}</span>
            </div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 鎌倉時代: 鎌倉幕府の構造図
// ============================================================

export function KamakuraDiagram({ color = "#A5D6A7" }) {
  return (
    <DiagramWrapper
      title="📊 鎌倉幕府の構造"
      color={color}
      note="承久の乱（1221）後、六波羅探題を設置。執権北条氏が次第に実権を掌握し、将軍は傀儡化"
    >
      <DNode label="将軍" sub="源氏→摂家将軍→親王将軍（傀儡化）" isRoot color={color}>
        <DNode label="執権" sub="北条氏が世襲・実質的支配者" color={color}>
          <DNode label="侍所" sub="御家人の統括・軍事警察" color={color} />
          <DNode label="政所" sub="一般政務・財政" color={color} />
          <DNode label="問注所" sub="訴訟・裁判" color={color} />
          <DNode label="評定衆" sub="重要政務の合議制（1225年設置）" color={color} />
        </DNode>
      </DNode>
      <div style={{ marginTop: 8, borderTop: `1px dashed ${color}30`, paddingTop: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 5 }}>地方機関</div>
        {[
          { label: "六波羅探題", sub: "京都・西国の監視（承久の乱後・1221年設置）" },
          { label: "守護", sub: "国ごとに設置・軍事・警察・大犯三ヶ条" },
          { label: "地頭", sub: "荘園・公領ごとに設置・土地管理・年貢徴収" },
        ].map(item => (
          <div key={item.label} style={{
            display: "flex", gap: 8, alignItems: "baseline",
            background: color + "10", border: `1px solid ${color}30`,
            borderRadius: 7, padding: "5px 10px", marginBottom: 4,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, flexShrink: 0, color }}>{item.label}</span>
            <span style={{ fontSize: 10, color: "var(--color-text-light)" }}>{item.sub}</span>
          </div>
        ))}
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 南北朝〜室町時代: 室町幕府の構造図
// ============================================================

export function MuromachiDiagram({ color = "#B39DDB" }) {
  return (
    <DiagramWrapper
      title="📊 室町幕府の構造"
      color={color}
      note="管領は三管領（細川・斯波・畠山）が交代就任。侍所頭人は四職（山名・一色・京極・赤松）が担当"
    >
      <DNode label="将軍（足利氏）" isRoot color={color}>
        <DNode label="管領" sub="将軍補佐・三管領が交代（細川・斯波・畠山）" color={color}>
          <DNode label="侍所" sub="京都の警察・四職が頭人" color={color} />
          <DNode label="政所" sub="財政・一般政務" color={color} />
          <DNode label="問注所" sub="文書管理・記録" color={color} />
        </DNode>
        <DNode label="鎌倉府" sub="関東10か国統治・鎌倉公方（足利氏）" color={color} />
        <DNode label="守護大名" sub="各地の実力者・守護領国制の確立" color={color} />
      </DNode>
      <div style={{ marginTop: 8, borderTop: `1px dashed ${color}30`, paddingTop: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>幕府の弱体化の流れ</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          {[
            { label: "観応の擾乱", sub: "1350〜" },
            { label: "応仁の乱", sub: "1467〜" },
            { label: "戦国時代へ", sub: "守護大名の没落" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color, fontSize: 14 }}>→</span>}
              <div style={{ textAlign: "center" }}>
                <div style={{
                  background: color + "20", border: `1.5px solid ${color}50`,
                  borderRadius: 8, padding: "3px 8px", fontSize: 11, fontWeight: 600,
                }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 1 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 戦国〜安土桃山: 三英傑 天下統一フロー
// ============================================================

export function SengokuDiagram({ color = "#EF9A9A" }) {
  const heroes = [
    {
      name: "織田信長",
      years: "1560〜1582",
      color: "#E53935",
      achievements: ["桶狭間の戦い（1560）", "室町幕府滅亡（1573）", "楽市楽座・鉄砲活用", "本能寺の変（1582）"],
    },
    {
      name: "豊臣秀吉",
      years: "1582〜1598",
      color: "#F57C00",
      achievements: ["太閤検地（1582〜）", "刀狩令（1588）", "兵農分離の確立", "朝鮮出兵（1592・97）"],
    },
    {
      name: "徳川家康",
      years: "1600〜1615",
      color: "#1565C0",
      achievements: ["関ヶ原の戦い（1600）", "江戸幕府開府（1603）", "大坂の陣（1614・15）", "幕藩体制の確立"],
    },
  ];

  return (
    <DiagramWrapper
      title="📊 三英傑 天下統一の流れ"
      color={color}
      note="「鳴かぬなら ―」の俳句が3者の性格を表す（信長:殺してしまえ / 秀吉:鳴かせてみせよう / 家康:鳴くまで待とう）"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {heroes.map((h, i) => (
          <div key={h.name}>
            {i > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 6, marginLeft: 8 }}>
                <div style={{ width: 20, height: 2, background: "var(--color-border)" }} />
                <span style={{ fontSize: 10, color: "var(--color-text-light)" }}>
                  {i === 1 ? "本能寺の変→秀吉が後継" : "秀吉死後→家康が実権"}
                </span>
              </div>
            )}
            <div style={{
              border: `2px solid ${h.color}60`,
              borderRadius: 10,
              overflow: "hidden",
            }}>
              <div style={{
                background: h.color + "25", padding: "6px 12px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{h.name}</span>
                <span style={{ fontSize: 10, color: "var(--color-text-light)" }}>{h.years}</span>
              </div>
              <div style={{ padding: "6px 12px", background: "#fff" }}>
                {h.achievements.map(a => (
                  <div key={a} style={{
                    fontSize: 11, padding: "2px 0",
                    borderBottom: "1px dotted var(--color-border)",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <span style={{ color: h.color, fontSize: 10 }}>▶</span>
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 江戸時代: 江戸幕藩体制図
// ============================================================

export function EdoDiagram({ color = "#80DEEA" }) {
  return (
    <DiagramWrapper
      title="📊 江戸幕藩体制の構造"
      color={color}
      note="武家諸法度・参勤交代で大名を統制。三都（江戸・大坂・京都）は天領として直轄管理。身分制度（士農工商）で社会を固定化"
    >
      <DNode label="将軍（徳川氏・世襲）" isRoot color={color}>
        <DNode label="老中" sub="政務の最高機関（4〜5名・譜代大名）" color={color}>
          <DNode label="若年寄" sub="旗本・御家人の管理" color={color} />
          <DNode label="三奉行" color={color}>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["寺社奉行", "町奉行", "勘定奉行"].map(s => (
                <div key={s} style={{
                  fontSize: 10, padding: "2px 8px",
                  background: color + "18", border: `1px solid ${color}40`,
                  borderRadius: 5, fontWeight: 600,
                }}>
                  {s}
                </div>
              ))}
            </div>
          </DNode>
        </DNode>
        <DNode label="大目付" sub="大名の監察" color={color} />
        <DNode label="大名（約260藩）" color={color}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 2 }}>
            {[
              { label: "親藩", sub: "徳川一門", c: "#E53935" },
              { label: "譜代", sub: "古参の家臣", c: "#1565C0" },
              { label: "外様", sub: "関ヶ原以降", c: "#2E7D32" },
            ].map(item => (
              <div key={item.label} style={{
                textAlign: "center",
                background: item.c + "15", border: `1.5px solid ${item.c}50`,
                borderRadius: 8, padding: "4px 10px",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{item.label}</div>
                <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </DNode>
      </DNode>
      <div style={{ marginTop: 8, borderTop: `1px dashed ${color}30`, paddingTop: 6 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-light)", marginBottom: 4 }}>大名統制の手段</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {["武家諸法度", "参勤交代", "改易・転封", "大目付の監視"].map(s => (
            <div key={s} style={{
              fontSize: 10, padding: "2px 8px",
              background: color + "20", border: `1px solid ${color}50`,
              borderRadius: 99, fontWeight: 600,
            }}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 明治時代: 明治政府の構造図
// ============================================================

export function MeijiGovDiagram({ color = "#F48FB1" }) {
  return (
    <DiagramWrapper
      title="📊 明治政府の構造"
      color={color}
      note="1885年内閣制度（初代総理：伊藤博文）、1889年大日本帝国憲法発布、1890年帝国議会開会。主権は天皇に集中"
    >
      <DNode label="天皇" sub="大日本帝国憲法（1889）・統治権の総覧者" isRoot color={color}>
        <DNode label="太政官制（1868〜1885）" sub="廃止→内閣制度へ移行" color={color} />
        <DNode label="内閣（1885年〜）" sub="初代総理：伊藤博文" color={color}>
          <DNode label="各省（初期の主要省）" color={color}>
            <GridChips
              color={color}
              items={["外務省", "内務省", "大蔵省", "陸軍省", "海軍省", "司法省", "文部省", "農商務省"]}
            />
          </DNode>
        </DNode>
        <DNode label="帝国議会（1890年〜）" color={color}>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "貴族院", sub: "皇族・華族・勅選議員" },
              { label: "衆議院", sub: "選挙（制限選挙）" },
            ].map(s => (
              <div key={s.label} style={{
                background: color + "20", border: `1.5px solid ${color}50`,
                borderRadius: 8, padding: "5px 10px", textAlign: "center",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 9, color: "var(--color-text-light)", marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </DNode>
        <DNode label="枢密院" sub="憲法・重要事項の審議・天皇の顧問機関" color={color} />
        <DNode label="陸軍・海軍参謀本部" sub="天皇直属（統帥権）・内閣から独立" color={color} />
      </DNode>
    </DiagramWrapper>
  );
}

// ============================================================
// 全体俯瞰: 日本史 権力変遷フロー
// ============================================================

export function PowerFlowDiagram() {
  const stages = [
    { period: "原始", years: "〜3C", label: "縄文・弥生", desc: "農耕の始まり・クニの形成", color: "#A5D6A7" },
    { period: "古代", years: "3〜12C", label: "天皇・律令制", desc: "中央集権化・摂関政治", color: "#90CAF9" },
    { period: "中世", years: "12〜16C", label: "武家政権", desc: "鎌倉幕府→室町幕府", color: "#B39DDB" },
    { period: "近世", years: "16〜19C", label: "江戸幕藩体制", desc: "天下統一・鎖国・参勤交代", color: "#80DEEA" },
    { period: "近代", years: "1868〜1945", label: "明治〜昭和", desc: "近代国家・帝国主義・敗戦", color: "#F48FB1" },
    { period: "現代", years: "1945〜", label: "民主主義国家", desc: "日本国憲法・高度経済成長", color: "#FFD54F" },
  ];

  const transitions = ["国家形成", "武士の台頭", "天下統一", "明治維新", "戦後改革"];

  return (
    <div style={{
      background: "#F8F9FD",
      border: "1px solid var(--color-border)",
      borderRadius: 14,
      padding: "14px",
      marginBottom: 14,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--color-primary)", marginBottom: 10 }}>
        📜 日本史 権力変遷フロー（全体俯瞰）
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {stages.map((s, i) => (
          <div key={i}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                flexShrink: 0, width: 44, textAlign: "center",
                background: s.color + "30", border: `1.5px solid ${s.color}70`,
                borderRadius: 8, padding: "4px 2px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{s.period}</div>
                <div style={{ fontSize: 8, color: "var(--color-text-light)", lineHeight: 1.2 }}>{s.years}</div>
              </div>
              <div style={{ paddingTop: 3 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "var(--color-text-light)", marginTop: 1, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            </div>
            {i < stages.length - 1 && (
              <div style={{ marginLeft: 14, marginTop: 2, marginBottom: 2, display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 2, height: 10, background: "var(--color-border)", marginLeft: 21 }} />
                <span style={{ fontSize: 9, color: "var(--color-text-light)", marginLeft: 5 }}>
                  ▼ {transitions[i]}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// era ID → diagram のマッピング
// ============================================================

const DIAGRAM_ERA_IDS = new Set(["asuka", "nara", "heian", "kamakura", "nanbokucho", "muromachi", "sengoku", "azuchimomoyama", "edo", "meiji"]);

export function hasDiagram(eraId) {
  return DIAGRAM_ERA_IDS.has(eraId);
}

export function EraDiagram({ eraId, color }) {
  switch (eraId) {
    case "asuka":
      return <AsukaDiagram color={color} />;
    case "nara":
      return <RitsuryoDiagram color={color} />;
    case "heian":
      return <SekkanDiagram color={color} />;
    case "kamakura":
      return <KamakuraDiagram color={color} />;
    case "nanbokucho":
    case "muromachi":
      return <MuromachiDiagram color={color} />;
    case "sengoku":
    case "azuchimomoyama":
      return <SengokuDiagram color={color} />;
    case "edo":
      return <EdoDiagram color={color} />;
    case "meiji":
      return <MeijiGovDiagram color={color} />;
    default:
      return null;
  }
}
