"use client";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./ProtectedRoute";
import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  let heading = "";
  if (pathname.startsWith("/dashboard")) heading = "Dashboard";
  else if (pathname.startsWith("/issues")) heading = "Issues";
  else if (pathname.startsWith("/organizations")) heading = "Organizations";
  else if (pathname.startsWith("/profile")) heading = "Profile";
  // Add more as needed

  if (pathname === "/") {
    return <>{children}</>;
  }
  return (
    <>
      {heading && (
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-brand-light to-pink-950 text-transparent bg-clip-text tracking-tight leading-tight pr-2">
          {heading}
        </h1>
      )}
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}