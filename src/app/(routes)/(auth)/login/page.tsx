import type { Metadata } from "next";

import { LoginView } from "@/client/views/login";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div>
      LoginPage
      <LoginView />
    </div>
  );
}
