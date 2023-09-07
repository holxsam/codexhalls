import {
  IconBrandInstagram,
  IconBrandFacebook,
  IconPhoneOutgoing,
  IconMail,
  IconMap,
  IconMapPinFilled,
} from "@tabler/icons-react";
import { ReactNode } from "react";
import { Logo } from "../Logo/Logo";
import { getDictionary } from "../../utils/get-dictionary";
import Link, { LinkProps } from "next/link";

type SocialsInfo = {
  name: string;
  link: string;
  icon: any;
};

const SOCIALS: SocialsInfo[] = [
  {
    name: "instagram",
    link: "https://www.instagram.com/karate_mari/?igshid=YmMyMTA2M2Y%3D",
    icon: (
      <IconBrandInstagram className="hover:text-fuchsia-600"></IconBrandInstagram>
    ),
  },
];

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
      className="w-full bg-black/50 scroll-mt-24 min-h-[20rem] py-[4rem]"
    >
      <section className="pack-content w-full gap-16 flex flex-col sm:flex-row">
        <Logo />
        <nav className=" flex gap-16 flex-wrap">
          <section className="flex flex-col gap-4">
            <H>Overview</H>
            <ul className="flex flex-col gap-2">
              <L linkProps={{ href: "#" }}>About Us</L>
              <L linkProps={{ href: "#" }}>Tech Stack</L>
              <L linkProps={{ href: "#" }}>Changelog</L>
            </ul>
          </section>
          <section className="flex flex-col gap-4">
            <H>Community</H>
            <ul className="flex flex-col gap-2">
              <L linkProps={{ href: "#" }}>Our Discord</L>
              <L linkProps={{ href: "#" }}>Contribute</L>
              <L linkProps={{ href: "#" }}>Wayfinder Reddit</L>
              <L linkProps={{ href: "#" }}>Wayfinder Discord</L>
            </ul>
          </section>
          <section className="flex flex-col gap-4">
            <H>Contact</H>
            <ul className="flex flex-col gap-2">
              <L linkProps={{ href: "#" }}>Email</L>
              <L linkProps={{ href: "#" }}>Discord</L>
            </ul>
          </section>
          <section className="flex flex-col gap-4">
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
