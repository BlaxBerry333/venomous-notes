import type { Metadata } from "next";

import { ArticlesView } from "@/client/views/articles";

export const metadata: Metadata = {
  title: "Articles",
};

export default function ArticlesPage() {
  return <ArticlesView />;
}
