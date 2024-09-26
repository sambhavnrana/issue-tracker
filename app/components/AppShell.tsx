"use client";
import { usePathname } from "next/navigation";
import ProtectedRoute from "./ProtectedRoute";
import React from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  let heading = "";
  if (pathname.startsWith("/dashboard")) heading = "Dashboard";
  else if (pathname.startsWith("/issues/new")) heading = "New Issue";
  else if (pathname.match(/^\/issues\/edit\//)) heading = "Edit Issue";
  else if (pathname.match(/^\/issues\/[0-9]+$/)) heading = "Issue Details";
  else if (pathname.startsWith("/issues")) heading = "Issues";
  else if (pathname.startsWith("/organizations/new")) heading = "New Organization";
  else if (pathname.match(/^\/organizations\/[a-zA-Z0-9_-]+\/projects\/new/)) heading = "New Project";
  else if (pathname.match(/^\/organizations\/[a-zA-Z0-9_-]+\/projects\/[a-zA-Z0-9_-]+/)) heading = "Project Details";
  else if (pathname.match(/^\/organizations\/[a-zA-Z0-9_-]+$/)) heading = "Organization Details";
  else if (pathname.match(/^\/organizations\/[a-zA-Z0-9_-]+\/edit/)) heading = "Edit Organization";
  else if (pathname.startsWith("/organizations")) heading = "Organizations";
  else if (pathname.startsWith("/profile")) heading = "Profile";
  if (pathname === "/") {
    return <>{children}</>;
  }
  return (
    <>
      {heading && (
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl pb-1 sm:pl-4 lg:pl-8 font-bold mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-brand-light to-pink-950 text-transparent bg-clip-text tracking-tight leading-tight pr-2">
          {heading}
        </h1>
      )}
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}