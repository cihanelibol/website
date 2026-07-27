import fs from "fs";
import path from "path";
import Image from "next/image";

const brandNames: Record<string, string> = {
  aquael: "AquaEl",
  boyu: "Boyu",
  eheim: "Eheim",
  fluval: "Fluval",
  reeflowers: "ReeFlowers",
  seachem: "Seachem",
  sera: "Sera",
  sobo: "SOBO",
  tetra: "Tetra",
  tropical: "Tropical",
};

// public/brands klasöründeki logoları okur; soldan bulanıklıktan çıkıp sağa kayar
export default function BrandMarquee() {
  let logos: { src: string; name: string }[] = [];
  try {
    const dir = path.join(process.cwd(), "public", "brands");
    logos = fs
      .readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|webp|svg|avif)$/i.test(f))
      .sort()
      .map((f) => {
        const base = f.replace(/\.[^.]+$/, "").toLowerCase();
        return {
          src: `/brands/${f}`,
          name:
            brandNames[base] ?? base.charAt(0).toUpperCase() + base.slice(1),
        };
      });
  } catch {
    return null;
  }
  if (logos.length === 0) return null;

  return (
    <section className="relative border-y border-cyan-400/10 bg-surface/40 py-10">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted">
        Çalıştığımız Markalar
      </p>
      <div className="relative mx-auto max-w-6xl overflow-hidden px-2">
        <div className="edge-blur-left" />
        <div className="edge-blur-right" />
        <div className="edge-fade overflow-hidden">
          <div className="marquee-track-ltr items-start gap-8 pr-8 sm:gap-14 sm:pr-14">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="flex shrink-0 flex-col items-center gap-2.5 opacity-80 transition-opacity hover:opacity-100"
              >
                <div className="relative flex h-12 w-32 items-center justify-center sm:h-14 sm:w-40">
                  <Image
                    src={logo.src}
                    alt={`${logo.name} logosu`}
                    fill
                    sizes="160px"
                    className="object-contain brightness-0 invert light:invert-0"
                    unoptimized
                  />
                </div>
                <span className="text-xs font-medium tracking-[0.12em] text-muted">
                  {logo.name.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
