import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | Venomous Notes",
  description: "...",
};

export default function NotFoundPage() {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <p>404</p>
        <p>NotFound</p>
      </div>
    </div>
  );
}
