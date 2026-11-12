import { requireAdmin } from "@/lib/auth";
import OperationsForm from "../OperationsForm";
export default async function OperationsPage() {
  await requireAdmin();
  return <OperationsForm />;
}
