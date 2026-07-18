import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gem Smoke Logo Filter • Paper",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
