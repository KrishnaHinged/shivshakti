"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function PageTransitionProvider({ children }) {
  const router = useRouter();
  const [loaderKey, setLoaderKey] = useState(0);

  useEffect(() => {
    const handleTransition = (e) => {
      const targetUrl = e.detail?.targetUrl;
      if (!targetUrl) return;

      // Increment loader key to force-mount a fresh LoadingScreen component
      setLoaderKey((prev) => prev + 1);

      // Wait briefly for the loading screen overlay to cover the viewport, then push the route
      const timer = setTimeout(() => {
        router.push(targetUrl);
      }, 450);

      return () => clearTimeout(timer);
    };

    window.addEventListener("trigger-page-load-transition", handleTransition);
    return () => {
      window.removeEventListener("trigger-page-load-transition", handleTransition);
    };
  }, [router]);

  return (
    <>
      <LoadingScreen key={loaderKey} />
      {children}
    </>
  );
}
