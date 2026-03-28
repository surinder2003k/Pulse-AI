"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AIJobStatus() {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleManualTrigger = async () => {
    setIsGenerating(true);
    toast.info("Grok is brainstorming trending topics...", { icon: <Loader2 className="animate-spin" /> });
    
    try {
      const res = await fetch("/api/generate", { method: "POST" });
      if (!res.ok) throw new Error("Generation failed");
      toast.success("AI Post generated and published passionately!", { icon: <Sparkles className="text-primary" /> });
    } catch (error) {
      toast.error("Generation failed. Check API keys.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-purple">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Automation Engine
        </CardTitle>
        <Badge variant="purple" className="animate-pulse">Active</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Next Scheduled Sync</p>
            <p className="font-bold flex items-center gap-1.5"><RefreshCw className="h-3 w-3 text-primary" /> Today, 8:00 PM IST</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">Global Status</p>
            <p className="text-green-500 font-bold flex items-center justify-end gap-1.5">Connected <CheckCircle className="h-3 w-3" /></p>
          </div>
        </div>

        <Button 
          onClick={handleManualTrigger} 
          disabled={isGenerating}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 flex gap-2 font-bold shadow-purple-lg"
        >
          {isGenerating ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Humanizing Content...</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Trigger Manual Generation</>
          )}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center">
          Note: Manual trigger follows the rate limit of 5 per user/hour.
        </p>
      </CardContent>
    </Card>
  );
}
