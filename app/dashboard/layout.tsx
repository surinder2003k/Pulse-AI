import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileTopHeader from "@/components/MobileTopHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#030303]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <MobileTopHeader />
        <main className="flex-1 p-4 pb-32 md:pb-10 md:p-14 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
