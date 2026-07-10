const gridStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginTop: "0.75rem",
};

const linkStyle: React.CSSProperties = {
  border: "1px solid var(--banco-border)",
  borderRadius: 999,
  padding: "0.4rem 0.8rem",
  fontSize: "0.85rem",
  color: "var(--banco-fg)",
  textDecoration: "none",
  display: "inline-block",
};

type HubQuickLinksProps = {
  links: Array<{ href: string; label: string }>;
};

export function HubQuickLinks({ links }: HubQuickLinksProps) {
  return (
    <div style={gridStyle}>
      {links.map((link) => (
        <a key={link.href} href={link.href} style={linkStyle}>
          {link.label}
        </a>
      ))}
    </div>
  );
}
