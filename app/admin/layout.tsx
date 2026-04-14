import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#030303] text-white selection:bg-primary/30 selection:text-primary">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(229,9,20,0.03),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay pointer-events-none" />
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Glow Bar */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent absolute top-0 z-50" />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-12 pb-32 custom-scrollbar relative z-10">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none z-20" />
      </div>
      
      <MobileNav />
    </div>
  );
}
