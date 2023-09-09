import "./globals.css";
import { Metadata } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import { cn } from "@/utils/utils";
import { NavBar } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";

// internationalization:
import { Locale, i18n } from "../../../i18n.config";
import { getDictionary } from "@/utils/get-dictionary";
import DictionaryProvider from "@/components/Providers/DictionaryProvider";
import ReactQueryProvider from "@/components/Providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Codex Halls",
  description: "Walk the halls of knowledge to find your way, wayfinder.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
export type LParam = { lang: Locale };

const baseFont = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains_mono",
});

// this is just the variables (not actually applying the fonts) (we apply it in the root layout)
const customFonts = [baseFont.variable, monoFont.variable].join(" ");

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: LParam;
}) {
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} className={cn(customFonts, "!scroll-smooth")}>
      <body
        className={cn(
          // layout:
          "relative flex flex-col isolate",
          // style:
          "font-base text-base",
          // colors:
          "text-white bg-zinc-900 selection:bg-white selection:text-black"
        )}
      >
        <ReactQueryProvider>
          <DictionaryProvider value={dictionary}>
            <header className="sticky top-0 flex flex-col w-full">
              <NavBar />
            </header>
            <main className="-z-10 isolate min-h-screen">{children}</main>
            <footer className="-z-20 isolate">
              <Footer />
            </footer>
          </DictionaryProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
