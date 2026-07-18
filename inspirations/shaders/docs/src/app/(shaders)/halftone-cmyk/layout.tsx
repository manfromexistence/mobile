import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Halftone CMYK Filter • Paper",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
