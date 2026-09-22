// go|tech⁺ yazı markası. Siteden geldiği haliyle korundu: metin tabanlı SVG, üç boy.

const RED = "#E53935";
const GREY = "#5C5C5C";
const LIGHT_GREY = "#9E9E9E";
const SUBTLE_GREY = "#B0B0B0";
const WORDMARK_FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

export function GoTechLogo({ size = 300, showTagline = true }: { size?: number; showTagline?: boolean }) {
  return (
    <svg
      width={size}
      height={showTagline ? size * 0.38 : size * 0.28}
      viewBox={showTagline ? "0 0 300 114" : "0 0 300 84"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="GoTech ERP Solutions"
    >
      <text x="20" y="68" fontFamily={WORDMARK_FONT} fontSize="54" fontWeight="600" fontStyle="italic" fill={RED}>go</text>
      <rect x="100" y="28" width="1.5" height="44" rx="0.75" fill={SUBTLE_GREY} />
      <text x="115" y="68" fontFamily={WORDMARK_FONT} fontSize="54" fontWeight="300" fill={GREY} letterSpacing="-1">tech</text>
      <g transform="translate(248, 24)">
        <line x1="0" y1="6" x2="12" y2="6" stroke={RED} strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="0" x2="6" y2="12" stroke={RED} strokeWidth="2" strokeLinecap="round" />
      </g>
      {showTagline && (
        <text x="22" y="98" fontFamily="'Segoe UI', Arial, sans-serif" fontSize="12" fontWeight="400" fill={LIGHT_GREY} letterSpacing="5">ERP SOLUTIONS</text>
      )}
    </svg>
  );
}

export function GoTechLogoHeader({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.32} viewBox="0 0 180 58" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GoTech">
      <text x="8" y="40" fontFamily={WORDMARK_FONT} fontSize="38" fontWeight="600" fontStyle="italic" fill={RED}>go</text>
      <rect x="60" y="12" width="1.5" height="34" rx="0.75" fill={SUBTLE_GREY} />
      <text x="72" y="40" fontFamily={WORDMARK_FONT} fontSize="38" fontWeight="300" fill={GREY} letterSpacing="-0.5">tech</text>
      <g transform="translate(158, 8)">
        <line x1="0" y1="5" x2="10" y2="5" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="5" y1="0" x2="5" y2="10" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function GoTechLogoWhite({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.32} viewBox="0 0 180 58" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GoTech">
      <text x="8" y="40" fontFamily={WORDMARK_FONT} fontSize="38" fontWeight="600" fontStyle="italic" fill={RED}>go</text>
      <rect x="60" y="12" width="1.5" height="34" rx="0.75" fill="rgba(255,255,255,0.4)" />
      <text x="72" y="40" fontFamily={WORDMARK_FONT} fontSize="38" fontWeight="300" fill="#FFFFFF" letterSpacing="-0.5">tech</text>
      <g transform="translate(158, 8)">
        <line x1="0" y1="5" x2="10" y2="5" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="5" y1="0" x2="5" y2="10" stroke={RED} strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function MikroLogo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src="/images/mikro-logo.png" alt="Mikro Yazılım" />;
}
