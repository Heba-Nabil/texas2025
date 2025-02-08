"use client";

import { useEffect } from "react";

export default function NoDataHandler() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      location.href = "/menu";
    }
  }, []);

  return null;
}
