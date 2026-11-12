import AccountRecovery from "@/components/AccountRecovery";
export const metadata = { title: "Hesap doğrulama", robots: { index: false, follow: false } };
export default function VerifyPage() { return <main id="main-content" className="store-container"><AccountRecovery consume /></main>; }
