/*
  TabNav — 各タブ上部のナビゲーションリンク
  現在タブはハイライト・押せない
*/

import { Home, BookOpen, Globe, Crown, Brain, BarChart2, Scroll } from "lucide-react";

const TAB_META = [
  { id: "home",         label: "ホーム",   icon: Home,     color: "var(--color-primary)" },
  { id: "kisochishiki", label: "基礎知識", icon: BookOpen, color: "var(--color-secondary)" },
  { id: "nihonshi",     label: "日本史",   icon: Scroll,   color: "var(--color-accent)" },
  { id: "sekaishi",     label: "世界史",   icon: Globe,    color: "var(--color-highlight)" },
  { id: "temashi",      label: "テーマ史", icon: Crown,    color: "var(--color-warning)" },
  { id: "ronshutsu",    label: "論述対策", icon: Brain,    color: "#A0C4FF" },
  { id: "nigate",       label: "苦手分析", icon: BarChart2,color: "#B5EAD7" },
];

export default function TabNav({ current, onNavigate, exclude = [] }) {
  const tabs = TAB_META.filter(t => !exclude.includes(t.id));

  return (
    <div style={{
      display: "flex",
      overflowX: "auto",
      gap: 6,
      paddingBottom: 12,
      marginBottom: 16,
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon;
        const active = tab.id === current;
        return (
          <button
            key={tab.id}
            onClick={() => !active && onNavigate(tab.id)}
            disabled={active}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: 999,
              border: active ? `1.5px solid ${tab.color}` : "1.5px solid var(--color-border)",
              background: active ? tab.color + "18" : "#fff",
              color: active ? tab.color : "var(--color-text-light)",
              fontFamily: "var(--font-family)",
              fontSize: 12,
              fontWeight: active ? 700 : 500,
              cursor: active ? "default" : "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background 0.15s, border-color 0.15s",
            }}
          >
            <Icon size={13} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
