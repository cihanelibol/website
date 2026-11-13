import AuthShell from "@/components/AuthShell";
export const metadata = { title: "Hesap doğrulama", robots: { index: false, follow: false } };
export default function VerifyPage() { return <AuthShell initialScreen="verify" />; }
