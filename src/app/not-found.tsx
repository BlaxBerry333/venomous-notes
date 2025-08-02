import type { Metadata } from "next";

import { NotfoundView } from "@/client/views/errors";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFoundPage() {
  return <NotfoundView />;
}
