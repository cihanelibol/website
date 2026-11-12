import Image from "next/image";
import Link from "next/link";
import styles from "./CloudBrandMarquee.module.css";

const brands = [
  ["aquael", "Aquael"],
  ["boyu", "Boyu"],
  ["eheim", "Eheim"],
  ["fluval", "Fluval"],
  ["reeflowers", "Reeflowers"],
  ["seachem", "Seachem"],
  ["sera", "Sera"],
  ["sobo", "Sobo"],
  ["tetra", "Tetra"],
  ["tropical", "Tropical"],
];

export default function CloudBrandMarquee() {
  return (
    <section className={`store-container ${styles.section}`} aria-label="Markalar">
      <div className={styles.scene}>
        <div className={styles.viewport}>
          <div className={styles.track}>
            {[false, true].map((duplicate) => (
              <div className={styles.group} key={String(duplicate)} aria-hidden={duplicate || undefined}>
                {brands.map(([slug, name]) => (
                  <Link
                    key={slug}
                    href={`/marka/${slug}`}
                    className={styles.brand}
                    aria-label={`${name} ürünleri`}
                    tabIndex={duplicate ? -1 : undefined}
                    prefetch={false}
                  >
                    <Image src={`/brands/${slug}.png`} alt={name} width={120} height={44} sizes="120px" loading="eager" />
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
