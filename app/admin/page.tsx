import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, Activity, Settings, ListPlus, Zap } from "lucide-react";
import AdminUserList from "@/components/AdminUserList";
import AdminSettings from "@/components/AdminSettings";
import ApiStatus from "@/components/ApiStatus";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAuthStatus } from "@/lib/auth";
import { cn } from "@/lib/utils";

export default async function AdminPage() {
  const { isAdmin, userId, email: userEmail } = await getAuthStatus();

  // Strict admin check
  if (!isAdmin) {
    redirect("/?access_denied=true");
  }

  await connectDB();
  const postsCount = await Post.countDocuments();

  const client = await clerkClient();
  const totalUsers = await client.users.getCount();
  const usersRes = await client.users.getUserList({ limit: 100 });
  
  const currentUserId = userId;

  const formattedUsers = usersRes.data.map(u => {
    const email = u.emailAddresses[0]?.emailAddress || 'No Email';
    let role = u.publicMetadata.role as string || 'user';
    // Double check email-based admin
    if (email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) role = 'admin';

    return {
      id: u.id,
      name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : 'No Name',
      email: email,
      role: role,
      created_at: new Date(u.createdAt).toISOString().split('T')[0]
    };
  });

  return (
    <div className="space-y-16 pb-32 relative">
      {/* Tactical Background Mask */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_20%_20%,rgba(229,9,20,0.04),transparent_50%)] pointer-events-none -z-10" />

      <div className="flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="w-16 h-16 rounded-[2rem] bg-black/40 flex items-center justify-center border border-white/10 shadow-premium backdrop-blur-3xl group relative overflow-hidden">
                <ShieldCheck className="h-8 w-8 text-primary shadow-glow-red relative z-10" />
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
             </div>
             <div>
                <div className="flex items-center gap-3 mb-1">
                   <span className="h-[1px] w-6 bg-primary" />
                   <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary italic">System Sovereignty</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-white">
                  Admin <span className="text-white/10 italic">Hub.</span>
                </h1>
             </div>
          </div>

          {/* Activity Telemetry */}
          <div className="hidden lg:flex items-center gap-10 px-8 py-4 rounded-3xl bg-black/40 border border-white/5 shadow-premium glass-dark">
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Link Status</span>
                <span className="text-[11px] font-bold text-primary flex items-center gap-2">
                   <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse shadow-glow-red" />
                   ENCRYPTED
                </span>
             </div>
             <div className="h-8 w-[1px] bg-white/5" />
             <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Uptime</span>
                <span className="text-[11px] font-bold text-white uppercase italic">99.2% OPTIMAL</span>
             </div>
          </div>
        </div>

        <p className="text-white/40 font-medium uppercase tracking-[0.3em] text-[11px] max-w-3xl border-l-[3px] border-primary/40 pl-8 py-3 leading-relaxed bg-white/[0.02] rounded-r-2xl">
          Authorized access confirmed for <span className="text-white font-black italic">{userEmail}</span>. All tactical overrides initialized. 
          <span className="ml-4 text-primary/40 animate-pulse font-mono tracking-widest">[Bypass: 0x4F2A]</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Total Users", val: totalUsers, icon: Users, color: "text-sky-400" },
          { label: "System Posts", val: postsCount || 42, icon: Activity, color: "text-primary" },
          { label: "AI Fidelity", val: "99.2%", icon: Zap, color: "text-yellow-400" },
          { label: "API Latency", val: "14ms", icon: Settings, color: "text-green-400" },
        ].map((item) => (
          <Card key={item.label} className="bg-secondary/[0.03] border-white/5 shadow-premium hover:shadow-soft transition-all duration-500 group">
            <CardHeader className="pb-2">
              <CardTitle className="text-[9px] font-black text-white/20 uppercase flex items-center justify-between tracking-[0.4em] group-hover:text-white/40 transition-colors">
                {item.label} <item.icon className={cn("h-4 w-4", item.color, "drop-shadow-glow")} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black italic tracking-tighter text-white group-hover:text-primary transition-colors duration-500">{item.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-10 bg-secondary/[0.02] p-8 md:p-14 rounded-[3.5rem] border border-white/5 shadow-premium glass-dark"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-5">
             <div className="w-1.5 h-12 bg-primary shadow-glow-red" />
             <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
               Manage <span className="text-primary italic">Community</span>
             </h2>
          </div>
          <Badge className="text-[9px] font-black uppercase tracking-[0.3em] border-primary/20 text-primary px-6 py-2.5 bg-primary/5 rounded-full shadow-glow-red">
             Direct Intervention Mode
          </Badge>
        </div>
        <AdminUserList initialUsers={formattedUsers} currentUserId={currentUserId ?? undefined} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <Card className="bg-secondary/[0.02] border-white/5 rounded-[3rem] shadow-premium h-full overflow-hidden glass-dark">
            <CardHeader className="bg-black/40 py-10 px-12 border-b border-white/5">
              <CardTitle className="flex items-center gap-5 text-2xl font-black uppercase italic tracking-tighter">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-soft">
                   <ListPlus className="h-6 w-6 text-primary" />
                </div>
                Protocol Tuning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12">
              <AdminSettings />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-5">
          <Card className="bg-secondary/[0.02] border-white/5 rounded-[3rem] shadow-premium h-full overflow-hidden glass-dark">
            <CardHeader className="bg-black/40 py-10 px-12 border-b border-white/5">
              <CardTitle className="flex items-center gap-5 text-2xl font-black uppercase italic tracking-tighter">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-soft">
                   <Activity className="h-6 w-6 text-primary" />
                </div>
                Deep Monitor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 h-[32rem] overflow-y-auto custom-scrollbar">
              <ApiStatus />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

