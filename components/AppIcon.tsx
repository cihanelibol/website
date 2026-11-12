import type { SVGProps } from "react";

const paths: Record<string, string> = {
  basket: "M3 9h18l-2 11H5L3 9Z M8 9l3-6 M16 9l-3-6 M9 13v3 M15 13v3",
  search: "m21 21-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  check: "m5 12 4 4L19 6",
  "circle-check": "M22 11v1a10 10 0 1 1-6-9 M22 4 12 14l-3-3",
  warning: "m12 3 10 18H2L12 3 M12 9v4 M12 17h.01",
  info: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 11v6 M12 7h.01",
  close: "m6 6 12 12 M6 18 18 6",
  plus: "M12 5v14 M5 12h14",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3",
  cart: "M2 3h3l3 13h11l3-9H6 M10 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2 M18 21a1 1 0 1 1 0-2 1 1 0 0 1 0 2",
  package: "m12 3 9 5v9l-9 5-9-5V8l9-5 M3 8l9 5 9-5 M12 13v9 M7.5 5.5l9 5",
  truck: "M3 5h11v12H3V5 M14 9h4l3 4v4h-7 M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M19 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M4 21v-2a8 8 0 0 1 16 0v2",
  users: "M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M2 21v-2a8 8 0 0 1 16 0v2 M18 3a4 4 0 0 1 0 8 M22 21v-2a8 8 0 0 0-4-7",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0 M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  phone: "M22 16v3a2 2 0 0 1-2 2C10 21 3 14 3 4a2 2 0 0 1 2-2h3l2 5-3 2a16 16 0 0 0 8 8l2-3 5 2",
  message: "M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4 M8 10h8 M8 14h5",
  mail: "M3 5h18v14H3V5 M3 5l9 7 9-7",
  clock: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2",
  lock: "M5 10h14v11H5V10 M8 10V6a4 4 0 0 1 8 0v4 M12 14v3",
  key: "M14 8a6 6 0 1 1-6-6 6 6 0 0 1 6 6 M12 12l9 9 M17 17l3-3 M19 19l3-3",
  logout: "M9 3H3v18h6 M8 12h13 M16 7l5 5-5 5",
  file: "M14 2H4v20h16V8l-6-6 M14 2v6h6 M8 12h8 M8 16h8",
  book: "M12 5C8 2 4 2 2 3v17c3-1 6-1 10 1 4-2 7-2 10-1V3c-2-1-6-1-10 2v16",
  trash: "M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7",
  eye: "M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  shield: "m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4 M8 12l3 3 5-6",
  settings: "M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  filter: "M4 7h16 M4 17h16 M9 4v6 M15 14v6",
  light: "M9 18v-2a7 7 0 1 1 6 0v2H9 M9 22h6",
  leaf: "M20 3C8 2 2 8 5 16c8 5 16-1 15-13 M3 21 15 9",
  fish: "M3 12s4-7 9-7 8 7 8 7-3 7-8 7-9-7-9-7 M18 9l4-4v14l-4-4 M7 10h.01 M10 5l3-3 2 4",
  tank: "M3 4h18v16H3V4 M3 9c3-3 6 3 9 0s6 3 9 0 M7 17v-4 M17 17v-3",
  food: "M5 4h14l-1 17H6L5 4 M5 8h14 M9 13h6 M10 17h4",
  paw: "M8 14c-5 7 1 8 4 6 3 2 9 1 4-6-2-3-6-3-8 0 M7 7a2 3 0 1 1-4 0 2 3 0 0 1 4 0 M13 5a2 3 0 1 1-4 0 2 3 0 0 1 4 0 M19 7a2 3 0 1 1-4 0 2 3 0 0 1 4 0 M23 12a2 3 0 1 1-4 0 2 3 0 0 1 4 0",
  wind: "M3 8h12a3 3 0 1 0-3-3 M2 12h17a3 3 0 1 1-3 3 M4 16h5a3 3 0 1 1-3 3",
  coral: "M12 22V3 M12 10l-5-3V3 M12 15l6-3V6 M7 7 3 8V5 M18 10l4-2V4 M12 19l-7-3v-4",
  flask: "M9 3h6 M10 3v6L3 21h18L14 9V3 M7 15h10",
  drop: "M12 2S4 11 4 15a8 8 0 1 0 16 0c0-4-8-13-8-13",
  thermometer: "M9 14V5a3 3 0 0 1 6 0v9a5 5 0 1 1-6 0 M12 7v10",
  tools: "M14 3a6 6 0 0 0-7 8l-5 7 4 4 7-6a6 6 0 0 0 8-8l-4 4-5-5 4-4Z",
  bucket: "M4 8h16l-2 13H6L4 8 M7 8V6a5 5 0 0 1 10 0v2",
};

type AppIconProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
  name: string;
  size?: number | string;
};

/** Decorative SVGs inherit text color and size; controls keep their own accessible label. */
export default function AppIcon({ name, size = "1em", className = "", ...props }: AppIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`app-icon ${className}`}
      {...props}
    >
      <path d={Object.hasOwn(paths, name) ? paths[name] : paths.package} />
    </svg>
  );
}
