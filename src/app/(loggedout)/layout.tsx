import { ReactNode } from "react";


export default function LoggedinLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col justify-between bg-primary-200">
      {/* <LoggedoutHeader /> */}
      {children}
    </main>
  );
}
