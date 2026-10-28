import type { ReactNode } from "react";

import { AuthAside } from "@/components/auth/auth-aside";
import { WelcomeHeading } from "@/components/auth/welcome-heading";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <AuthAside />
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:py-16">
        <div className="w-full max-w-md">
          <WelcomeHeading compact className="mb-8 text-center lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
