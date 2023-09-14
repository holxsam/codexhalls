import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.emerald,
      },
      fontFamily: {
        base: ["var(--font-manrope)"],
        mono: ["var(--font-jetbrains_mono)"],
      },
      boxShadow: {
        center: "0 0 24px 0 rgba(0,0,0, 0.05)",
        "center-lg": "0 0 24px 0 rgba(0,0,0, 0.1)",
        avatar: "0 0 15px 0 rgba(0,0,0, 0.50)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-in-out": {
          "0%": { opacity: "0" },
          "20%, 70%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "bg-pos-x": {
          "0%": {
            "background-size": "400% 400%",
            "background-position": "0% 0%",
          },
          "100%": {
            "background-size": "400% 400%",
            "background-position": "80% 0%",
          },
        },
        // this is tailwind's bounce keyframe but done at the origin:
        "bounce-origin": {
          "0%, 100%": {
            transform: "translateY(0%)",
            "animation-timing-function": " cubic-bezier(0,0,0.2,1)",
          },
          "50%": {
            transform: "translateY(-35%)",
            "animation-timing-function": "cubic-bezier(0.8,0,1,1)",
          },
        },
        "bounce-origin-right": {
          "0%, 100%": {
            transform: "translateX(0%)",
            "animation-timing-function": " cubic-bezier(0,0,0.2,1)",
          },
          "50%": {
            transform: "translateX(25%)",
            "animation-timing-function": "cubic-bezier(0.8,0,1,1)",
          },
        },
      },
      animation: {
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "fade-in-out":
          "fade-in-out 0.5s cubic-bezier(.13,.74,.84,.43) 1 forwards",
        "gradient-x": "gradient-x 5s linear infinite",
        "gradient-y": "gradient-y 5s linear infinite",
        "gradient-xy": "gradient-xy 5s linear infinite",
        "bg-pos-x": "bg-pos-x 200s linear infinite",
        "bounce-origin": "bounce-origin 1s infinite",
        "bounce-origin-right": "bounce-origin-right 1s infinite",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".pack-content": {
          "@apply mx-auto max-w-5xl px-4 w-full": {},
        },
        ".custom-scrollbar-tiny": {
          "@apply scrollbar-thin scrollbar-thumb-zinc-600/50 hover:scrollbar-track-zinc-800/20 hover:scrollbar-thumb-zinc-500":
            {},
        },
        ".scrollbar-tiny-white": {
          "@apply scrollbar-thin scrollbar-thumb-white/80 scrollbar-track-zinc-800/30 hover:scrollbar-thumb-white":
            {},
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".h-screen-dvh": {
          // this class handles the 100vh on mobile address bar issue
          height: [
            "100vh", // fallback if dvh is not supported
            "100dvh", // this solves the issue
          ],
        },
      });
    }),
  ],
};
export default config;
