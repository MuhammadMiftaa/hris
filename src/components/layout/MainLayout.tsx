import { AppSidebar } from "./AppSidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-(--background)">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Add top padding on mobile for the fixed mobile top bar */}
        <main className="flex-1 overflow-y-auto pt-14 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
