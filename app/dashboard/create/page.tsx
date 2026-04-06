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
  ImageIcon, 
  Tag, 
  Layout, 
  BrainCircuit,
  MessageSquareShare,
  Search,
  Trash2,
  X
} from "lucide-react";
import { useEffect } from "react";
// @ts-ignore
import anime from "animejs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PremiumAlert from "@/components/PremiumAlert";

import Dropzone from "@/components/Dropzone";
import RichTextEditor from "@/components/RichTextEditor";
import SEOAnalyzer from "@/components/SEOAnalyzer";

export default function CreatePostPage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [prompt, setPrompt] = useState("");
  
  const [generatedPostId, setGeneratedPostId] = useState<string | null>(null);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchingImage, setIsSearchingImage] = useState(false);

  // Alert State
  const [alert, setAlert] = useState<{
    isVisible: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
  }>({
    isVisible: false,
    type: "success",
    title: "",
    message: ""
  });

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Technology",
    tags: "",
    seoKeywords: "",
    featureImage: ""
  });

  const showAlert = (type: "success" | "error" | "info", title: string, message: string) => {
    setAlert({ isVisible: true, type, title, message });
  };

  const handleGenerate = async () => {
    if (!prompt) return toast.error("Please enter a topic first.");
    setIsGenerating(true);
    const toastId = toast.loading("AI is generating content...");
    
    try {
      const res = await fetch("/api/generate", { 
        method: "POST",
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      setGeneratedPostId(data._id || null);
      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags,
        seoKeywords: "",
        featureImage: data.feature_image_url || data.featureImage || ""
      });
      toast.dismiss(toastId);
      showAlert("success", "Content Ready", "AI has successfully generated the draft.");
    } catch (error: any) {
      toast.dismiss(toastId);
      showAlert("error", "Error", error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSearch = async () => {
    if (!imageSearchQuery) return toast.error("Search term required.");
    setIsSearchingImage(true);
    
    try {
      const res = await fetch(`/api/images/search?q=${encodeURIComponent(imageSearchQuery)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image lookup failed");
      
      setSearchResults(data.urls || []);
      if (!data.urls || data.urls.length === 0) {
        toast.info("No images found for this query.");
      }
    } catch (error: any) {
      showAlert("error", "Error", error.message);
    } finally {
      setIsSearchingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return toast.error("Title is required.");
    setIsPublishing(true);
    
    try {
      const postPayload = {
        ...formData,
        tags: formData.tags.split(",").map(t => t.trim()),
        status: "published"
      };

      const endpoint = generatedPostId ? `/api/posts/${generatedPostId}` : "/api/posts";
      const method = generatedPostId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload)
      });
      
      if (!res.ok) throw new Error("Failed to save post.");

      showAlert("success", "Success", "Post has been published successfully.");
      setTimeout(() => router.push("/dashboard/posts"), 2000);
    } catch (error: any) {
      showAlert("error", "Error", error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 px-6">
      <PremiumAlert 
        isVisible={alert.isVisible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
      />

      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="text-muted-foreground mt-2">Write manually or use AI to generate your next big story.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Post Title</label>
                  <Input 
                    placeholder="Enter post title..." 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="h-12 text-lg font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Excerpt (Summary)</label>
                  <Textarea 
                    placeholder="Briefly describe what this post is about..." 
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Content</label>
                  
                  <SEOAnalyzer 
                    title={formData.title} 
                    content={formData.content} 
                    seoKeywords={formData.seoKeywords} 
                  />

                  <RichTextEditor 
                    value={formData.content}
                    onChange={(val) => setFormData({...formData, content: val})}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <Button variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isPublishing} 
                    className="bg-primary hover:bg-primary/90 text-white min-w-[150px]"
                  >
                    {isPublishing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
                    Publish Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* AI Helper Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">AI Integration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="What should I write about?" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-background min-h-[100px]"
              />
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                Generate Draft
              </Button>
            </CardContent>
          </Card>

          {/* Settings & Image Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Post Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Feature Image</label>
                <Dropzone 
                  onUpload={(url) => setFormData({...formData, featureImage: url})} 
                  currentImage={formData.featureImage} 
                />
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Search Library</label>
                  {searchResults.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSearchResults([])}
                      className="h-7 px-2 text-xs text-muted-foreground hover:text-white"
                    >
                      <X className="h-3 w-3 mr-1" /> Clear
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search images..." 
                    value={imageSearchQuery}
                    onChange={(e) => setImageSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImageSearch()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleImageSearch}
                    disabled={isSearchingImage}
                    variant="secondary"
                    className="px-3"
                  >
                    {isSearchingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4 max-h-[300px] overflow-y-auto p-2 border rounded-md bg-secondary/20">
                    {searchResults.map((url, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setFormData({...formData, featureImage: url});
                          toast.success("Image selected.");
                        }}
                        className={`relative aspect-video cursor-pointer overflow-hidden rounded border transition-all group ${formData.featureImage === url ? 'ring-2 ring-primary border-primary' : 'border-white/10 hover:border-primary/50'}`}
                      >
                        <img 
                          src={url} 
                          alt={`Result ${i}`} 
                          className={`object-cover w-full h-full transition-all duration-500
                            ${formData.featureImage === url ? 'grayscale-0 opacity-100' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}
                          `}
                        />
                        <div className={`absolute inset-0 transition-opacity flex items-center justify-center
                          ${formData.featureImage === url ? 'bg-primary/20 opacity-100' : 'bg-primary/10 opacity-0 group-hover:opacity-100'}
                        `}>
                          <span className={`text-[10px] uppercase font-bold tracking-tighter px-2 py-1 rounded
                            ${formData.featureImage === url ? 'bg-primary text-white shadow-lg' : 'bg-black/80'}
                          `}>
                            {formData.featureImage === url ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-background border rounded-md h-10 px-3 text-sm focus:ring-1 focus:ring-primary/40 outline-none"
                >
                  <option>Technology</option>
                  <option>Design</option>
                  <option>Intelligence</option>
                  <option>Future</option>
                </select>
              </div>

              <div className="pt-4 border-t space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input 
                  placeholder="e.g. ai, tech, future" 
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>

              <div className="pt-4 border-t space-y-2">
                <label className="text-sm font-medium">Focus SEO Keywords</label>
                <Input 
                  placeholder="e.g. best ai tools, future of groq" 
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})}
                />
                <p className="text-[10px] text-muted-foreground">Separate keywords with commas.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
