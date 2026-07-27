import type { Block } from "@/lib/rehber";

const calloutStyles = {
  tip: {
    border: "border-emerald-400/30",
    bg: "bg-emerald-500/10",
    icon: "💡",
    label: "text-emerald-300",
  },
  warning: {
    border: "border-amber-400/30",
    bg: "bg-amber-500/10",
    icon: "⚠️",
    label: "text-amber-300",
  },
  info: {
    border: "border-cyan-400/30",
    bg: "bg-cyan-500/10",
    icon: "ℹ️",
    label: "text-cyan-300",
  },
} as const;

export default function ArticleBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="leading-relaxed text-muted">
                {block.text}
              </p>
            );

          case "h2":
            return (
              <h2
                key={i}
                id={block.id}
                className="font-display scroll-mt-24 pt-4 text-xl font-bold text-foreground sm:text-2xl"
              >
                {block.title}
              </h2>
            );

          case "h3":
            return (
              <h3
                key={i}
                className="font-display pt-1 text-lg font-semibold text-foreground"
              >
                {block.title}
              </h3>
            );

          case "ul":
            return (
              <ul key={i} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 leading-relaxed text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case "steps":
            return (
              <ol key={i} className="space-y-4">
                {block.items.map((step, j) => (
                  <li key={j} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/25 to-teal-500/25 text-sm font-bold text-cyan-300">
                      {j + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-foreground">
                        {step.title}
                      </div>
                      <p className="mt-1 leading-relaxed text-muted">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            );

          case "callout": {
            const s = calloutStyles[block.variant];
            return (
              <div
                key={i}
                className={`rounded-2xl border ${s.border} ${s.bg} p-5`}
              >
                <div className={`mb-1.5 flex items-center gap-2 font-semibold ${s.label}`}>
                  <span aria-hidden>{s.icon}</span>
                  {block.title}
                </div>
                <p className="leading-relaxed text-muted">{block.text}</p>
              </div>
            );
          }

          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-2xl border border-cyan-400/15">
                <table className="w-full min-w-[480px] text-left text-sm">
                  {block.caption && (
                    <caption className="px-4 pt-3 text-left text-xs font-medium uppercase tracking-wider text-muted">
                      {block.caption}
                    </caption>
                  )}
                  <thead>
                    <tr className="border-b border-cyan-400/15 bg-cyan-400/5">
                      {block.headers.map((h, j) => (
                        <th key={j} className="px-4 py-3 font-semibold text-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr
                        key={j}
                        className="border-b border-cyan-400/10 last:border-0"
                      >
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-3 align-top leading-relaxed text-muted">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}
