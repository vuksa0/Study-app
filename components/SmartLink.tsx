"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

interface SmartLinkProps {
  href: string;           // destination if signed in
  className?: string;
  children: React.ReactNode;
}

/** Sends signed-in users to `href`, signed-out users to /login */
export function SmartLink({ href, className, children }: SmartLinkProps) {
  const { isSignedIn } = useAuth();
  return (
    <Link href={isSignedIn ? href : "/login"} className={className}>
      {children}
    </Link>
  );
}
