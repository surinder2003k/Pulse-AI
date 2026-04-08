import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <main className="flex-1 p-4 pb-24 md:pb-10 md:p-10">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
