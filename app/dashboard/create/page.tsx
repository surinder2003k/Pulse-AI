"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Loader2, 
  Send, 
  Image as ImageIcon, 
  Tag, 
  Layout, 
  BrainCircuit,
  MessageSquareShare
} from "lucide-react";
import { useEffect } from "react";
// @ts-ignore
import anime from "animejs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [prompt, setPrompt] = useState("");
  
  const [generatedPostId, setGeneratedPostId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Technology",
    tags: "",
    featureImage: ""
  });

  useEffect(() => {
    if (isGenerating) {
      anime({
        targets: '.gen-glow',
        scale: [1, 1.05],
        opacity: [0.8, 1],
        boxShadow: ['0 0 20px rgba(168, 85, 247, 0.2)', '0 0 40px rgba(168, 85, 247, 0.6)'],
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        duration: 800
      });
    } else {
      anime.remove('.gen-glow');
      anime({
        targets: '.gen-glow',
        scale: 1,
        opacity: 1,
        boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
        duration: 300
      });
    }
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt) return toast.error("Please enter a topic or prompt first.");
    setIsGenerating(true);
    toast.info("Grok is drafting your masterpiece...", { icon: <Loader2 className="animate-spin" /> });
    
    try {
      const res = await fetch("/api/generate", { 
        method: "POST",
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Server Error:", data.error);
        throw new Error(data.error || "AI Generation failed");
      }
      
      setGeneratedPostId(data._id || null);
      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags,
        featureImage: data.feature_image_url || data.featureImage || ""
      });
      toast.success("Content generated! Review and publish.");
    } catch (error: any) {
      console.error("Generation Error Details:", error);
      toast.error(error.message || "Generation failed. Check API keys and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    try {
      const postPayload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()),
        status: "published"
      };

      if (generatedPostId) {
        // Post already exists in DB (created by /api/generate) — just update it
        const res = await fetch(`/api/posts/${generatedPostId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postPayload)
        });
        if (!res.ok) throw new Error("Failed to update post");
      } else {
        // Manual post — create new
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postPayload)
        });
        if (!res.ok) throw new Error("Failed to publish post");
      }

      toast.success("Blog post published successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error publishing post.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground mt-2">Draft your next masterpiece or let AI help you out.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-secondary/20 border-white/5 p-6 shadow-skeuo-out rounded-[2rem]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Layout className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">General Information</h2>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <Input 
                    placeholder="Enter a catchy title" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-background/50 border-white/5 h-14 rounded-xl shadow-skeuo-in focus-visible:ring-primary/50 text-white font-medium px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Excerpt (SEO Description)</label>
                  <Textarea 
                    placeholder="A short summary for search engines..." 
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="bg-background/50 border-white/5 min-h-[100px] rounded-xl shadow-skeuo-in focus-visible:ring-primary/50 text-white p-4 leading-relaxed"
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <label className="text-sm font-medium text-muted-foreground">Markdown Content</label>
                  <Textarea 
                    placeholder="Write your story in Markdown..." 
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="bg-background/50 border-white/5 min-h-[400px] rounded-xl shadow-skeuo-in focus-visible:ring-primary/50 font-mono text-sm leading-relaxed p-6"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button variant="outline" className="rounded-2xl h-14 px-8 shadow-skeuo-button active:shadow-skeuo-button-pressed border-white/10 font-bold uppercase tracking-widest text-xs">Save Draft</Button>
                <Button 
                  disabled={isPublishing} 
                  className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary text-white shadow-skeuo-button active:shadow-skeuo-button-pressed transition-all duration-150 font-black uppercase tracking-widest text-xs border border-white/10"
                >
                  {isPublishing ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                  Publish Post
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* AI Assistant */}
          <Card className="gen-glow relative overflow-hidden bg-primary/10 border border-primary/30 p-8 shadow-skeuo-float rounded-[2rem] backdrop-blur-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">AI Assistant</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Enter a topic and AI will generate a full blog post for you.</p>
            <Textarea 
              placeholder="e.g. Benefits of Next.js 15, My trip to Himalayas..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-background/80 border-white/10 mb-6 h-36 rounded-2xl shadow-skeuo-in p-5 leading-relaxed focus-visible:ring-primary/50 text-white font-medium"
            />
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary hover:brightness-110 active:brightness-90 rounded-2xl h-16 font-black tracking-widest uppercase text-xs shadow-skeuo-button active:shadow-skeuo-button-pressed transition-all border border-white/20"
            >
              {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
              Generate with AI
            </Button>
            </div>
          </Card>

          {/* Post Settings */}
          <Card className="bg-secondary/30 border-white/5 p-6 shadow-skeuo-out rounded-[2rem]">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareShare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Post Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-background border border-white/5 rounded-xl h-12 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/50 shadow-skeuo-in"
                >
                  <option>Technology</option>
                  <option>India News</option>
                  <option>Business</option>
                  <option>Science</option>
                  <option>Global</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Tags</label>
                <div className="relative">
                  <Input 
                    placeholder="nextjs, react, ai" 
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="bg-background/50 border-white/5 pr-10 rounded-xl h-12 shadow-skeuo-in"
                  />
                  <Tag className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Feature Image URL</label>
                <div className="relative">
                  <Input 
                    placeholder="https://unsplash.com/..." 
                    value={formData.featureImage}
                    onChange={(e) => setFormData({...formData, featureImage: e.target.value})}
                    className="bg-background/50 border-white/5 pr-10 rounded-xl h-12 shadow-skeuo-in"
                  />
                  <ImageIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
