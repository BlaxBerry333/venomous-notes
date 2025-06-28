import type { Metadata } from "next";

import NotFoundContainer from "@/client/common/components/NotFoundContainer";

export const metadata: Metadata = {
  title: "404 | Venomous Notes",
  description: "...",
};

export default function NotFoundPage() {
  return <NotFoundContainer />;
}
