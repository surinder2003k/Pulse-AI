"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  RefreshCw,
  Loader2,
  Users,
  Activity,
  ShieldCheck,
  Zap
} from "lucide-react";

import Link from "next/link";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn, ADMIN_EMAIL } from "@/lib/utils";

export default function DashboardOverview() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalUsers: 3,
    systemPosts: 38,
    successRate: "98.4%",
    apiHealth: "Healthy"
  });
  const [userList, setUserList] = useState([
    { name: "No Name", email: "alexicer371@algam.com", role: "user", joined: "2026-04-01" },
    { name: "Mohit", email: "sendtestmail1@gmail.com", role: "user", joined: "2026-03-28" },
    { name: "Tutuherere Aman", email: "xyzg135@gmail.com", role: "admin", joined: "2026-02-28" }
  ]);
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationProgress, setAutomationProgress] = useState(0);

  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;

  const handleRunAutomation = async () => {
    setIsAutomating(true);
    setAutomationProgress(5);
    const toastId = toast.loading("Initializing AI Engine...");

    try {
      setAutomationProgress(20);
      const res = await fetch("/api/automate");
      if (!res.ok) throw new Error("Automation failed");
      setAutomationProgress(100);
      toast.success(`Success! Generated 2 trending posts.`, { id: toastId });
      setTimeout(() => {
        setIsAutomating(false);
        setAutomationProgress(0);
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to run automation", { id: toastId });
      setIsAutomating(false);
      setAutomationProgress(0);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-skeuo-button">
                <ShieldCheck className="h-5 w-5 text-primary" />
             </div>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
               Admin Control <span className="text-white/20">/ Center</span>
             </h1>
          </div>
          <p className="text-muted-foreground font-medium uppercase tracking-[0.05em] max-w-2xl">
            Full system access for <span className="text-primary font-black italic">{user?.primaryEmailAddress?.emailAddress}</span>. Manage users, posts, and automation engines.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           {isAdmin && (
             <Button 
               onClick={handleRunAutomation}
               disabled={isAutomating}
               className="h-16 px-10 rounded-[2rem] bg-secondary/20 hover:bg-white/5 text-white border border-white/10 shadow-skeuo-button active:shadow-skeuo-button-pressed transition-all font-black uppercase tracking-widest text-xs flex gap-3"
             >
               {isAutomating ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Zap className="h-5 w-5 text-primary" />}
               AI Manager
             </Button>
           )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
          { label: "System Posts", value: stats.systemPosts, icon: FileText, color: "text-red-400" },
          { label: "AI Success Rate", value: stats.successRate, icon: Activity, color: "text-green-400" },
          { label: "API Health", value: stats.apiHealth, icon: Zap, color: "text-yellow-400" }
        ].map((item, i) => (
          <Card key={i} className="bg-secondary/10 border-white/5 rounded-[2.5rem] shadow-skeuo-out overflow-hidden relative group">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">{item.label}</span>
                <item.icon className={cn("h-5 w-5 opacity-40 group-hover:opacity-100 transition-opacity", item.color)} />
              </div>
              <div className="bg-black/40 rounded-3xl p-6 shadow-skeuo-in border border-white/5">
                 <p className="text-4xl font-black tracking-tighter text-white">{item.value}</p>
                 {item.label === "System Posts" && (
                   <div className="mt-4 flex justify-end">
                      <Link href="/dashboard/posts">
                        <Button variant="ghost" size="sm" className="h-8 rounded-xl bg-black/60 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white border border-white/5">
                          Manage Posts
                        </Button>
                      </Link>
                   </div>
                 )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Community Management Table */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
           <Users className="h-6 w-6 text-primary" />
           <h2 className="text-3xl font-black tracking-tighter uppercase italic">Manage Pulse Community</h2>
           <Badge className="bg-secondary/40 text-white/40 border-white/10 ml-auto rounded-full px-4 py-1 font-bold text-[10px] uppercase tracking-widest backdrop-blur-md">Admin-Only View</Badge>
        </div>

        <div className="rounded-[3rem] border border-white/5 bg-secondary/10 overflow-hidden shadow-skeuo-float">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40 border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                  <th className="px-10 py-8">User</th>
                  <th className="px-10 py-8">Email</th>
                  <th className="px-10 py-8 text-center">Role</th>
                  <th className="px-10 py-8">Joined</th>
                  <th className="px-10 py-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userList.map((usr, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-skeuo-button">
                           <span className="text-primary font-black uppercase tracking-tighter text-xs">{usr.name.charAt(0)}</span>
                        </div>
                        <span className="font-black text-white uppercase tracking-tight italic">{usr.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm font-medium text-white/40">{usr.email}</span>
                    </td>
                    <td className="px-10 py-8 text-center">
                      <Badge className={cn(
                        "rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest",
                        usr.role === 'admin' ? "bg-primary/20 text-primary border-primary/30" : "bg-white/10 text-white/40 border-white/10"
                      )}>
                        {usr.role}
                      </Badge>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-xs font-bold text-white/20">{usr.joined}</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="h-8 w-8 rounded-lg bg-secondary/40 border border-white/10 flex items-center justify-center text-white/30 hover:text-primary transition-colors shadow-skeuo-button">
                             <ShieldCheck className="h-4 w-4" />
                          </button>
                          <button className="h-8 w-8 rounded-lg bg-secondary/40 border border-white/10 flex items-center justify-center text-white/30 hover:text-destructive transition-colors shadow-skeuo-button">
                             <Activity className="h-4 w-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Progress Overlay for Automation */}
      {isAutomating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
           <div className="max-w-md w-full p-12 bg-secondary/20 rounded-[3rem] border border-primary/30 shadow-skeuo-float space-y-8">
              <div className="text-center space-y-4">
                 <div className="flex justify-center">
                    <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/30 shadow-skeuo-button animate-pulse">
                       <Zap className="h-8 w-8 text-primary" />
                    </div>
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight italic">Engine Core / Active</h3>
                 <p className="text-white/40 font-medium uppercase text-xs tracking-widest">Generating high-octane editorial content...</p>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary italic">
                    <span>Synchronizing</span>
                    <span>{automationProgress}%</span>
                 </div>
                 <Progress value={automationProgress} className="h-2 bg-white/5" />
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
