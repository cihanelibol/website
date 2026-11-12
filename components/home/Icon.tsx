import type { SVGProps } from "react";

const paths = {
  arrow: "M4 12h16m-6-6 6 6-6 6",
  search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M3 22v-2a9 9 0 0 1 18 0v2",
  basket: "M3 9h18l-2 11H5L3 9Zm4 0 3-6m7 6-3-6M9 13v3m6-3v3",
  book: "M12 5C8 2 4 2 2 3v17c3-1 6-1 10 1 4-2 7-2 10-1V3c-2-1-6-1-10 2v16",
  grid: "M3 3h3v3H3zM10.5 3h3v3h-3zM18 3h3v3h-3zM3 10.5h3v3H3zM10.5 10.5h3v3h-3zM18 10.5h3v3h-3zM3 18h3v3H3zM10.5 18h3v3h-3zM18 18h3v3h-3z",
  package: "m12 2 10 5v10l-10 5-10-5V7l10-5ZM2 7l10 5 10-5M12 12v10M7 4.5l10 5V14",
  headset: "M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h4v-7H4Zm16 0h2v7h-4v-7h2Zm0 7v1a2 2 0 0 1-2 2h-5",
  layers: "m12 2 10 5-10 5L2 7l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  check: "m5 12 4 4L19 6",
  pin: "M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-15v5l3 2",
  star: "m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-.9 2.9-6Z",
  fish: "M4 12C8 2 17 3 22 12c-5 9-14 10-18 0Zm0 0-3-5v10l3-5ZM16 10h.01",
} as const;

export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name]} /></svg>;
}
