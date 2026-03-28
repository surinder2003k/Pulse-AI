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
  Eye, 
  ArrowUpRight,
  RefreshCw,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function DashboardOverview() {
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isAutomating, setIsAutomating] = useState(false);
  const [automationProgress, setAutomationProgress] = useState(0);

  const fetchPosts = () => {
    if (user) {
      fetch("/api/posts")
        .then(res => res.json())
        .then(data => setUserPosts(data || []));
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleRunAutomation = async () => {
    setIsAutomating(true);
    setAutomationProgress(5);
    const toastId = toast.loading("Initializing AI Engine...");

    try {
      // Step 1: Start
      setAutomationProgress(20);
      toast.loading("Finding trending topics...", { id: toastId });
      
      const res = await fetch("/api/automate");
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Automation failed");
      }

      setAutomationProgress(80);
      toast.loading("Finalizing posts...", { id: toastId });
      
      const data = await res.json();
      
      setAutomationProgress(100);
      toast.success(`Success! Generated 2 trending posts.`, { id: toastId });
      
      // Refresh posts list
      fetchPosts();
      
      // Reset after a delay
      setTimeout(() => {
        setIsAutomating(false);
        setAutomationProgress(0);
      }, 2000);

    } catch (error: any) {
      console.error("Automation error:", error);
      toast.error(error.message || "Failed to run automation", { id: toastId });
      setIsAutomating(false);
      setAutomationProgress(0);
    }
  };

  const totalPosts = userPosts?.length || 0;
  const publishedPosts = userPosts?.filter(p => p.status === 'published').length || 0;
  const draftPosts = totalPosts - publishedPosts;

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your blog.</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isAutomating && (
            <div className="w-48 space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-primary">
                <span>Progress</span>
                <span>{automationProgress}%</span>
              </div>
              <Progress value={automationProgress} className="h-1 bg-white/5" />
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="rounded-2xl h-11 border-white/10 bg-secondary/30 gap-2 shadow-skeuo-button active:shadow-skeuo-button-pressed transition-all font-bold uppercase tracking-widest text-[10px] min-w-[180px]"
              onClick={handleRunAutomation}
              disabled={isAutomating}
            >
              {isAutomating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary" /> 
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" /> Run AI Automation
                </>
              )}
            </Button>
            <Link href="/dashboard/create">
              <Button className="rounded-2xl h-11 px-6 bg-primary hover:bg-primary text-white gap-2 shadow-skeuo-button active:shadow-skeuo-button-pressed transition-all font-black uppercase tracking-widest text-[10px] border border-white/10">
                <PlusCircle className="h-4 w-4" /> New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="w-full p-5 rounded-2xl bg-secondary/20 border border-white/5 flex items-center justify-between text-xs shadow-skeuo-in">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Clock className="h-4 w-4 text-primary" />
          <span>Next Auto-Post Scheduled: <span className="text-white font-bold">08:00 AM IST</span></span>
        </div>
        <span className="text-primary font-bold tracking-widest uppercase text-[10px]">Scheduled</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-secondary/30 border-white/5 shadow-skeuo-out hover:shadow-skeuo-float rounded-[2rem] transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Posts</CardTitle>
            <div className="p-3 bg-blue-500/10 rounded-2xl shadow-skeuo-in"><FileText className="h-5 w-5 text-blue-500" /></div>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-4xl font-black drop-shadow-md">{totalPosts}</p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Articles in your library</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-white/5 shadow-skeuo-out hover:shadow-skeuo-float rounded-[2rem] transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Published</CardTitle>
            <div className="p-3 bg-green-500/10 rounded-2xl shadow-skeuo-in"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-4xl font-black drop-shadow-md">{publishedPosts}</p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Live on the platform</p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30 border-white/5 shadow-skeuo-out hover:shadow-skeuo-float rounded-[2rem] transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
            <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Drafts</CardTitle>
            <div className="p-3 bg-orange-500/10 rounded-2xl shadow-skeuo-in"><Clock className="h-5 w-5 text-orange-500" /></div>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-4xl font-black drop-shadow-md">{draftPosts}</p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Pending review/post</p>
          </CardContent>
        </Card>
      </div>

      {/* AI CTA Section */}
      <Card className="bg-primary/10 border-primary/20 border p-10 rounded-[3rem] relative overflow-hidden group shadow-skeuo-float backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/20 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black flex items-center gap-3">
              New: AI Content Generation
            </h2>
            <p className="text-muted-foreground max-w-xl text-lg">
              Out of ideas? Use our AI to draft a complete, SEO-friendly blog post in seconds.
            </p>
          </div>
          <Link href="/dashboard/create">
            <Button className="rounded-xl h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold shadow-purple-lg gap-2">
              Try AI Generator <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
      
      {/* Quick view of posts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <Link href="/dashboard/posts" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
            View All <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        
        {userPosts && userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <Card className="bg-secondary/30 border-white/5 hover:border-primary/30 transition-all group cursor-pointer overflow-hidden h-full shadow-skeuo-out hover:shadow-skeuo-float rounded-[2rem]">
                  <div className="aspect-video relative overflow-hidden">
                     <img src={post.feature_image_url} alt="" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                     <Badge className="absolute top-3 left-3 bg-primary text-white border-none">{post.category}</Badge>
                  </div>
                  <CardContent className="p-4 space-y-2">
                     <h3 className="font-bold line-clamp-1">{post.title}</h3>
                     <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views} Views</span>
                        <span>{new Date(post.createdAt || post.published_at || post.created_at || Date.now()).toLocaleDateString()}</span>
                     </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-20 text-center bg-secondary/10 rounded-3xl border border-dashed border-white/10">
            <p className="text-muted-foreground">No posts found. Start by creating your first AI passion!</p>
          </div>
        )}
      </div>
    </div>
  );
}
