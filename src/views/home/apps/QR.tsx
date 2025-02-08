"use client";

import { useEffect, useState } from "react";
import { useQRCode } from "next-qrcode";
import QRPlaceholder from "./QRPlaceholder";

type QRProps = {
  url: string;
} & React.HTMLAttributes<HTMLCanvasElement>;

export default function QR({ url }: QRProps) {
  const { Canvas } = useQRCode();

  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    setOrigin(location.origin);
  }, []);

  if (!origin || !url) return <QRPlaceholder />;

  return (
    <Canvas
      text={`${origin}${url}`}
      options={{
        errorCorrectionLevel: "L",
        margin: 2,
        scale: 5,
        width: 150,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }}
    />
  );
}
