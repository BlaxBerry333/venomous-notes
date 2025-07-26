import type { Metadata } from "next";
import Link from "next/link";

import { Layout } from "@/client/ui/layout";

export const metadata: Metadata = {
  title: "404",
};

export default function NotFoundPage() {
  return (
    <Layout.Result>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>

      <Link href="/" replace>
        Return Home
      </Link>
    </Layout.Result>
  );
}
