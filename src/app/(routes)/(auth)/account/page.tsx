import type { Metadata } from "next";

import { AccountView } from "@/client/views/account";

export const metadata: Metadata = {
  title: "Account",
};

export default function AccountPage() {
  return <AccountView />;
}
