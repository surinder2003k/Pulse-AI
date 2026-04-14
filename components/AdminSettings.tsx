"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [category, setCategory] = useState("Technology");

  const categories = ["Technology", "Global News", "Sports", "Entertainment", "Auto", "Health", "Finance", "Science", "India", "Pakistan"];

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setEnabled(data.automationEnabled ?? true);
          setCategory(data.automationCategory || "Technology");
        }
      })
      .catch(err => {
        console.error("Failed to load settings", err);
        toast.error("Failed to load settings");
      })
      .finally(() => setLoading(false));
  }, []);

  const updateSetting = async (key: string, value: any) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
      if (!res.ok) throw new Error("Failed to update");
      toast.success("Settings updated");
      if (key === 'automationEnabled') setEnabled(value);
      if (key === 'automationCategory') setCategory(value);
    } catch (err) {
      toast.error("Error updating settings");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Protocol Card */}
      <div className="group relative flex items-center justify-between p-8 rounded-3xl bg-black/40 border border-white/5 shadow-premium glass-dark transition-all duration-700 hover:border-primary/30 hover:shadow-glow-red overflow-hidden">
        {/* Cinematic Underlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 transition-all duration-700 group-hover:bg-primary/10" />
        
        <div className="space-y-2">
           <div className="flex items-center gap-2">
             <div className="h-1 w-4 bg-primary rounded-full group-hover:w-8 transition-all duration-700" />
             <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">Protocol: AUTO_BROADCAST</span>
           </div>
           <span className="block text-lg font-bold text-white/90 group-hover:text-white transition-colors">Daily AI Intelligence Generation</span>
        </div>

        <div className="flex items-center gap-6">
          <Badge className={cn(
            "text-[9px] font-black uppercase px-6 py-2 rounded-full border-none transition-all duration-500",
            enabled 
              ? "bg-primary text-white shadow-glow-red scale-110" 
              : "bg-white/5 text-white/20"
          )}>
            {enabled ? "Sync Active" : "Link Severed"}
          </Badge>
          <button 
            disabled={updating}
            onClick={() => updateSetting('automationEnabled', !enabled)}
            className={cn(
               "relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-500 shadow-premium",
               enabled ? "bg-primary" : "bg-white/5"
            )}
          >
            <span className={cn(
              "inline-block h-8 w-8 transform rounded-full bg-white shadow-2xl transition-all duration-500",
              enabled ? "translate-x-11" : "translate-x-1"
            )} />
          </button>
        </div>
      </div>
      
      {/* Target Card */}
      <div className="group relative flex items-center justify-between p-8 rounded-3xl bg-black/40 border border-white/5 shadow-premium glass-dark transition-all duration-700 hover:border-primary/30 overflow-hidden">
        <div className="space-y-2">
           <div className="flex items-center gap-2">
             <div className="h-1 w-4 bg-primary/40 rounded-full group-hover:bg-primary transition-all duration-700" />
             <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Target: CONTENT_DOMAIN</span>
           </div>
           <span className="block text-lg font-bold text-white/90 group-hover:text-white transition-colors">Default Intelligence Domain</span>
        </div>
        
        <div className="relative">
          <select 
            disabled={updating || !enabled}
            value={category}
            onChange={(e) => updateSetting('automationCategory', e.target.value)}
            className="bg-black/80 border border-white/10 rounded-2xl px-8 py-3 text-xs font-black uppercase tracking-[0.2em] text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-20 transition-all duration-500 shadow-premium min-w-[200px] cursor-pointer appearance-none hover:border-primary/40"
          >
            {categories.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40">
            <Loader2 className={cn("h-4 w-4", updating ? "animate-spin" : "opacity-0")} />
          </div>
        </div>
      </div>

      {/* Restricted Entry */}
      <div className="group flex items-center justify-between p-8 rounded-3xl bg-black/40 border border-white/5 shadow-premium glass-dark opacity-30 select-none cursor-not-allowed grayscale">
        <div className="space-y-2">
           <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Entry: PUBLIC_UPLINK</span>
           <span className="block text-lg font-bold text-white/20 italic">Open Registration Matrix [LOCK]</span>
        </div>
        <Badge className="bg-white/5 text-white/20 text-[9px] font-black uppercase border-white/5 px-6 py-2 rounded-full tracking-[0.3em]">Restricted Access</Badge>
      </div>
      
      {/* Output Stats Overlay */}
      <div className="group relative flex items-center justify-between p-8 rounded-3xl bg-black/40 border border-white/5 shadow-premium glass-dark transition-all duration-700">
        <div className="space-y-2">
           <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Output: ANALYTICAL_DEPTH</span>
           <span className="block text-lg font-bold text-white/90 group-hover:text-white transition-colors italic">Neural Resolution Standard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden hidden md:block">
             <div className="h-full w-2/3 bg-primary animate-pulse shadow-glow-red" />
          </div>
          <span className="font-black text-primary uppercase italic tracking-[0.3em] text-[10px] bg-primary/10 px-8 py-3 rounded-full border border-primary/20 shadow-glow-red animate-pulse-slow">Deep Resonance</span>
        </div>
      </div>
    </div>
  );
}
