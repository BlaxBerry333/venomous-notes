import type { Metadata } from "next";

import { HomeView } from "@/client/views/home";

export const metadata: Metadata = {
  title: "Home",
};

export default function HomePage() {
  return <HomeView />;
}
