"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Send, 
  Image as ImageIcon, 
  Tag, 
  Layout, 
  MessageSquareShare,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    excerpt: "",
    content: "",
    category: "Technology",
    tags: "",
    featureImage: ""
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        
        setFormData({
          _id: data._id,
          title: data.title,
          excerpt: data.excerpt,
          content: data.content,
          category: data.category,
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags,
          featureImage: data.feature_image_url || ""
        });
      } catch (error) {
        toast.error("Could not load post data.");
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchPost();
  }, [slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    
    try {
      const postPayload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()),
        status: "published"
      };

      const res = await fetch(`/api/posts/${formData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload)
      });
      
      if (!res.ok) throw new Error("Failed to update post");

      toast.success("Blog post updated successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Error updating post.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full border border-white/10 shadow-skeuo-button">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground mt-1">Refine your content and update your story.</p>
        </div>
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
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => router.push("/dashboard")}
                  className="rounded-2xl h-14 px-8 shadow-skeuo-button active:shadow-skeuo-button-pressed border-white/10 font-bold uppercase tracking-widest text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  disabled={isPublishing} 
                  className="rounded-2xl h-14 px-10 bg-primary hover:bg-primary text-white shadow-skeuo-button active:shadow-skeuo-button-pressed transition-all duration-150 font-black uppercase tracking-widest text-xs border border-white/10"
                >
                  {isPublishing ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                  Update Post
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
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

              {formData.featureImage && (
                <div className="pt-4">
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Preview</label>
                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-skeuo-in">
                    <img src={formData.featureImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
