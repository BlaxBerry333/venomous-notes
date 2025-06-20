import NotFoundContainer from "@/client/components/common/NotFoundContainer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | Venomous Notes",
  description: "...",
};

export default function NotFoundPage() {
  return <NotFoundContainer />;
}
