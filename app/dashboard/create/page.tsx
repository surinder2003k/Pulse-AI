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
  Pen
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PremiumAlert from "@/components/PremiumAlert";
import Dropzone from "@/components/Dropzone";
import RichTextEditor from "@/components/RichTextEditor";
import RichTextEditor from "@/components/RichTextEditor";

export default function CreatePostPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      
      setGeneratedPostId(data._id || null);
      setFormData({
        title: data.title || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        category: data.category || "Technology",
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
        seoKeywords: data.seoKeywords || data.meta_keywords || "",
        focusKeyword: data.focus_keyword || "",
        metaTitle: data.meta_title || data.metaTitle || "",
        metaDescription: data.meta_description || data.metaDescription || "",
        featureImage: data.feature_image_url || data.featureImage || "",
        featureImageAlt: data.feature_image_alt || data.image_alt || data.title || ""
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
    if (!formData.title) return toast.error("IDENTITY (TITLE) IS REQUIRED.");
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
      <PremiumAlert 
        isVisible={alert.isVisible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-primary/5 rounded-lg border border-primary/10">
            <Pen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Intelligence Forge</h1>
            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Post Construction Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-10 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 rounded-lg"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPublishing} 
            className="h-10 px-8 bg-primary hover:bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Deploy Post
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Editor (70%) */}
        <div className="flex-1 overflow-y-auto p-10 lg:p-14 custom-scrollbar lg:border-r border-slate-200">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Main Identity (Title)</label>
               <Input 
                 placeholder="ENTER HEADLINE..." 
                 value={formData.title}
                 onChange={(e) => setFormData({...formData, title: e.target.value})}
                 className="h-16 text-3xl font-black bg-transparent border-none px-0 focus-visible:ring-0 placeholder:text-slate-200 uppercase"
               />
               <div className="h-[1px] w-full bg-slate-100" />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Contextual Excerpt</label>
               <Textarea 
                 placeholder="BRIEF SUMMARY..." 
                 value={formData.excerpt}
                 onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                 className="min-h-[100px] text-lg font-medium bg-transparent border-none px-0 focus-visible:ring-0 placeholder:text-slate-200 resize-none"
               />
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Intel Manuscript</label>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                {mounted ? (
                  <RichTextEditor 
                    value={formData.content}
                    onChange={(val) => setFormData({...formData, content: val})}
                  />
                ) : (
                  <div className="h-96 w-full bg-slate-50 animate-pulse" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Assistant & Metadata (30%) */}
        <div className="w-full lg:w-[420px] bg-white overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-10">
            {/* Neural Assistant Section */}
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="p-6 bg-primary/[0.03] rounded-2xl border border-primary/10 space-y-6">
                 <div className="flex items-center gap-2">
                   <Sparkles className="h-4 w-4 text-primary" />
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Neural Synthesis</h3>
                 </div>
                 <div className="space-y-3">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Topic Blueprint</label>
                   <Textarea 
                     placeholder="SPECIFY RESEARCH TOPIC..." 
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     className="min-h-[160px] bg-white border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-300 uppercase p-4 focus:border-primary/50 transition-all"
                   />
                 </div>
                 <Button 
                   onClick={handleGenerate}
                   disabled={isGenerating}
                   className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-sm transition-all active:scale-95"
                 >
                   {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
                   Synthesize Asset
                 </Button>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-slate-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Classification</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl h-10 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-900 outline-none"
                    >
                      <option>Technology</option>
                      <option>Business</option>
                      <option>Intelligence</option>
                      <option>Future</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Keywords (CSV)</label>
                    <Input 
                      placeholder="TAGS..." 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="h-10 bg-slate-50 border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Section */}
            <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-slate-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">SEO Infrastructure</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Meta Title</label>
                  <Input 
                    placeholder="SEARCH VISIBILITY TITLE..." 
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                    className="h-10 bg-slate-50 border-slate-200 rounded-xl text-[10px] font-bold uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Focus Keyword</label>
                  <Input 
                    placeholder="PRIMARY TARGET..." 
                    value={formData.focusKeyword}
                    onChange={(e) => setFormData({...formData, focusKeyword: e.target.value})}
                    className="h-10 bg-slate-50 border-slate-200 rounded-xl text-[10px] font-bold uppercase"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Meta Description</label>
                  <Textarea 
                    placeholder="SNIPPET..." 
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                    className="min-h-[80px] bg-slate-50 border-slate-200 rounded-xl text-[10px] font-bold p-3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SEO Tags</label>
                  <Input 
                    placeholder="SEARCH TERMS..." 
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData({...formData, seoKeywords: e.target.value})}
                    className="h-10 bg-slate-50 border-slate-200 rounded-xl text-[10px] font-bold uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Visual Assets Section */}
            <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-slate-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Visual Assets</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Manual Upload</label>
                  <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden hover:border-primary/30 transition-all">
                    <Dropzone 
                      onUpload={(url) => setFormData({...formData, featureImage: url})} 
                      currentImage={formData.featureImage} 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Unsplash Search</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="SEARCH..." 
                      value={imageSearchQuery}
                      onChange={(e) => setImageSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleImageSearch()}
                      className="h-10 bg-slate-50 border-slate-200 rounded-xl text-[10px] font-bold uppercase"
                    />
                    <Button onClick={handleImageSearch} disabled={isSearchingImage} className="h-10 w-10 p-0 bg-white border border-slate-200 hover:border-primary text-primary rounded-xl">
                      {isSearchingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                      {searchResults.map((url, i) => (
                        <div 
                          key={url}
                          onClick={() => setFormData({...formData, featureImage: url})}
                          className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${formData.featureImage === url ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-slate-300'}`}
                        >
                           <img src={url} alt="" className="w-full h-full object-cover" />
                           {formData.featureImage === url && (
                             <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                               <div className="bg-white rounded-full p-1 shadow-sm">
                                 <Zap className="h-3 w-3 text-primary" />
                               </div>
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

