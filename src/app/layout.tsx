import "~/styles/globals.css";
import "@fontsource-variable/public-sans";
import "~/styles/proof.css";
import type { Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
export const metadata: Metadata = {
  title: "LP Model Evaluator — Proof",
  description:
    "Turn a linear programming problem into an inspectable model, solver run and explanation.",
  icons: [{ rel: "icon", url: "/icon.svg", type: "image/svg+xml" }],
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
