"use client";

import { useEffect, useRef } from "react";
import { setCookie } from "cookies-next";

export default function MarkOnboardingComplete() {
  const hasSetCookie = useRef(false as boolean);

  useEffect(() => {
    if (hasSetCookie.current) return;
    hasSetCookie.current = true;

    setCookie("onboardingComplete", "true", {
      path: "/",
      sameSite: "lax",
    });
  }, []);

  return null;
}
