"use client";

import dynamic from "next/dynamic";

const Text = dynamic(() => import("venomous-ui").then((mod) => mod.Text), { ssr: false });

export default function NotePage() {
  return (
    <div>
      <Text isTitle titleLevel="h4" text="NotePage" />
    </div>
  );
}
