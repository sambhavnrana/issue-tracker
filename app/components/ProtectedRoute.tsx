"use client";
import { useSession } from "next-auth/react";
import LoginModal from "./LoginModal";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  if (status === "loading") return <Spinner />;
  if (status === "unauthenticated") return <LoginModal open={true} />;
  return <>{children}</>;
} 