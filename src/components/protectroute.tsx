"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingBubbles from "./loadingbubbles";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/signin");
        }
    }, [user, loading, router]);

    if (loading) return <LoadingBubbles />;

    // Render the protected content if logged in
    return <>{children}</>;
}
