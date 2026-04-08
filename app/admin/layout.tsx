import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <main className="flex-1 p-6 md:p-10 pb-24">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
