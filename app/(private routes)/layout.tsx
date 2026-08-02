import type { ReactNode } from "react";

interface PrivateRoutesLayoutProps {
  children: ReactNode;
}

function PrivateRoutesLayout({ children }: PrivateRoutesLayoutProps) {
  return children;
}

export default PrivateRoutesLayout;
