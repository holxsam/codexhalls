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
import { Header } from "@/components/Header/Header";

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

// bleedRoutes are routes where you need the page to be directly under the header (navbar)
// use case:
// - generally on every route, the page needs to start after the header (position: sticky)
// - however, on the home page, there's a hero section that needs to be DIRECTLY under the header
// - you could offset the hero section itself so that it goes up by the header height,
//   but what happens if we add a notification/alert system to our header (the header height changes)
// - therefore you'll need to keep track of the height of the header which is everything inside
//   the header (navbar, notification, announcements)
// - however, the fundamental problem is that on the homepage, you need the page to start under the
//   header (position: fixed) vs other pages where you need the page to start after the header (position: sticky)
// - bleedRoutes is the list of routes that is given to the <Header/> component
//   which informs (via a data-attribute) if we are on a route that should bleed into the header
// - we can then apply fixed or sticky based on that data-attribute
// - its an array incase there other other pages that need to bleed
const bleedRoutes = ["/"];

type RootLayoutProps = {
  children: React.ReactNode;
  params: LParam;
};

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
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
            <Header
              className="sticky data-[route-matched=true]:fixed top-0 flex flex-col w-full"
              routes={bleedRoutes}
            >
              <NavBar />
            </Header>
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
