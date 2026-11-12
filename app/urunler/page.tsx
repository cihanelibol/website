import { notFound, permanentRedirect } from "next/navigation";
import CatalogPage from "@/components/CatalogPage";
import { catalogMetadata } from "@/lib/catalog-selection";
import { catalogUrl, parseCatalogParams, type CatalogParams } from "@/lib/catalog-seo";

export const maxDuration = 60;
type Props = { searchParams: Promise<CatalogParams> };
export async function generateMetadata({ searchParams }: Props) {
  return catalogMetadata(await searchParams);
}
export default async function Page({ searchParams }: Props) {
  const raw = await searchParams;
  const filters = parseCatalogParams(raw);
  if (!filters) notFound();
  const url = catalogUrl(filters);
  if (!url.startsWith("/urunler")) permanentRedirect(url);
  return <CatalogPage searchParams={Promise.resolve(raw)} />;
}
