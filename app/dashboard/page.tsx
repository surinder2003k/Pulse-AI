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

import { getAuthStatus } from "@/lib/auth";

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      setIsAdmin(data.isAdmin);
      setUser(data.user);
    }
    checkAuth();
  }, []);

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
    <div className="space-y-12 pb-20 relative">
      {/* Cinematic Background Mesh */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col gap-6 relative">
        <div className="flex items-center gap-4 group">
           <div className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-3xl flex items-center justify-center border border-white/10 shadow-premium transition-all group-hover:border-primary/50 group-hover:shadow-glow-red">
              <ShieldCheck className="h-6 w-6 text-primary" />
           </div>
           <div className="space-y-1">
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-glow-red">
               Operational <span className="text-white">Core</span>
             </h1>
             <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Sector: User-Matrix // Status: Active</p>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[1px] border-white/5 pl-6 py-2">
          <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-2xl italic">
            SECURE UPLINK ESTABLISHED // <span className="text-primary italic">{user?.emailAddresses[0]?.emailAddress || "GUEST_IDENTITY"}</span> // MONITORING PROTOCOLS...
          </p>
          
          {isAdmin && (
            <Button 
              onClick={handleRunAutomation}
              disabled={isAutomating}
              className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-glow-red border-none transition-all font-black uppercase italic tracking-widest text-[11px] flex gap-3 group active:scale-95"
            >
              {isAutomating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
              )}
              Initialize AI Engine
            </Button>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {[
          { label: "Total Population", value: stats.totalUsers, icon: Users, color: "text-blue-500" },
          { label: "Knowledge Nodes", value: stats.systemPosts, icon: FileText, color: "text-red-500" },
          { label: "Synthesis Rate", value: stats.successRate, icon: Activity, color: "text-green-500" },
          { label: "Uplink Health", value: stats.apiHealth, icon: Zap, color: "text-yellow-500" }
        ].map((item, i) => (
          <Card key={i} className="glass-dark border-white/5 rounded-[3rem] shadow-premium overflow-hidden transition-all hover:scale-[1.02] hover:border-white/10 group cursor-default">
            <div className="h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-primary/30 transition-all" />
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">{item.label}</span>
                <item.icon className={cn("h-4 w-4 opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all drop-shadow-[0_0_8px_currentColor]", item.color)} />
              </div>
              <div className="space-y-2">
                 <p className="text-5xl font-black tracking-tighter text-white italic transition-all group-hover:text-glow-red">{item.value}</p>
                 {item.label === "Knowledge Nodes" && (
                   <div className="pt-4">
                      <Link href="/dashboard/posts">
                        <Button variant="ghost" className="h-9 w-full rounded-xl bg-white/[0.03] text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 border border-white/5 transition-all italic">
                          Directory Access
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
      <div className="space-y-8 pt-12 border-t border-white/5 relative">
        <div className="flex items-center gap-4">
           <Users className="h-5 w-5 text-primary" />
           <div className="space-y-1">
             <h2 className="text-3xl font-black tracking-tighter uppercase italic">Access <span className="text-white/20">/ Network</span></h2>
             <p className="text-[9px] font-mono text-white/20 uppercase tracking-[0.4em]">Protocol: User-Registry // Level: Restricted</p>
           </div>
           <Badge className="bg-primary/10 text-primary border-primary/20 ml-auto rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-widest backdrop-blur-2xl italic">System_Admin_Session</Badge>
        </div>

        <div className="rounded-[4rem] border border-white/5 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-premium group">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
                  <th className="px-12 py-10">Entity</th>
                  <th className="px-12 py-10">Credentials</th>
                  <th className="px-12 py-10 text-center">Protocol</th>
                  <th className="px-12 py-10">Sequence</th>
                  <th className="px-12 py-10 text-right">Overrides</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userList.map((usr, i) => (
                  <tr key={i} className="group hover:bg-white/[0.03] transition-all">
                    <td className="px-12 py-10">
                      <div className="flex items-center gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/10 shadow-premium group-hover:border-primary/30 transition-all">
                           <span className="text-primary font-black uppercase tracking-tighter text-sm italic">{usr.name.charAt(0)}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-white uppercase tracking-wider italic text-sm group-hover:text-primary transition-colors">{usr.name}</span>
                          <span className="text-[10px] font-mono text-white/20">UUID: {Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-12 py-10">
                      <span className="text-xs font-bold text-white/40 font-mono tracking-tight">{usr.email}</span>
                    </td>
                    <td className="px-12 py-10 text-center">
                      <Badge className={cn(
                        "rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest italic transition-all",
                        usr.role === 'admin' ? "bg-primary/20 text-primary border-primary/40 shadow-glow-red" : "bg-white/5 text-white/30 border-white/10"
                      )}>
                        {usr.role}
                      </Badge>
                    </td>
                    <td className="px-12 py-10">
                      <span className="text-[11px] font-black text-white/20 uppercase tracking-widest">{usr.joined}</span>
                    </td>
                    <td className="px-12 py-10 text-right">
                       <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all">
                          <button className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/30 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all shadow-premium active:scale-95">
                             <ShieldCheck className="h-5 w-5" />
                          </button>
                          <button className="h-10 w-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-white/30 hover:text-destructive hover:border-destructive/50 hover:bg-destructive/10 transition-all shadow-premium active:scale-95">
                             <Activity className="h-5 w-5" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl transition-all animate-in fade-in">
           <div className="max-w-md w-full p-16 glass-dark rounded-[4rem] border border-primary/20 shadow-glow-red space-y-10 relative overflow-hidden">
              {/* Background scanning effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent animate-shimmer pointer-events-none" />
              
              <div className="text-center space-y-6 relative z-10">
                 <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center border border-primary/30 shadow-glow-red animate-pulse">
                       <Zap className="h-12 w-12 text-primary fill-primary" />
                    </div>
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic text-glow-red">Neural Synthesis</h3>
                   <p className="text-white/30 font-black uppercase text-[10px] tracking-[0.4em]">Propagating Editorial Matrix...</p>
                 </div>
              </div>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">
                    <span>Synchronizing</span>
                    <span>{automationProgress}%</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <Progress value={automationProgress} className="h-full bg-primary shadow-glow-red" />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
