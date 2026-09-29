// Sitenin birkaç işlevsel çizgi ikonu (paket yüklenmiyor). Süs ikonu yok: ikon yalnız yön ve durum bildirir.

type P = { size?: number };

const svg = (size: number, children: React.ReactNode) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export const Arrow = ({ size = 15 }: P) => svg(size, <path d="M2.5 8h10.5M9.5 4l4 4-4 4" />);
export const ArrowUpRight = ({ size = 14 }: P) => svg(size, <path d="M4.5 11.5l7-7M5.5 4.5h6v6" />);
export const Chevron = ({ size = 14 }: P) => svg(size, <path d="M4 6l4 4 4-4" />);
export const Close = ({ size = 14 }: P) => svg(size, <path d="M4 4l8 8M12 4l-8 8" />);
export const Check = ({ size = 15 }: P) => svg(size, <path d="M3 8.5l3.2 3L13 4.5" />);
export const Minus = ({ size = 15 }: P) => svg(size, <path d="M4 8h8" />);
