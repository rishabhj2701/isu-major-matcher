// Minimal inline SVG icon set (stroke icons, 24px grid). No icon library needed.

const PATHS = {
  home: 'M3 11.5 12 4l9 7.5M5 10v10h14V10',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  sparkle: 'M12 3v4m0 10v4m9-9h-4M7 12H3m13.4-6.4-2.8 2.8M9.4 14.6l-2.8 2.8m0-10.8 2.8 2.8m5.2 5.2 2.8 2.8',
  chart: 'M4 20h16M7 16v-5m5 5V8m5 8v-3',
  users: 'M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m18 0v-1a4 4 0 0 0-3-3.9M14 4.1a4 4 0 0 1 0 7.8M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  grad: 'M2 9.5 12 5l10 4.5-10 4.5L2 9.5Zm4 2.5v4.5c0 1.5 3 3 6 3s6-1.5 6-3V12M22 9.5V15',
  message: 'M4 5h16v10H9l-5 4V5Z',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 18.5A2.5 2.5 0 0 1 6.5 16H20',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  back: 'M19 12H5m6 6-6-6 6-6',
  check: 'm5 12 4.5 4.5L19 7',
  shield: 'M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6l-8-3Z',
  layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  ban: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM5.6 5.6l12.8 12.8',
  play: 'M7 5v14l11-7L7 5Z',
  star: 'm12 3 2.8 5.9 6.2.8-4.5 4.4 1.1 6.3L12 17.3l-5.6 3.1 1.1-6.3L3 9.7l6.2-.8L12 3Z',
  flag: 'M5 21V4h11l-1 4 4 0v9h-8l1-4H5',
  print: 'M7 8V3h10v5M5 8h14a2 2 0 0 1 2 2v6h-4v4H7v-4H3v-6a2 2 0 0 1 2-2Z',
  copy: 'M8 8h12v12H8V8Zm-4 8V4h12',
  thumb: 'M7 11v9H3v-9h4Zm0 0 4-7a2 2 0 0 1 3.5 1.5V9h5a2 2 0 0 1 2 2.3l-1 6.5A2 2 0 0 1 18.5 20H7',
  send: 'm3 11 18-8-8 18-2-8-8-2Z',
  swap: 'M7 7h13m-4-4 4 4-4 4M17 17H4m4 4-4-4 4-4',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v5m0-9v1',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.7M20 3v5h-5',
  logout: 'M15 17l5-5-5-5M20 12H9m-4 9h6V3H5v18Z',
};

export default function Icon({ name, size = 18, className = '', title }) {
  const d = PATHS[name] ?? PATHS.info;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path d={d} />
    </svg>
  );
}
