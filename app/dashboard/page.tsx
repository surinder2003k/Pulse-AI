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
  Zap,
  Trash2,
  Lock
} from "lucide-react";

import Link from "next/link";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn, ADMIN_EMAIL } from "@/lib/utils";

export default function DashboardOverview() {
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    systemPosts: 0,
    successRate: "98.4%",
    apiHealth: "Healthy"
  });
  
  const [userList, setUserList] = useState<any[]>([]);
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationProgress, setAutomationProgress] = useState(0);

  useEffect(() => {
    async function initDashboard() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/auth/status");
        const data = await res.json();
        setIsAdmin(data.isAdmin);
        setUser(data.user);

        if (data.isAdmin) {
          fetchUsers();
          fetchStats();
        }
      } catch (err) {
        toast.error("Failed to establish secure uplink");
      } finally {
        setIsLoading(false);
      }
    }
    initDashboard();
  }, []);

  const fetchUsers = async () => {
    setIsUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (Array.isArray(data)) {
        setUserList(data);
        setStats(prev => ({ ...prev, totalUsers: data.length }));
      }
    } catch (err) {
      toast.error("Failed to propagate user matrix");
    } finally {
      setIsUsersLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(prev => ({
        ...prev,
        systemPosts: data.totalPosts || 0,
        apiHealth: data.apiHealth || "Healthy"
      }));
    } catch (err) {
      console.error("Stats sync failed");
    }
  };

  const handleUpdateRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setActionLoading(userId);
    const toastId = toast.loading(`Reconfiguring protocol to ${newRole.toUpperCase()}...`);

    try {
      const res = await fetch("/api/admin/role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Override failed");

      toast.success("Protocol updated successfully", { id: toastId });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to purge this asset from the network?")) return;
    
    setActionLoading(userId);
    const toastId = toast.loading("Purging asset from matrix...");

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE"
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Purge failed");

      toast.success("Asset successfully purged", { id: toastId });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunAutomation = async () => {
    setIsAutomating(true);
    setAutomationProgress(5);
    const toastId = toast.loading("Initializing AI Engine...");

    try {
      setAutomationProgress(20);
      const res = await fetch("/api/automate");
      if (!res.ok) throw new Error("Automation failed");
      setAutomationProgress(100);
      toast.success(`Success! Generated trending posts.`, { id: toastId });
      fetchStats();
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

  const playHoverSound = (path: string) => {
    try {
      const audio = new Audio(path);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 relative p-6 md:p-10">
      {/* Cinematic Background Mesh */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col gap-6 relative">
        <div className="flex items-center gap-4 group">
           <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-premium">
              <ShieldCheck className="h-7 w-7 text-primary" />
           </div>
           <div className="space-y-1">
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-gray-900">
               Operational <span className="text-slate-300 group-hover:text-primary transition-colors duration-500">Core</span>
             </h1>
             <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em]">Sector: User-Matrix // Status: Active</p>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[1px] border-slate-200 pl-6 py-2">
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] max-w-2xl italic">
            SECURE UPLINK ESTABLISHED // <span className="text-primary italic">{user?.emailAddresses?.[0]?.emailAddress || "GUEST_IDENTITY"}</span> // MONITORING PROTOCOLS...
          </p>
          
          {isAdmin && (
            <Button 
              onClick={handleRunAutomation}
              onMouseEnter={() => playHoverSound('/sounds/fahhhhhhhhhhhhhh.mp3')}
              disabled={isAutomating}
              className="h-14 px-10 rounded-2xl bg-white hover:bg-slate-50 text-gray-900 border border-slate-200 shadow-sm transition-all font-black uppercase italic tracking-widest text-[11px] flex gap-3 group active:scale-95"
            >
              {isAutomating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              )}
              Initialize AI Engine
            </Button>
          )}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {[
          { label: "Total Population", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Knowledge Nodes", value: stats.systemPosts, icon: FileText, color: "text-red-500", bg: "bg-red-50" },
          { label: "Synthesis Rate", value: stats.successRate, icon: Activity, color: "text-green-500", bg: "bg-green-50" },
          { label: "Uplink Health", value: stats.apiHealth, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" }
        ].map((item, i) => (
          <Card key={i} className="bg-white border-slate-200 rounded-[3rem] shadow-sm overflow-hidden transition-all hover:scale-[1.02] hover:shadow-premium group cursor-default">
            <div className="h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent group-hover:via-primary/20 transition-all" />
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">{item.label}</span>
                <div className={cn("p-2 rounded-xl border border-slate-100", item.bg)}>
                  <item.icon className={cn("h-4 w-4 transition-all group-hover:scale-110", item.color)} />
                </div>
              </div>
              <div className="space-y-2">
                 <p className="text-5xl font-black tracking-tighter text-gray-900 italic transition-all group-hover:text-primary">{item.value}</p>
                 {item.label === "Knowledge Nodes" && (
                   <div className="pt-4">
                      <Link href="/dashboard/posts">
                        <Button variant="ghost" className="h-10 w-full rounded-2xl bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-gray-900 hover:bg-slate-100 border border-slate-100 transition-all italic">
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
      {isAdmin && (
        <div className="space-y-8 pt-12 border-t border-slate-200 relative">
          <div className="flex items-center gap-4">
             <Users className="h-6 w-6 text-primary" />
             <div className="space-y-1">
               <h2 className="text-3xl font-black tracking-tighter uppercase italic text-gray-900">Access <span className="text-slate-300">/ Network</span></h2>
               <p className="text-[9px] font-mono text-slate-400 uppercase tracking-[0.4em]">Protocol: User-Registry // Level: Restricted</p>
             </div>
             <Badge className="bg-primary/5 text-primary border-primary/20 ml-auto rounded-full px-5 py-2 font-black text-[10px] uppercase tracking-widest backdrop-blur-2xl italic">System_Admin_Session</Badge>
          </div>

          <div className="rounded-[4rem] border border-slate-200 bg-white overflow-hidden shadow-premium group min-h-[400px]">
            {isUsersLoading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Registry...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">
                      <th className="px-12 py-10">Entity</th>
                      <th className="px-12 py-10">Credentials</th>
                      <th className="px-12 py-10 text-center">Protocol</th>
                      <th className="px-12 py-10 text-center">Sequence</th>
                      <th className="px-12 py-10 text-right">Overrides</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {userList.map((usr, i) => {
                      const isCurrentUserSuperAdmin = clerkUser?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL;
                      const isTargetSuperAdmin = usr.email === ADMIN_EMAIL;
                      const isTargetSelf = usr.id === clerkUser?.id;
                      
                      // Only super admin can manage others. Cannot manage self or other super admins (though there should only be one).
                      const canManage = isCurrentUserSuperAdmin && !isTargetSelf && !isTargetSuperAdmin;
                      
                      return (
                        <tr key={i} className="group hover:bg-slate-50/50 transition-all">
                          <td className="px-12 py-10">
                            <div className="flex items-center gap-5">
                              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm group-hover:border-primary/30 transition-all duration-500">
                                <span className="text-primary font-black uppercase tracking-tighter text-sm italic">{usr.name.charAt(0)}</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-black text-gray-900 uppercase tracking-wider italic text-sm group-hover:text-primary transition-colors">
                                  {usr.name} {isTargetSelf && <span className="text-primary lowercase tracking-normal">(you)</span>}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ID: {usr.id.slice(-6)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-12 py-10">
                            <span className="text-xs font-bold text-slate-500 font-mono tracking-tight">{usr.email}</span>
                          </td>
                          <td className="px-12 py-10 text-center">
                            <Badge className={cn(
                              "rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest italic transition-all",
                              usr.role === 'admin' ? "bg-primary text-white" : "bg-slate-100 text-slate-500 border-slate-200"
                            )}>
                              {usr.role}
                            </Badge>
                          </td>
                          <td className="px-12 py-10 text-center">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{usr.joined}</span>
                          </td>
                          <td className="px-12 py-10 text-right">
                            <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-all">
                              {canManage ? (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleUpdateRole(usr.id, usr.role)}
                                    disabled={actionLoading === usr.id}
                                    className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                    title={usr.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                                  >
                                    {actionLoading === usr.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteUser(usr.id)}
                                    disabled={actionLoading === usr.id}
                                    className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                    title="Purge Asset"
                                  >
                                    {actionLoading === usr.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                                  </button>
                                </div>
                              ) : (
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100 italic font-black text-[9px] uppercase tracking-tighter" title={isTargetSelf ? "Self-management restricted" : "Root access protected"}>
                                  <Lock className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Overlay for Automation */}
      {isAutomating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-2xl transition-all animate-in fade-in">
           <div className="max-w-md w-full p-16 bg-white rounded-[4rem] border border-slate-200 shadow-premium space-y-10 relative overflow-hidden">
              {/* Background scanning effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent animate-shimmer pointer-events-none" />
              
              <div className="text-center space-y-6 relative z-10">
                 <div className="flex justify-center">
                    <div className="h-24 w-24 rounded-[2.5rem] bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm animate-pulse">
                       <Zap className="h-12 w-12 text-primary fill-primary" />
                    </div>
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900">Neural Synthesis</h3>
                   <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.4em]">Propagating Editorial Matrix...</p>
                 </div>
              </div>
              <div className="space-y-4 relative z-10">
                 <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.3em] text-primary italic">
                    <span>Synchronizing</span>
                    <span>{automationProgress}%</span>
                 </div>
                 <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <Progress value={automationProgress} className="h-full bg-primary" />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
