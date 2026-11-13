import Navbar from "./Navbar";
import Footer from "./Footer";
import AquariumScene from "./AquariumScene";
import AuthPanel, { type AuthScreen } from "./AuthPanel";
import GoogleButton from "./GoogleButton";
import { googleConfigured } from "@/lib/auth";
import styles from "./AuthShell.module.css";
import localFont from "next/font/local";

const aquariumFont = localFont({
  src: "../public/fonts/manrope-variable.ttf",
  variable: "--font-aquarium",
  weight: "200 800",
  display: "swap",
});

export default function AuthShell({ initialScreen = "login", error }: { initialScreen?: AuthScreen; error?: string }) {
  return (
    <>
      <Navbar seamless />
      <main id="main-content" className={`${styles.shell} ${aquariumFont.variable}`} data-aquarium="interactive">
        <AquariumScene />
        <section className={styles.formPane} aria-labelledby="auth-heading">
          <div className={styles.formContent} data-aquarium-obstacle="form">
            <AuthPanel initialScreen={initialScreen} error={error} googleButton={googleConfigured() ? <GoogleButton /> : null} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
