"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
        <span>Automatic AI Post Daily (Cron)</span>
        <div className="flex items-center gap-3">
          <Badge variant={enabled ? "accent" : "secondary"}>
            {enabled ? "ENABLED" : "DISABLED"}
          </Badge>
          <button 
            disabled={updating}
            onClick={() => updateSetting('automationEnabled', !enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-muted'} disabled:opacity-50`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
        <span>AI Post Category</span>
        <select 
          disabled={updating || !enabled}
          value={category}
          onChange={(e) => updateSetting('automationCategory', e.target.value)}
          className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-primary disabled:opacity-50"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
        <span>Public Registration</span>
        <Badge variant="secondary">DISABLED</Badge>
      </div>
      
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
        <span>Editorial Depth</span>
        <span className="font-black text-primary uppercase tracking-widest text-[10px] bg-primary/10 px-3 py-1 rounded-full animate-pulse border border-primary/20">Deep Resonance</span>
      </div>
    </div>
  );
}
