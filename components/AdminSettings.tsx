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
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-black/20 border border-white/5 shadow-skeuo-in group hover:border-primary/20 transition-all">
        <div className="space-y-1">
           <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Protocol: AUTO_BROADCAST</span>
           <span className="font-bold text-white/80 group-hover:text-white transition-colors">Daily AI Intelligence Generation</span>
        </div>
        <div className="flex items-center gap-5">
          <Badge className={cn(
            "text-[9px] font-black uppercase px-4 py-1.5 rounded-full border-none shadow-skeuo-button transition-all",
            enabled ? "bg-primary text-white glow-red" : "bg-white/10 text-white/30"
          )}>
            {enabled ? "ACTIVE" : "OFFLINE"}
          </Badge>
          <button 
            disabled={updating}
            onClick={() => updateSetting('automationEnabled', !enabled)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all shadow-skeuo-in ${enabled ? 'bg-primary' : 'bg-secondary/40'} disabled:opacity-50`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-xl transition-all ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-6 rounded-2xl bg-black/20 border border-white/5 shadow-skeuo-in group hover:border-primary/20 transition-all">
        <div className="space-y-1">
           <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Target: CONTENT_DOMAIN</span>
           <span className="font-bold text-white/80 group-hover:text-white transition-colors">Default Intelligence Domain</span>
        </div>
        <select 
          disabled={updating || !enabled}
          value={category}
          onChange={(e) => updateSetting('automationCategory', e.target.value)}
          className="bg-secondary/20 border border-white/10 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:opacity-20 transition-all shadow-skeuo-button h-10 appearance-none text-center cursor-pointer min-w-[140px]"
        >
          {categories.map(c => <option key={c} value={c} className="bg-black text-white">{c}</option>)}
        </select>
      </div>

      <div className="flex items-center justify-between p-6 rounded-2xl bg-black/20 border border-white/5 shadow-skeuo-in group opacity-50 select-none">
        <div className="space-y-1">
           <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Entry: PUBLIC_UPLINK</span>
           <span className="font-bold text-white/40">Open Registration Matrix</span>
        </div>
        <Badge className="bg-white/5 text-white/20 text-[9px] font-black uppercase border-white/5 px-4 py-1.5 rounded-full shadow-skeuo-in">RESTRICTED</Badge>
      </div>
      
      <div className="flex items-center justify-between p-6 rounded-2xl bg-black/20 border border-white/5 shadow-skeuo-in group">
        <div className="space-y-1">
           <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Output: ANALYTICAL_DEPTH</span>
           <span className="font-bold text-white/80 group-hover:text-white transition-colors">Resolution Standard</span>
        </div>
        <span className="font-black text-primary uppercase italic tracking-[0.2em] text-[10px] bg-primary/10 px-6 py-2 rounded-full border border-primary/20 shadow-skeuo-button animate-pulse-slow">Deep Resonance</span>
      </div>
    </div>
  );
}
