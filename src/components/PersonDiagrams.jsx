/*
  フェーズC-1: 人物関係図コンポーネント群
  対象: 源平争乱（鎌倉時代）・幕末〜明治維新
*/

// ============================================================
// 共通ユーティリティ
// ============================================================

function PersonCard({ name, role, note, color, isKey = false, isSmall = false }) {
  return (
    <div style={{
      background: color + (isKey ? "30" : "15"),
      border: `${isKey ? "2px" : "1px"} solid ${color}${isKey ? "70" : "40"}`,
      borderRadius: 9,
      padding: isSmall ? "4px 8px" : "6px 10px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: isSmall ? 11 : (isKey ? 13 : 12), fontWeight: isKey ? 700 : 600 }}>{name}</div>
      {role && <div style={{ fontSize: 9, color: "var(--color-text-light)", lineHeight: 1.3, marginTop: 1 }}>{role}</div>}
      {note && <div style={{ fontSize: 9, color, fontWeight: 600, marginTop: 1 }}>{note}</div>}
    </div>
  );
}

function RelLabel({ label, color = "var(--color-text-light)" }) {
  return (
    <div style={{
      fontSize: 9, color,
      textAlign: "center",
      padding: "2px 6px",
      background: "#F8F9FD",
      borderRadius: 4,
      border: "1px solid var(--color-border)",
      flexShrink: 0,
    }}>
      {label}
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

// ============================================================
// 源平争乱の人物関係図（鎌倉時代）
// ============================================================

export function GenpeiPersonDiagram({ color = "#A5D6A7" }) {
  return (
    <DiagramWrapper
      title="👥 源平争乱の人物関係図"
      color={color}
      note="壇ノ浦の戦い（1185）で平家滅亡。義経は頼朝と対立し奥州（平泉）へ逃亡・自害。北条氏が鎌倉幕府を牛耳り執権政治へ"
    >
      {/* 天皇・院 */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <PersonCard name="後白河法皇" role="院政・双方を利用" note="平家→源家と乗り換え" color="#CE93D8" isKey />
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 4 }}>
        <div style={{ width: 2, height: 10, background: "#E53935" }} />
        <div style={{ width: 2, height: 10, background: color }} />
      </div>

      {/* 平家 vs 源家 */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
        {/* 平家 */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: "#E5393515", border: "2px solid #E5393545",
            borderRadius: 10, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#C62828", marginBottom: 6 }}>⚔ 平家</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <PersonCard name="平清盛" role="太政大臣（1167）" note="平家政権の確立" color="#E53935" isKey />
              <PersonCard name="平徳子" role="清盛の娘" note="高倉天皇の中宮→安徳天皇の母" color="#E53935" isSmall />
              <PersonCard name="平宗盛" role="3代目棟梁" note="壇ノ浦で入水" color="#E53935" isSmall />
            </div>
          </div>
        </div>

        {/* 中央：対立マーク */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 4, paddingTop: 24,
          flexShrink: 0,
        }}>
          <div style={{ fontSize: 16 }}>⚡</div>
          <div style={{ fontSize: 9, color: "var(--color-text-light)", textAlign: "center" }}>対立</div>
        </div>

        {/* 源家 */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: color + "15", border: `2px solid ${color}45`,
            borderRadius: 10, padding: "8px 10px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#2E7D32", marginBottom: 6 }}>⚔ 源家</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <PersonCard name="源頼朝" role="鎌倉幕府初代将軍" note="武家政権の確立" color={color} isKey />
              <PersonCard name="北条政子" role="頼朝の妻" note="「尼将軍」・北条氏の権力基盤" color={color} isSmall />
              <PersonCard name="源義経" role="頼朝の弟・武将" note="壇ノ浦勝利→対立→自害" color="#FFA726" isSmall />
            </div>
          </div>
        </div>
      </div>

      {/* 結果 */}
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <div style={{ width: 2, height: 8, background: color + "60", margin: "0 auto" }} />
        <div style={{
          background: color + "20", border: `1.5px solid ${color}60`,
          borderRadius: 8, padding: "6px 12px", display: "inline-block", marginTop: 2,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>鎌倉幕府（1185/1192〜）</div>
          <div style={{ fontSize: 9, color: "var(--color-text-light)" }}>北条氏が執権として実権掌握 → 北条時政・義時</div>
        </div>
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 幕末〜明治維新の人物関係図
// ============================================================

export function BakumatsuPersonDiagram({ color = "#F48FB1" }) {
  const isshiPeople = [
    { name: "西郷隆盛", role: "薩摩藩・倒幕派", note: "西南戦争（1877）で死去" },
    { name: "大久保利通", role: "薩摩藩・内治優先", note: "明治政府の中核" },
    { name: "木戸孝允", role: "長州藩・桂小五郎", note: "薩長同盟締結に尽力" },
    { name: "坂本龍馬", role: "土佐藩・仲介者", note: "薩長同盟・船中八策" },
    { name: "高杉晋作", role: "長州藩・奇兵隊", note: "尊攘運動の中心" },
  ];

  const bakufuPeople = [
    { name: "徳川慶喜", role: "第15代将軍", note: "大政奉還（1867）" },
    { name: "勝海舟", role: "幕府海軍・開明派", note: "江戸無血開城で交渉" },
    { name: "井伊直弼", role: "大老", note: "安政の大獄→桜田門外の変" },
    { name: "老中阿部正弘", role: "老中・開明派", note: "ペリー来航対応" },
  ];

  return (
    <DiagramWrapper
      title="👥 幕末〜明治維新の人物関係図"
      color={color}
      note="薩長土肥連合が倒幕運動を主導。坂本龍馬が薩摩（西郷）と長州（木戸）を仲介し薩長同盟（1866）を実現"
    >
      {/* ペリー来航 */}
      <div style={{
        background: "#B39DDB20", border: "1px solid #B39DDB50",
        borderRadius: 8, padding: "5px 10px", marginBottom: 8, textAlign: "center",
      }}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>ペリー来航（1853）</span>
        <span style={{ fontSize: 10, color: "var(--color-text-light)", marginLeft: 6 }}>日米和親条約→安政五カ国条約（不平等）</span>
      </div>

      {/* 二大勢力 */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {/* 尊王攘夷 */}
        <div style={{ flex: 1, background: color + "12", border: `1.5px solid ${color}40`, borderRadius: 10, padding: "8px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 5 }}>尊王攘夷派（薩長土）</div>
          {isshiPeople.map(p => (
            <div key={p.name} style={{
              background: color + "15", border: `1px solid ${color}30`,
              borderRadius: 7, padding: "4px 8px", marginBottom: 3,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 9, color: "var(--color-text-light)", lineHeight: 1.3 }}>{p.role}　{p.note}</div>
            </div>
          ))}
        </div>

        {/* 幕府側 */}
        <div style={{ flex: 1, background: "#90CAF920", border: "1.5px solid #90CAF940", borderRadius: 10, padding: "8px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#1565C0", marginBottom: 5 }}>幕府・開国派</div>
          {bakufuPeople.map(p => (
            <div key={p.name} style={{
              background: "#90CAF915", border: "1px solid #90CAF930",
              borderRadius: 7, padding: "4px 8px", marginBottom: 3,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>{p.name}</div>
              <div style={{ fontSize: 9, color: "var(--color-text-light)", lineHeight: 1.3 }}>{p.role}　{p.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 流れ */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {[
          { year: "1866", event: "薩長同盟（坂本龍馬の仲介）→ 倒幕運動が加速" },
          { year: "1867", event: "大政奉還（慶喜）→ 王政復古の大号令" },
          { year: "1868", event: "戊辰戦争・江戸城無血開城（西郷 vs 勝海舟）" },
          { year: "1868〜", event: "明治新政府（三条実美・岩倉具視・西郷・大久保・木戸）" },
        ].map(item => (
          <div key={item.year} style={{
            display: "flex", gap: 8, alignItems: "baseline",
            background: color + "10", border: `1px solid ${color}25`,
            borderRadius: 7, padding: "4px 10px",
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color, flexShrink: 0 }}>{item.year}</span>
            <span style={{ fontSize: 10, color: "var(--color-text-light)" }}>{item.event}</span>
          </div>
        ))}
      </div>
    </DiagramWrapper>
  );
}

// ============================================================
// 明治の元勲・文明開化の人物図
// ============================================================

export function MeijiElitesDiagram({ color = "#F48FB1" }) {
  const domains = [
    {
      name: "薩摩藩（鹿児島）",
      color: "#E53935",
      people: [
        { name: "西郷隆盛", role: "征韓論→下野→西南戦争" },
        { name: "大久保利通", role: "内務卿・内治優先・1878年暗殺" },
        { name: "松方正義", role: "財政整理・デフレ政策" },
        { name: "東郷平八郎", role: "日露戦争・日本海海戦" },
      ],
    },
    {
      name: "長州藩（山口）",
      color: "#1565C0",
      people: [
        { name: "木戸孝允", role: "版籍奉還・廃藩置県に尽力" },
        { name: "伊藤博文", role: "初代内閣総理大臣・大日本帝国憲法起草" },
        { name: "山縣有朋", role: "陸軍創設・2代・9代首相" },
        { name: "井上馨", role: "外務卿・条約改正交渉" },
      ],
    },
    {
      name: "その他の逸材",
      color: "#2E7D32",
      people: [
        { name: "岩倉具視", role: "公家・岩倉使節団を率いる" },
        { name: "福沢諭吉", role: "「学問のすゝめ」・慶應義塾設立" },
        { name: "津田梅子", role: "女子英学塾（現：津田塾大）" },
        { name: "北里柴三郎", role: "破傷風血清療法・ペスト菌発見" },
      ],
    },
  ];

  return (
    <DiagramWrapper
      title="👥 明治の元勲・文明開化の人物"
      color={color}
      note="「薩長土肥」（薩摩・長州・土佐・肥前）出身者が明治政府を主導した。「藩閥政治」と呼ばれ自由民権運動の批判対象に"
    >
      {domains.map(domain => (
        <div key={domain.name} style={{ marginBottom: 8 }}>
          <div style={{
            background: domain.color + "18", border: `1px solid ${domain.color}45`,
            borderRadius: 8, padding: "4px 10px", marginBottom: 4,
            fontSize: 10, fontWeight: 700, color: domain.color,
          }}>
            {domain.name}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", paddingLeft: 8 }}>
            {domain.people.map(p => (
              <div key={p.name} style={{
                background: domain.color + "10", border: `1px solid ${domain.color}30`,
                borderRadius: 7, padding: "4px 8px",
                minWidth: 130, flex: "1 0 130px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 9, color: "var(--color-text-light)", lineHeight: 1.3 }}>{p.role}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </DiagramWrapper>
  );
}

// ============================================================
// era ID → 人物関係図 マッピング
// ============================================================

const PERSON_DIAGRAM_IDS = new Set(["kamakura", "meiji"]);

export function hasPersonDiagram(eraId) {
  return PERSON_DIAGRAM_IDS.has(eraId);
}

export function EraPersonDiagram({ eraId, color }) {
  if (eraId === "kamakura") return <GenpeiPersonDiagram color={color} />;
  if (eraId === "meiji") return (
    <>
      <BakumatsuPersonDiagram color={color} />
      <div style={{ marginTop: 8 }}>
        <MeijiElitesDiagram color={color} />
      </div>
    </>
  );
  return null;
}
