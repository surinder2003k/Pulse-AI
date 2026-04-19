"use client";

import { useState, useEffect } from "react";
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
  Search,
  Zap,
  ShieldCheck,
  X,
  ChevronRight,
  Settings,
  Globe,
  Pen,
  Trash2,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Dropzone from "@/components/Dropzone";
import RichTextEditor from "@/components/RichTextEditor";

export default function CreatePostPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedPostId, setGeneratedPostId] = useState<string | null>(null);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchingImage, setIsSearchingImage] = useState(false);
  const [imageMode, setImageMode] = useState<"search" | "upload">("search");

  useEffect(() => {
    setMounted(true);
  }, []);

  // Removed PremiumAlert state as per user request

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
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
    if (type === "success") toast.success(`${title}: ${message}`);
    else if (type === "error") toast.error(`${title}: ${message}`);
    else toast.info(`${title}: ${message}`);
  };

  const handleGenerate = async () => {
    if (!prompt) return toast.error("PROMPT REQUIRED FOR SYNTHESIS.");
    setIsGenerating(true);
    const toastId = toast.loading("AI NEURAL SYNTHESIS IN PROGRESS...");
    
    try {
      const res = await fetch("/api/generate", { 
        method: "POST",
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Synthesis failed");
      
      const getCaseInsensitive = (obj: any, keys: string[]): string => {
        const lowerObj = Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));
        for (const key of keys) {
          const val = lowerObj[key.toLowerCase()];
          if (val !== undefined && val !== null) return String(val);
        }
        return "";
      };

      setGeneratedPostId(data._id || null);
      setFormData({
        title: getCaseInsensitive(data, ['title', 'headline', 'name', 'editorial_headline']),
        slug: data.slug || getCaseInsensitive(data, ['slug', 'permalink']),
        excerpt: getCaseInsensitive(data, ['excerpt', 'description', 'summary', 'meta_description', 'hook']),
        content: getCaseInsensitive(data, ['content', 'body', 'article', 'text', 'markdown_content']),
        category: getCaseInsensitive(data, ['category', 'field', 'domain']) || "Technology",
        tags: Array.isArray(getCaseInsensitive(data, ['tags'])) 
                ? (getCaseInsensitive(data, ['tags']) as any).join(", ") 
                : getCaseInsensitive(data, ['tags']),
        seoKeywords: getCaseInsensitive(data, ['seoKeywords', 'meta_keywords', 'keywords', 'seo_keywords']),
        focusKeyword: getCaseInsensitive(data, ['focus_keyword', 'focusKeyword', 'keyword', 'focus']),
        metaTitle: getCaseInsensitive(data, ['meta_title', 'metaTitle', 'seo_title', 'title']),
        metaDescription: getCaseInsensitive(data, ['meta_description', 'metaDescription', 'seo_description', 'excerpt']),
        featureImage: data.feature_image_url || getCaseInsensitive(data, ['featureImage', 'image', 'feature_image', 'thumbnail']),
        featureImageAlt: data.feature_image_alt || getCaseInsensitive(data, ['image_alt', 'featureImageAlt', 'alt_text', 'title'])
      });
      toast.dismiss(toastId);
      showAlert("success", "Synthesis Successful", "High-fidelity content and metadata have been populated.");
    } catch (error: any) {
      toast.dismiss(toastId);
      showAlert("error", "Neural Override", error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageSearch = async () => {
    if (!imageSearchQuery) return toast.error("SEARCH PARAMETER REQUIRED.");
    setIsSearchingImage(true);
    
    try {
      const res = await fetch(`/api/images/search?q=${encodeURIComponent(imageSearchQuery)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Asset lookup failed");
      
      setSearchResults(data.urls || []);
    } catch (error: any) {
      showAlert("error", "Lookup Error", error.message);
    } finally {
      setIsSearchingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const missingFields = [];
    if (!formData.title?.trim()) missingFields.push("TITLE");
    if (!formData.content?.trim()) missingFields.push("CONTENT");
    
    if (missingFields.length > 0) {
      toast.error(`MISSING FIELDS: ${missingFields.join(" AND ")} REQUIRED.`);
      try {
        const audio = new Audio("/sounds/aisa-mat-karo-meri-jaan.mp3");
        audio.play().catch(err => console.log("Audio playback failed:", err));
      } catch (e) {}
      return;
    }
    
    setIsPublishing(true);
    
    try {
      const postPayload = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        tags: typeof formData.tags === 'string' ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : formData.tags,
        status: "published"
      };

      const endpoint = generatedPostId ? `/api/posts/${generatedPostId}` : "/api/posts";
      const method = generatedPostId ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload)
      });
      
      if (!res.ok) throw new Error("Post deployment failed.");

      showAlert("success", "Deployment Complete", "Asset successfully integrated into the network.");
      setTimeout(() => router.push("/dashboard/posts"), 2000);
    } catch (error: any) {
      showAlert("error", "Deployment Error", error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 flex flex-col xl:flex-row overflow-hidden max-w-[1600px] mx-auto w-full p-4 lg:p-10 gap-8">
        
        {/* Left Side: Editor (70%) */}
        <div className="flex-1 w-full flex flex-col">
          {/* Header Area */}
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center h-6 w-6 bg-primary/10 rounded-full">
                <Globe className="h-3 w-3 text-primary" />
              </div>
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Create New Post</p>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase leading-none">
                  CREATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600 italic">POST</span>
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-3 max-w-xl">
                  Write your story manually or generate using AI Assistant.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="h-12 px-6 rounded-2xl border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-2" /> Discard
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isPublishing} 
                  className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-red-600 hover:opacity-90 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all"
                >
                  {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish Article"}
                  <ShieldCheck className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Surface */}
          <div className="flex-1 bg-white rounded-3xl border border-slate-200/60 p-8 shadow-sm flex flex-col overflow-y-auto custom-scrollbar">
            <div className="space-y-10 max-w-4xl w-full">
              
              {/* Headline */}
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <span className="text-slate-400 font-serif italic text-lg leading-none">T</span>
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Title</label>
                 </div>
                 <Input 
                   placeholder="Enter title..." 
                   value={formData.title}
                   onChange={(e) => setFormData({...formData, title: e.target.value})}
                   className="h-16 text-3xl font-bold bg-[#F8FAFC] border border-slate-100 rounded-2xl px-6 focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-slate-300"
                 />
              </div>

              {/* Excerpt */}
              <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <div className="grid grid-cols-2 gap-0.5">
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-sm"></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-sm"></div>
                     <div className="w-1.5 h-1.5 bg-slate-400 rounded-sm"></div>
                   </div>
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Description (Excerpt)</label>
                 </div>
                 <Textarea 
                   placeholder="A concise executive summary for SEO meta tags..." 
                   value={formData.excerpt}
                   onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                   className="min-h-[100px] text-base font-medium bg-[#F8FAFC] border border-slate-100 rounded-2xl px-6 py-5 focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-slate-300 resize-none"
                 />
              </div>

              {/* Content */}
              <div className="space-y-3 flex-1 flex flex-col">
                 <div className="flex items-center gap-2">
                   <span className="text-slate-400 font-mono text-xs font-bold">{'>_'}</span>
                   <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Content</label>
                 </div>
                 <div className="flex-1 bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col min-h-[400px]">
                   {mounted ? (
                     <RichTextEditor 
                       value={formData.content}
                       onChange={(val) => setFormData({...formData, content: val})}
                     />
                   ) : (
                     <div className="flex-1 w-full bg-slate-50 animate-pulse" />
                   )}
                 </div>
              </div>

              {/* Bottom Readability Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                 <div className="flex items-center gap-8">
                   <div>
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Post Stats</p>
                     <p className="text-xs font-bold text-slate-900 mt-1">{formData.content.length > 0 ? formData.content.trim().split(/\s+/).length : 0} <span className="text-slate-400">WORDS</span> • {formData.content.length} <span className="text-slate-400">CHARS</span></p>
                   </div>
                   <div>
                     <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Readability Score</p>
                     <p className="text-xs font-bold text-slate-900 mt-1">EST. <span className="text-primary italic">{Math.max(1, Math.ceil((formData.content.length > 0 ? formData.content.trim().split(/\s+/).length : 0) / 200))} MIN</span> READING TIME</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Draft Status</p>
                   <div className="flex items-center justify-end gap-1.5 mt-1">
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Sync Active</p>
                   </div>
                 </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Tools (30%) */}
        <div className="w-full xl:w-[400px] flex flex-col gap-6 shrink-0 mt-8 xl:mt-0 overflow-y-auto custom-scrollbar xl:pb-20">
          
          {/* Visual Asset Panel */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Featured Image</h3>
            </div>
            
            <div className="flex p-1 bg-slate-50 rounded-xl mb-6 border border-slate-100">
              <div 
                onClick={() => setImageMode("search")}
                className={cn(
                  "flex-1 rounded-lg text-[10px] uppercase tracking-widest font-bold h-8 flex items-center justify-center cursor-pointer transition-all",
                  imageMode === "search" ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:bg-slate-100"
                )}
              >
                Search
              </div>
              <div 
                onClick={() => setImageMode("upload")}
                className={cn(
                  "flex-1 rounded-lg text-[10px] uppercase tracking-widest font-bold h-8 flex items-center justify-center cursor-pointer transition-all",
                  imageMode === "upload" ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:bg-slate-100"
                )}
              >
                Upload
              </div>
            </div>

            {imageMode === "search" ? (
              <>
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input 
                    placeholder="Search global images..." 
                    value={imageSearchQuery}
                    onChange={(e) => setImageSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImageSearch()}
                    className="h-12 bg-white border border-slate-200 rounded-xl pl-11 pr-24 text-xs font-medium placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary/30"
                  />
                  <Button 
                    onClick={handleImageSearch} 
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 bg-primary hover:bg-primary/90 rounded-lg text-[9px] uppercase tracking-widest font-bold shadow-none"
                  >
                    {isSearchingImage ? <Loader2 className="h-3 w-3 animate-spin" /> : "Find"}
                  </Button>
                </div>

                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar p-1">
                    {searchResults.map((url, i) => (
                      <div 
                        key={url}
                        onClick={() => setFormData({...formData, featureImage: url})}
                        className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${formData.featureImage === url ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-slate-300'}`}
                      >
                         <img src={url} alt="" className="w-full h-full object-cover" />
                         {formData.featureImage === url && (
                           <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                             <div className="bg-white rounded-full p-1.5 shadow-sm">
                               <Zap className="h-3 w-3 text-primary" />
                             </div>
                           </div>
                         )}
                      </div>
                    ))}
                  </div>
                ) : formData.featureImage ? (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-100">
                        <img src={formData.featureImage} alt="Feature" className="w-full h-full object-cover" />
                        <Button variant="ghost" onClick={() => setFormData({...formData, featureImage: ""})} className="absolute top-2 right-2 h-8 w-8 bg-white/50 backdrop-blur-md rounded-full shadow-sm p-0 text-slate-800 hover:bg-red-500 hover:text-white transition-all">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="h-32 rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-300">
                        <ImageIcon className="h-6 w-6 opacity-50" />
                        <p className="text-[9px] uppercase tracking-widest font-bold">No Assets Found</p>
                    </div>
                )}
              </>
            ) : (
              <div className="p-1">
                <Dropzone 
                  onUpload={(url) => setFormData({...formData, featureImage: url})} 
                  currentImage={formData.featureImage}
                />
              </div>
            )}
          </div>

          {/* AI Co-Author Panel */}
           <div className="relative p-1 rounded-[2rem] bg-gradient-to-br from-primary/5 to-orange-50/30 border border-primary/10 overflow-hidden shadow-sm">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>
            
            <div className="absolute -top-10 -right-10 opacity-10">
              <Zap className="h-40 w-40 text-primary" />
            </div>

            <div className="relative bg-white/80 backdrop-blur-md p-7 rounded-[1.8rem] space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary shadow-md shadow-primary/20 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">AI Assistant</h3>
              </div>
              
              <div className="relative">
                <Textarea 
                  placeholder="Briefly describe the story topic (e.g., 'The future of clean energy in the Himalayas')..." 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[140px] bg-white border border-slate-200/60 rounded-2xl text-xs font-medium placeholder:text-slate-300 p-5 focus-visible:ring-1 focus-visible:ring-primary/30 transition-all resize-none shadow-sm"
                />
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full h-14 bg-gradient-to-r from-primary to-orange-600 hover:opacity-90 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 group"
              >
                 {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    Generate Content <ChevronRight className="h-4 w-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* SEO Matrix Panel */}
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center">
                <Layout className="h-4 w-4 text-primary rotate-90" />
              </div>
              <h3 className="text-sm font-black text-slate-900">SEO & Settings</h3>
            </div>

            {/* Permalink */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-3 w-3 text-slate-400" />
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Link (Slug)</label>
                </div>
                <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-widest">Auto</span>
              </div>
              <div className="relative">
                <Input 
                  placeholder="clean-url-slug" 
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="h-12 bg-[#F8FAFC] border border-slate-100 rounded-xl text-xs font-medium pl-[60px] text-slate-500 focus-visible:ring-1 focus-visible:ring-primary/30"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-300">/blog/</span>
              </div>
              <p className="text-[8px] italic text-slate-400 leading-tight"> * Automated human-readable for maximum SEO authority.</p>
            </div>

            {/* Meta Title */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="h-3 w-3 text-slate-400" />
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Meta Title</label>
                </div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{formData.metaTitle.length}/60</span>
              </div>
              <Input 
                placeholder="Enter SEO title..." 
                value={formData.metaTitle}
                onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                className="h-12 bg-white border border-slate-200 rounded-xl text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-3 w-3 text-slate-400" />
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Meta Description</label>
                </div>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{formData.metaDescription.length}/150</span>
              </div>
              <Textarea 
                placeholder="Summarize for Google snippets..." 
                value={formData.metaDescription}
                onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                className="min-h-[100px] bg-[#F8FAFC] border border-slate-100 rounded-xl text-xs font-medium p-4 focus-visible:ring-1 focus-visible:ring-primary/30 resize-none"
              />
            </div>

            {/* Keywords */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="h-3 w-3 text-slate-400" />
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Keywords</label>
              </div>
              <Input 
                placeholder="comma, separated, keywords" 
                value={formData.seoKeywords}
                onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})}
                className="h-12 bg-white border border-slate-200 rounded-xl text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary/30"
              />
            </div>
            
            {/* Category Support */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-slate-400" />
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Category Map</label>
              </div>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white border border-slate-200 rounded-xl h-12 px-4 text-xs font-bold uppercase tracking-widest text-slate-900 outline-none focus-visible:ring-1 focus-visible:ring-primary/30 appearance-none"
              >
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Intelligence</option>
                  <option>Future</option>
              </select>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

