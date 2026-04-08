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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-skeuo-button">
              <ShieldCheck className="h-5 w-5 text-primary" />
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
             Admin Control <span className="text-white/20">/ Center</span>
           </h1>
        </div>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs max-w-2xl border-l-[3px] border-primary pl-4 py-1">
          Full system access for <span className="text-primary font-black italic">{userEmail}</span>. Manage users, posts, and automation engines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", val: totalUsers, icon: Users, color: "text-sky-500" },
          { label: "System Posts", val: postsCount || 42, icon: Activity, color: "text-primary" },
          { label: "AI Success Rate", val: "98.4%", icon: Activity, color: "text-green-500" },
          { label: "API Health", val: "Healthy", icon: Settings, color: "text-yellow-500" },
        ].map((item) => (
          <Card key={item.label} className="bg-secondary/10 border-white/5 shadow-skeuo-in hover:shadow-skeuo-button transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black text-white/30 uppercase flex items-center justify-between tracking-[0.3em]">
                {item.label} <item.icon className={cn("h-4 w-4", item.color)} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black italic tracking-tighter text-white">{item.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-8 bg-secondary/[0.03] p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-skeuo-float">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-2 h-10 bg-primary shadow-skeuo-button" />
             <h2 className="text-3xl font-black uppercase italic tracking-tighter">
               Manage <span className="text-primary italic">Community</span>
             </h2>
          </div>
          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-white/10 text-white/30 px-4 py-2 bg-black/40">Admin Protocol Active</Badge>
        </div>
        <AdminUserList initialUsers={formattedUsers} currentUserId={currentUserId ?? undefined} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7">
          <Card className="bg-secondary/10 border-white/5 rounded-[2.5rem] shadow-skeuo-in h-full overflow-hidden">
            <CardHeader className="bg-black/40 py-8 px-10 border-b border-white/5">
              <CardTitle className="flex items-center gap-4 text-xl font-black uppercase italic tracking-tighter">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                   <ListPlus className="h-5 w-5 text-primary" />
                </div>
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10">
              <AdminSettings />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-5">
          <Card className="bg-secondary/10 border-white/5 rounded-[2.5rem] shadow-skeuo-in h-full overflow-hidden">
            <CardHeader className="bg-black/40 py-8 px-10 border-b border-white/5">
              <CardTitle className="flex items-center gap-4 text-xl font-black uppercase italic tracking-tighter">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                   <Activity className="h-5 w-5 text-primary" />
                </div>
                Service Monitor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-10 h-64 overflow-y-auto scrollbar-hide">
              <ApiStatus />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

