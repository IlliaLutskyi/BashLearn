import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { shadcn } from "@clerk/ui/themes";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-geist-sans'});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "BashLearn — Learn Linux in your browser",
    template: "%s | BashLearn",
  },
  description:
    "Short Linux lessons and hands-on practice in a safe browser terminal. Learn the commands you'll actually use, with instant feedback.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", "font-sans", geist.variable, geistMono.variable)}>
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={{
            theme: shadcn,
            variables: {
              colorBorder: "var(--border)",
              borderRadius: "var(--radius)",
              fontFamily: "var(--font-sans)",
              fontFamilyButtons: "var(--font-sans)",
            },
          }}
>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}