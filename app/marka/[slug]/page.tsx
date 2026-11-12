import { notFound } from "next/navigation";
import CatalogPage from "@/components/CatalogPage";
import { catalogMetadata } from "@/lib/catalog-selection";
import { type CatalogParams } from "@/lib/catalog-seo";
import { BRANDS } from "@/lib/catalog";
export const maxDuration = 60;
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<CatalogParams> };
async function selection({ params, searchParams }: Props) {
  const { slug } = await params;
  const raw = await searchParams;
  if (!(BRANDS.some(b => b.slug === slug)) || raw.marka || raw.grup || raw.kategori) notFound();
  return { ...raw, marka: slug };
}
export async function generateMetadata(props: Props) { return catalogMetadata(await selection(props)); }
export default async function Page(props: Props) { return <CatalogPage searchParams={Promise.resolve(await selection(props))} />; }
