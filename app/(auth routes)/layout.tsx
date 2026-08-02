import type { ReactNode } from "react";

interface AuthRoutesLayoutProps {
  children: ReactNode;
}

function AuthRoutesLayout({ children }: AuthRoutesLayoutProps) {
  return children;
}

export default AuthRoutesLayout;
