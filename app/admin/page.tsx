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
  Globe,
  Settings,
  Database
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { cn, ADMIN_EMAIL } from "@/lib/utils";

export default function AdminDashboard() {
  const { user } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 3,
    systemPosts: 38,
    activeSubscribers: 0,
    apiQuota: "82%"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/status");
      const data = await res.json();
      setIsAdmin(data.isAdmin);
      setLoading(false);
    }
    checkAuth();
  }, []);

  if (loading) return null;

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center border border-red-200 shadow-sm">
          <ShieldCheck className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Access <span className="text-red-500">Denied</span></h1>
        <p className="text-slate-500 max-w-sm uppercase text-[10px] tracking-widest font-mono">Insufficient authorization level detected // Encryption handshake failed</p>
        <Link href="/">
          <Button variant="outline" className="rounded-xl px-10 border-slate-200">Return to Grid</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 relative px-6 md:px-10">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none" />

      {/* Admin Header */}
      <div className="flex flex-col gap-6 relative">
        <div className="flex items-center gap-4 group">
           <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm transition-all group-hover:border-primary/50 group-hover:shadow-premium">
              <Database className="h-7 w-7 text-primary" />
           </div>
           <div className="space-y-1">
             <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-gray-900">
               Master <span className="text-slate-300 group-hover:text-primary transition-colors duration-500">Protocol</span>
             </h1>
             <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em]">Auth Level: Root // Instance: Global_Editor</p>
           </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[1px] border-slate-200 pl-6 py-2">
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px] max-w-2xl italic">
            ADMINISTRATOR UPLINK ACTIVE // <span className="text-primary italic">SYSTEM_ROOT</span> // BROADCASTING PROTOCOLS...
          </p>
          
          <div className="flex gap-4">
             <Link href="/dashboard/create">
               <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-glow-red border-none transition-all font-black uppercase italic tracking-widest text-[11px] flex gap-3 group active:scale-95">
                  <PlusCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  New Editorial Asset
               </Button>
             </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {[
          { label: "Global Entities", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Content Matrix", value: stats.systemPosts, icon: FileText, color: "text-primary", bg: "bg-red-50" },
          { label: "Active Nodes", value: stats.activeSubscribers, icon: Globe, color: "text-green-500", bg: "bg-green-50" },
          { label: "API Throttling", value: stats.apiQuota, icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" }
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
              <div>
                 <p className="text-5xl font-black tracking-tighter text-gray-900 italic transition-all group-hover:text-primary">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Admin Quick Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12 border-t border-slate-200">
         <Card className="bg-white border-slate-200 rounded-[4rem] shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
            <CardHeader className="p-10 pb-6 border-b border-slate-50">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary">
                     <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">System Configuration</h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Protocol: Global_Settings</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
               <p className="text-sm text-slate-500 leading-relaxed italic">Manage core platform parameters including SEO weights, theme variables, and editorial standards.</p>
               <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 text-[11px] font-black uppercase tracking-widest italic hover:bg-slate-50 transition-all">
                  Open Config Panel
               </Button>
            </CardContent>
         </Card>

         <Card className="bg-white border-slate-200 rounded-[4rem] shadow-sm overflow-hidden group hover:border-primary/20 transition-all">
            <CardHeader className="p-10 pb-6 border-b border-slate-50">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary">
                     <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-900">Automation Engine</h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Protocol: AI_Synthesis</p>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-10 space-y-6">
               <p className="text-sm text-slate-500 leading-relaxed italic">Optimize the content generation pipeline. Configure scraping frequency and LLM temperature overrides.</p>
               <Link href="/dashboard" className="block">
                <Button className="w-full h-14 rounded-2xl bg-white border border-slate-200 text-gray-900 hover:bg-slate-50 text-[11px] font-black uppercase tracking-widest italic transition-all shadow-sm">
                    Access Generator
                </Button>
               </Link>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
