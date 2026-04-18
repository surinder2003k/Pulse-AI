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

  const playHoverSound = (soundPath: string) => {
    try {
      const audio = new Audio(soundPath);
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const [generationStep, setGenerationStep] = useState<string>("");

  const handleGenerate = async () => {
    if (!prompt) return toast.error("Please enter a topic first.");
    setIsGenerating(true);
    setGenerationStep("Analyzing Topic...");
    const toastId = toast.loading("AI is generating content...");
    
    try {
      setTimeout(() => setGenerationStep("Drafting Editorial Content..."), 2000);
      setTimeout(() => setGenerationStep("Synthesizing SEO Metadata..."), 5000);
      setTimeout(() => setGenerationStep("Fetching Visual Assets..."), 8000);

      const res = await fetch("/api/generate", { 
        method: "POST",
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      setGenerationStep("Populating Terminal...");
      setGeneratedPostId(data._id || null);
      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags,
        seoKeywords: data.seoKeywords || data.meta_keywords || "",
        focusKeyword: data.focus_keyword || "",
        metaTitle: data.meta_title || "",
        metaDescription: data.meta_description || "",
        featureImage: data.feature_image_url || data.featureImage || "",
        featureImageAlt: data.feature_image_alt || data.image_alt || data.title || ""
      });
      toast.dismiss(toastId);
      showAlert("success", "Synthesis Complete", "AI has successfully generated the high-end editorial draft.");
    } catch (error: any) {
      toast.dismiss(toastId);
      showAlert("error", "Error", error.message);
    } finally {
      setIsGenerating(false);
      setGenerationStep("");
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

      showAlert("success", "Protocol Success", "Asset successfully deployed to the network matrix.");
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
        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-full shadow-glow-red" />
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-gray-900">
          Tactical <span className="text-slate-300">Workspace</span>
        </h1>
        <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-[0.2em]">
          Protocol: Content Generation // Status: Ready
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-[3rem]">
            <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            <CardHeader className="bg-slate-50/50 py-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Layout className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-black uppercase tracking-widest italic text-gray-900">Draft Core</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Editorial Title</label>
                    <span className="text-[10px] font-mono text-primary/60 italic">01 // IDENTITY</span>
                  </div>
                  <Input 
                    placeholder="ENTER HEADLINE..." 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="h-16 text-2xl font-black italic bg-slate-50 border-slate-100 focus:border-primary/50 focus:bg-white transition-all placeholder:text-slate-300 uppercase rounded-2xl"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Narrative Excerpt</label>
                    <span className="text-[10px] font-mono text-primary/60 italic">02 // CONTEXT</span>
                  </div>
                  <Textarea 
                    placeholder="BRIEF SUMMARY..." 
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="min-h-[120px] bg-slate-50 border-slate-100 focus:border-primary/50 focus:bg-white transition-all placeholder:text-slate-300 italic text-sm rounded-2xl p-6"
                  />
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Manuscript Body</label>
                    <span className="text-[10px] font-mono text-primary/60 italic">03 // INTEL</span>
                  </div>
                  
                  <div className="bg-white rounded-3xl border border-slate-200 p-1 shadow-sm overflow-hidden">
                    {mounted ? (
                      <RichTextEditor 
                        value={formData.content}
                        onChange={(val) => setFormData({...formData, content: val})}
                      />
                    ) : (
                      <div className="h-96 w-full bg-slate-50 animate-pulse rounded-2xl border border-slate-100" />
                    )}
                  </div>
                </div>

                {/* WordPress Style SEO Section */}
                <div className="space-y-8 pt-10 border-t border-slate-100">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
                        <Search className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest italic text-gray-900">SEO Infrastructure</h3>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Meta Title</label>
                        <Input 
                          placeholder="GOOGLE HEADLINE..." 
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                          className="h-12 bg-slate-50 border-slate-100 text-xs font-bold uppercase tracking-wider rounded-xl transition-all focus:bg-white"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Focus Keyword</label>
                        <Input 
                          placeholder="TARGET KEYWORD..." 
                          value={formData.focusKeyword}
                          onChange={(e) => setFormData({...formData, focusKeyword: e.target.value})}
                          className="h-12 bg-slate-50 border-slate-100 text-xs font-bold uppercase tracking-wider rounded-xl transition-all focus:bg-white"
                        />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Meta Description</label>
                      <Textarea 
                        placeholder="SEARCH RESULT SNIPPET..." 
                        value={formData.metaDescription}
                        onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                        className="min-h-[100px] bg-slate-50 border-slate-100 text-xs font-bold tracking-wider rounded-xl transition-all focus:bg-white p-4"
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Meta Keywords (Comma Separated)</label>
                      <Input 
                        placeholder="AI, TECHNOLOGY, INNOVATION..." 
                        value={formData.seoKeywords}
                        onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})}
                        className="h-12 bg-slate-50 border-slate-100 text-xs font-bold uppercase tracking-wider rounded-xl transition-all focus:bg-white"
                      />
                   </div>
                </div>

                <div className="flex justify-end gap-4 pt-10 border-t border-slate-100">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => router.back()}
                    className="h-14 px-8 bg-transparent border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all font-black uppercase italic tracking-widest text-xs rounded-2xl"
                  >
                    Abort
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isPublishing} 
                    onMouseEnter={() => playHoverSound('/sounds/ek-jhaat-bhar-ka-aadmi.mp3')}
                    className="bg-primary hover:bg-primary/90 text-white min-w-[200px] h-14 shadow-glow-red border-none font-black uppercase italic tracking-widest text-xs transition-all active:scale-95 rounded-2xl"
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
          <Card className="bg-white border-primary/20 shadow-sm overflow-hidden group rounded-[3rem]">
            <div className="h-1 bg-primary/10 group-hover:bg-primary transition-colors duration-500" />
            <CardHeader className="py-5 bg-primary/[0.02] border-b border-primary/5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <CardTitle className="text-xs font-black uppercase tracking-widest italic text-gray-900">Neural Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Topic Prompt</label>
                <Textarea 
                  placeholder="WHAT IS THE NEW FRONTIER?" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-slate-50 border-slate-100 focus:border-primary/50 focus:bg-white min-h-[140px] text-sm italic placeholder:text-slate-300 uppercase tracking-wider rounded-2xl p-6"
                />
              </div>
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white shadow-glow-red font-black uppercase italic tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 border-none rounded-2xl"
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
          <Card className="bg-white border-slate-200 shadow-sm rounded-[3rem] overflow-hidden">
            <CardHeader className="py-5 bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-primary" />
                <CardTitle className="text-xs font-black uppercase tracking-widest italic text-gray-900">Asset Config</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Cover Identity</label>
                <div className="p-1 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-primary/30 transition-all overflow-hidden">
                  <Dropzone 
                    onUpload={(url) => setFormData({...formData, featureImage: url})} 
                    currentImage={formData.featureImage} 
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Visual Database</label>
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
                    className="flex-1 h-12 bg-slate-50 border-slate-100 uppercase text-xs rounded-xl"
                  />
                  <Button 
                    onClick={handleImageSearch}
                    disabled={isSearchingImage}
                    variant="secondary"
                    className="px-4 h-12 bg-white border-slate-200 hover:border-primary/50 transition-all rounded-xl shadow-sm"
                  >
                    {isSearchingImage ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Search className="h-4 w-4 text-primary" />}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-4 max-h-[300px] overflow-y-auto p-4 border border-slate-100 rounded-3xl bg-slate-50/50 custom-scrollbar">
                    {searchResults.map((url, i) => (
                      <div 
                        key={i}
                        onClick={() => {
                          setFormData({...formData, featureImage: url});
                          toast.success("Identity Locked.");
                        }}
                        className={`relative aspect-video cursor-pointer overflow-hidden rounded-2xl border transition-all group ${formData.featureImage === url ? 'ring-2 ring-primary border-primary' : 'border-slate-200 hover:border-primary/50'}`}
                      >
                        <img 
                          src={url} 
                          alt={`Result ${i}`} 
                          className={`object-cover w-full h-full transition-all duration-700
                            ${formData.featureImage === url ? 'grayscale-0 scale-110' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110'}
                          `}
                        />
                        <div className={`absolute inset-0 transition-opacity flex items-center justify-center
                          ${formData.featureImage === url ? 'bg-primary/10 opacity-100' : 'bg-primary/5 opacity-0 group-hover:opacity-100'}
                        `}>
                          <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full
                            ${formData.featureImage === url ? 'bg-primary text-white shadow-glow-red' : 'bg-white text-gray-900 border border-slate-200'}
                          `}>
                            {formData.featureImage === url ? 'Active' : 'Deploy'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-6">
                <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px] italic">
                  <ShieldCheck className="h-3 w-3" />
                  Classification
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Category</label>
                    <div className="relative">
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl h-12 px-5 text-xs font-black uppercase italic tracking-widest text-gray-900 focus:border-primary/50 outline-none appearance-none cursor-pointer"
                      >
                        <option>Technology</option>
                        <option>Business</option>
                        <option>Intelligence</option>
                        <option>Future</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-primary pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Tags (CSV)</label>
                    <Input 
                      placeholder="AI, FUTURE, INTEL..." 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="h-12 bg-slate-50 border-slate-100 text-xs uppercase tracking-widest placeholder:text-slate-300 rounded-xl"
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
