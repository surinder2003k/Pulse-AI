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
  Zap,
  ShieldCheck,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    focusKeyword: "",
    metaTitle: "",
    metaDescription: "",
    featureImage: "",
    featureImageAlt: ""
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
        seoKeywords: data.seoKeywords || "",
        focusKeyword: data.focus_keyword || "",
        metaTitle: data.meta_title || "",
        metaDescription: data.meta_description || "",
        featureImage: data.feature_image_url || data.featureImage || "",
        featureImageAlt: data.feature_image_alt || data.image_alt || data.title || ""
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

      <div className="mb-10 relative">
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-full shadow-[0_0_15px_rgba(255,51,51,0.5)]" />
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-glow-red">
          Tactical <span className="text-white">Workspace</span>
        </h1>
        <p className="text-white/40 mt-2 font-mono text-xs uppercase tracking-[0.2em]">
          Protocol: Content Generation // Status: Ready
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="glass-dark border-white/5 shadow-premium overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            <CardHeader className="bg-white/5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Layout className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-black uppercase tracking-widest italic">Draft Core</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Editorial Title</label>
                    <span className="text-[10px] font-mono text-primary/60 italic">01 // IDENTITY</span>
                  </div>
                  <Input 
                    placeholder="ENTER HEADLINE..." 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="h-14 text-xl font-black italic bg-white/[0.03] border-white/10 focus:border-primary/50 transition-all placeholder:text-white/10 uppercase"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Narrative Excerpt</label>
                    <span className="text-[10px] font-mono text-primary/60 italic">02 // CONTEXT</span>
                  </div>
                  <Textarea 
                    placeholder="BRIEF SUMMARY..." 
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="min-h-[100px] bg-white/[0.03] border-white/10 focus:border-primary/50 transition-all placeholder:text-white/10 italic text-sm"
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Manuscript Body</label>
                    <span className="text-[10px] font-mono text-primary/60 italic">03 // INTEL</span>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-xl border border-white/5 p-4 mb-4">
                    <SEOAnalyzer 
                      title={formData.title} 
                      content={formData.content} 
                      seoKeywords={formData.seoKeywords} 
                      focusKeyword={formData.focusKeyword}
                      metaTitle={formData.metaTitle}
                      metaDescription={formData.metaDescription}
                    />
                  </div>

                  <div className="glass-dark rounded-xl border border-white/5 p-1">
                    {mounted ? (
                      <RichTextEditor 
                        value={formData.content}
                        onChange={(val) => setFormData({...formData, content: val})}
                      />
                    ) : (
                      <div className="h-96 w-full bg-white/5 animate-pulse rounded-lg border border-white/5" />
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-white/5">
                  <Button 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="bg-transparent border-white/10 hover:bg-white/5 hover:border-white/20 transition-all font-black uppercase italic tracking-widest text-xs"
                  >
                    Abort
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isPublishing} 
                    className="bg-primary hover:bg-primary/90 text-white min-w-[180px] h-12 shadow-glow-red border-none font-black uppercase italic tracking-widest text-xs transition-all active:scale-95"
                  >
                    {isPublishing ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <Send className="mr-2 h-4 w-4" />
                    )}
                    Deploy Post
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* AI Helper Card */}
          <Card className="glass-dark border-primary/20 bg-primary/[0.03] shadow-glow-red shadow-sm overflow-hidden group">
            <div className="h-1 bg-primary/40 group-hover:bg-primary transition-colors" />
            <CardHeader className="py-4 bg-primary/[0.05] border-b border-primary/10">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <CardTitle className="text-sm font-black uppercase tracking-widest italic text-white/80">Neural Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Topic Prompt</label>
                <Textarea 
                  placeholder="WHAT IS THE NEW FRONTIER?" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-black/40 border-primary/20 focus:border-primary/50 min-h-[120px] text-sm italic placeholder:text-primary/20 uppercase tracking-wider"
                />
              </div>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-glow-red font-black uppercase italic tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 border-none"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <BrainCircuit className="mr-2 h-4 w-4" />
                )}
                Synthesize Draft
              </Button>
            </CardContent>
          </Card>

          {/* Settings & Image Card */}
          <Card className="glass-dark border-white/5 shadow-premium">
            <CardHeader className="py-4 bg-white/5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-black uppercase tracking-widest italic">Asset Config</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Cover Identity</label>
                <div className="p-1 glass-dark rounded-xl border border-white/5 group hover:border-primary/30 transition-all">
                  <Dropzone 
                    onUpload={(url) => setFormData({...formData, featureImage: url})} 
                    currentImage={formData.featureImage} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Visual Database</label>
                  {searchResults.length > 0 && (
                    <button 
                      onClick={() => setSearchResults([])}
                      className="text-[9px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="QUERY ASSETS..." 
                    value={imageSearchQuery}
                    onChange={(e) => setImageSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImageSearch()}
                    className="flex-1 h-10 bg-black/40 border-white/10 uppercase text-xs"
                  />
                  <Button 
                    onClick={handleImageSearch}
                    disabled={isSearchingImage}
                    variant="secondary"
                    className="px-3 h-10 glass-dark border-white/10 hover:border-primary/50 transition-all"
                  >
                    {isSearchingImage ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Search className="h-4 w-4 text-primary" />}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4 max-h-[250px] overflow-y-auto p-3 border border-white/5 rounded-xl bg-black/40 custom-scrollbar">
                    {searchResults.map((url, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setFormData({...formData, featureImage: url});
                          toast.success("Identity Locked.");
                        }}
                        className={`relative aspect-video cursor-pointer overflow-hidden rounded-lg border transition-all group ${formData.featureImage === url ? 'ring-2 ring-primary border-primary' : 'border-white/5 hover:border-primary/50'}`}
                      >
                        <img 
                          src={url} 
                          alt={`Result ${i}`} 
                          className={`object-cover w-full h-full transition-all duration-700
                            ${formData.featureImage === url ? 'grayscale-0 scale-110' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'}
                          `}
                        />
                        <div className={`absolute inset-0 transition-opacity flex items-center justify-center
                          ${formData.featureImage === url ? 'bg-primary/20 opacity-100' : 'bg-primary/10 opacity-0 group-hover:opacity-100'}
                        `}>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full
                            ${formData.featureImage === url ? 'bg-primary text-white shadow-glow-red' : 'bg-black/80 text-white cursor-pointer'}
                          `}>
                            {formData.featureImage === url ? 'Active' : 'Deploy'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] italic">
                  <ShieldCheck className="h-3 w-3" />
                  SEO Protocol
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Category</label>
                    <div className="relative">
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full glass-dark border border-white/10 rounded-lg h-10 px-4 text-xs font-black uppercase italic tracking-widest text-white/80 focus:border-primary/50 outline-none appearance-none cursor-pointer"
                      >
                        <option>Technology</option>
                        <option>Design</option>
                        <option>Intelligence</option>
                        <option>Future</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-primary pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Tags (CSV)</label>
                    <Input 
                      placeholder="AI, FUTURE, INTEL..." 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="h-10 bg-black/40 border-white/10 text-xs uppercase tracking-widest placeholder:text-white/5"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Focus Vector</label>
                    <Input 
                      placeholder="ENTER KEYWORD..." 
                      value={formData.focusKeyword}
                      onChange={(e) => setFormData({...formData, focusKeyword: e.target.value})}
                      className="bg-black/40 border-white/10 text-xs italic uppercase placeholder:text-white/5"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Meta Signature</label>
                    <Textarea 
                      placeholder="CUSTOM SIGNATURE..." 
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                      className="min-h-[80px] text-[10px] bg-black/40 border-white/10 tracking-wider text-white/60"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
