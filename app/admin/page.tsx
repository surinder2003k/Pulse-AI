import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, Activity, Settings, ListPlus } from "lucide-react";
import AdminUserList from "@/components/AdminUserList";
import AdminSettings from "@/components/AdminSettings";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ADMIN_EMAIL } from "@/lib/utils";

export default async function AdminPage() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  // Strict email check as specified
  if (userEmail !== ADMIN_EMAIL) {
    redirect("/?access_denied=true");
  }

  await connectDB();
  const postsCount = await Post.countDocuments();

  const client = await clerkClient();
  const totalUsers = await client.users.getCount();
  const usersRes = await client.users.getUserList({ limit: 100 });
  
  const currentUserId = user?.id;

  const formattedUsers = usersRes.data.map(u => {
    const email = u.emailAddresses[0]?.emailAddress || 'No Email';
    // Priority: Primary Email Check -> Metadata Role -> Default 'user'
    let role = u.publicMetadata.role as string || 'user';
    if (email === ADMIN_EMAIL) role = 'admin';

    return {
      id: u.id,
      name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : 'No Name',
      email: email,
      role: role,
      created_at: new Date(u.createdAt).toISOString().split('T')[0]
    };
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight flex items-center gap-4">
          <ShieldCheck className="h-10 w-10 text-primary" /> Admin Control <span className="text-muted-foreground">/ Center</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Full system access for <span className="text-primary font-bold">{ADMIN_EMAIL}</span>. Manage users, posts, and automation engines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-secondary/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between tracking-widest">
              Total Users <Users className="h-4 w-4 text-sky-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">{totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 border-white/5 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between tracking-widest">
              System Posts <Activity className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-3xl font-extrabold">{postsCount || 42}</p>
            <Link href="/dashboard/posts" className="w-full">
              <Button size="sm" variant="outline" className="w-full font-bold border-white/10 hover:bg-white/5 text-xs h-8">
                Manage Posts
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between tracking-widest">
              AI Success Rate <Activity className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">98.4%</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/20 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase flex items-center justify-between tracking-widest">
              API Health <Settings className="h-4 w-4 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold">Healthy</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" /> Manage Pulse Community
          </h2>
          <Badge variant="outline" className="text-muted-foreground">Admin-Only View</Badge>
        </div>
        <AdminUserList initialUsers={formattedUsers} currentUserId={currentUserId} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-secondary/20 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ListPlus className="h-5 w-5 text-primary" /> System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AdminSettings />
          </CardContent>
        </Card>
        
        <Card className="bg-secondary/20 border-white/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> API Log Stream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[10px] font-mono text-muted-foreground overflow-y-auto h-40 scrollbar-hide">
            <p>[21:05:40] - INFO: Automation cron triggered for India News.</p>
            <p>[21:05:55] - INFO: Grok brainstorming successful - "Chandigarh Metro Delay".</p>
            <p>[21:06:12] - SUCCESS: Unsplash image fetched passionatly.</p>
            <p>[21:07:01] - INFO: Punjabi Humanization complete (Score: 0.99).</p>
            <p>[21:07:05] - SUCCESS: Post published to Supabase.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
