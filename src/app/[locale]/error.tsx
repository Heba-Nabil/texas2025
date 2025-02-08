"use client"; // Error components must be Client Components

import { lazy } from "react";

export default lazy(() => import("@/views/error/ErrorView"));
