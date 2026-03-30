"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Database, ShieldCheck, Sparkles, Image, Zap, RefreshCw, AlertCircle, CheckCircle2, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
  name: string;
  status: string;
  icon: string;
}

const IconMap: Record<string, any> = {
  Database,
  ShieldCheck,
  Sparkles,
  Image,
  Zap
};

export default function ApiStatus() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/health");
      const data = await res.json();
      if (data.services) {
        setServices(data.services);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Health fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <Cloud className="h-4 w-4" /> Live Service Monitor
        </h3>
        <div className="flex items-center gap-4">
          {lastUpdated && <span className="text-[10px] text-muted-foreground font-mono italic">Synced: {lastUpdated}</span>}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full hover:bg-white/5" 
            onClick={fetchHealth}
            disabled={loading}
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {services.map((service) => {
          const Icon = IconMap[service.icon] || Database;
          const isHealthy = service.status === "healthy";
          
          return (
            <div 
              key={service.name} 
              className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl border border-white/5 bg-black/50 group-hover:scale-110 transition-transform ${isHealthy ? "text-primary" : "text-red-500"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight">{service.name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant={isHealthy ? "outline" : "destructive"} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 ${isHealthy ? "border-primary/20 text-primary bg-primary/5" : ""}`}>
                  {isHealthy ? "Operational" : service.status.replace("_", " ")}
                </Badge>
                {isHealthy ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
