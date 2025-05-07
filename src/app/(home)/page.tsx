"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Text = dynamic(() => import("venomous-ui").then((mod) => mod.Text), { ssr: false });

export default function HomePage() {
  return (
    <div>
      <Text isTitle titleLevel="h4" text="HomePage" />
      <Image width={100} height={100} src="/logo.svg" alt="Logo" draggable={false} priority />
    </div>
  );
}
