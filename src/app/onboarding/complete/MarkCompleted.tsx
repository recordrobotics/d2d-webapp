"use client";

import { useEffect, useRef } from "react";
import { db } from "@/lib/donation";

export default function MarkOnboardingComplete() {
  const hasSetCookie = useRef(false as boolean);

  useEffect(() => {
    if (hasSetCookie.current) return;
    hasSetCookie.current = true;
    (async () => {
      await db.settings.put({ key: "onboardingComplete", value: "true" });
    })();
  }, []);

  return null;
}
