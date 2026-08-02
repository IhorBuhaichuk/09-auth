import type { ReactNode } from "react";

interface PrivateRoutesLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

function PrivateRoutesLayout({ children, modal }: PrivateRoutesLayoutProps) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}

export default PrivateRoutesLayout;
