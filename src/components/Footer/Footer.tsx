import { ReactNode } from "react";
import { LogoWithText } from "../Logo/Logo";
import Link, { LinkProps } from "next/link";

const H = ({ children }: { children: ReactNode }) => {
  return <h4 className="font-medium">{children}</h4>;
};

const L = ({
  children,
  linkProps,
}: {
  children: ReactNode;
  linkProps: LinkProps;
}) => {
  return (
    <li>
      <Link {...linkProps} className="text-zinc-500 hover:underline">
        {children}
      </Link>
    </li>
  );
};

export const Footer = () => {
  return (
    <div
      id="footer"
      className="w-full backdrop-blur-xl scroll-mt-24 py-[5rem] border-t border-white/[8%] bg-[#0C0C0D]/80"
    >
      <section className="pack-content w-full gap-16 sm:gap-28 flex flex-col sm:flex-row">
        <section className="flex flex-col gap-1">
          <LogoWithText />
          <span className="flex items-center gap-1 text-zinc-500">
            <span className="text-lg">{"(c)"}</span>
            <span className="text-sm">2023</span>
          </span>
        </section>
        <nav className="flex gap-[inherit] flex-wrap text-sm">
          <section className="flex flex-col gap-4 w-full sm:w-auto">
            <H>Overview</H>
            <ul className="flex flex-col gap-2">
              <L linkProps={{ href: "#" }}>About Us</L>
              <L linkProps={{ href: "#" }}>Tech Stack</L>
              <L linkProps={{ href: "#" }}>Changelog</L>
            </ul>
          </section>
          <section className="flex flex-col gap-4 w-full sm:w-auto">
            <H>Community</H>
            <ul className="flex flex-col gap-2">
              <L linkProps={{ href: "#" }}>Our Discord</L>
              <L linkProps={{ href: "#" }}>Contribute</L>
              <L linkProps={{ href: "#" }}>Wayfinder Reddit</L>
              <L linkProps={{ href: "#" }}>Wayfinder Discord</L>
            </ul>
          </section>
          <section className="flex flex-col gap-4 w-full sm:w-auto">
            <H>Contact</H>
            <ul className="flex flex-col gap-2">
              <L linkProps={{ href: "#" }}>Email</L>
              <L linkProps={{ href: "#" }}>Discord</L>
            </ul>
          </section>
          <section className="flex flex-col gap-4 w-full sm:w-auto">
            <H>Legal</H>
            <ul className="flex flex-col gap-2">
              <L linkProps={{ href: "#" }}>Privacy Policy</L>
              <L linkProps={{ href: "#" }}>Cookie Preferences</L>
              <L linkProps={{ href: "#" }}>Terms of Service</L>
            </ul>
          </section>
        </nav>
      </section>
    </div>
  );
};
