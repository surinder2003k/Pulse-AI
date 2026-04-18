"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, FileText, EyeOff, Eye, Loader2, Pencil, Plus, Zap, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate, cn } from "@/lib/utils";
import { toast } from "sonner";
import PremiumAlert from "@/components/PremiumAlert";

interface Post {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  status: string;
  created_at?: string;
  createdAt?: string;
  published_at?: string;
  slug: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  feature_image_url?: string;
}

export default function DashboardPostsPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Alert State
  const [alert, setAlert] = useState<{
    isVisible: boolean;
    type: "success" | "error" | "info";
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isVisible: false,
    type: "success",
    title: "",
    message: ""
  });

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data || []);
    } catch {
      toast.error("COMMUNICATION ERROR: DATA LINK FAILED");
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (type: "success" | "error" | "info", title: string, message: string, onConfirm?: () => void) => {
    setAlert({ isVisible: true, type, title, message, onConfirm });
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === posts.length && posts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(posts.map(p => (p._id || p.id) as string)));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    
    showAlert(
      "error", 
      "Execute Bulk Purge?", 
      `Confirming the permanent deletion of ${selectedIds.size} network assets. This action is irreversible.`,
      executeBulkDelete
    );
  };

  const executeBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (res.ok) {
        setPosts(prev => prev.filter(p => !selectedIds.has((p._id || p.id) as string)));
        setSelectedIds(new Set());
        showAlert("success", "Purge Complete", "The selected assets have been scrubbed from the network.");
      } else {
        showAlert("error", "Purge Failed", "Terminal error during bulk deletion command.");
      }
    } catch {
      showAlert("error", "Network Error", "Command failed to propagate through the system.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteClick = (post: Post) => {
    showAlert(
      "error", 
      "Delete Asset?", 
      `Permanently purge "${post.title}"?`,
      () => executeSingleDelete(post)
    );
  };

  const executeSingleDelete = async (post: Post) => {
    const postId = post._id || post.id;
    if (!postId) return;

    setActionLoading(postId + "_delete");
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(prev => prev.filter(p => (p._id || p.id) !== postId));
        const newSelected = new Set(selectedIds);
        newSelected.delete(postId);
        setSelectedIds(newSelected);
        showAlert("success", "Purged", "The story has been eliminated.");
      } else {
        showAlert("error", "Purge Error", "Failed to delete the individual asset.");
      }
    } catch {
      showAlert("error", "Interface Error", "Could not complete the delete request.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const postId = post._id || post.id;
    if (!postId) return;
    const newStatus = post.status === "published" ? "draft" : "published";

    setActionLoading(postId + "_status");
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title, excerpt: post.excerpt, content: post.content,
          category: post.category, status: newStatus
        }),
      });
      if (res.ok) {
        toast.success(`PROTOCAL UPDATE: ${newStatus.toUpperCase()}`);
        setPosts(prev => prev.map(p => (p._id || p.id) === postId ? { ...p, status: newStatus } : p));
      } else {
        toast.error("PROTOCOL FAILURE");
      }
    } catch {
      toast.error("TERMINAL ERROR");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-12 pb-20 p-6 md:p-10">
      <PremiumAlert 
        isVisible={alert.isVisible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
        onConfirm={alert.onConfirm}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-200 pb-10">
        <div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-primary">Content <span className="text-slate-300 group-hover:text-gray-900 transition-colors duration-500 italic">Library</span></h1>
          <div className="flex items-center gap-3 mt-4">
             <div className="w-8 h-[2px] bg-primary" />
             <p className="text-slate-400 font-black text-[10px] tracking-[0.6em] uppercase">Network Management Terminal 2.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {selectedIds.size > 0 && (
            <Button 
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="rounded-2xl h-16 px-10 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] shadow-glow-red transition-all active:scale-95"
            >
              {isBulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Execute Purge ({selectedIds.size})
            </Button>
          )}
          <Link href="/dashboard/create">
            <Button className="rounded-2xl h-16 px-10 bg-white hover:bg-slate-50 text-gray-900 border border-slate-200 font-black uppercase tracking-widest text-[10px] shadow-sm transition-all active:scale-95">
              <Plus className="h-5 w-5 mr-3 text-primary" /> Initiate New Asset
            </Button>
          </Link>
        </div>
      </div>

      {/* Asset Table */}
      <div className="rounded-[3rem] border border-slate-200 bg-white overflow-hidden shadow-premium">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent uppercase tracking-[0.4em] text-[10px] font-black italic text-slate-400">
                <TableHead className="w-16 py-8 px-10">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === posts.length && posts.length > 0} 
                    onChange={toggleSelectAll}
                    className="h-6 w-6 rounded-lg border-2 border-slate-200 bg-white appearance-none cursor-pointer checked:bg-primary checked:border-primary transition-all relative overflow-hidden shadow-sm"
                  />
                </TableHead>
                <TableHead className="py-8">Asset Title / Identifier</TableHead>
                <TableHead className="py-8">Domain</TableHead>
                <TableHead className="py-8 text-center">Frequency</TableHead>
                <TableHead className="py-8">Logged At</TableHead>
                <TableHead className="text-right px-10 py-8">Protocols</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || !user ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-40">
                     <div className="flex flex-col items-center gap-6 animate-pulse">
                        <Zap className="h-10 w-10 text-primary animate-bounce shadow-glow-red" />
                        <span className="font-black tracking-[0.5em] uppercase text-xs text-slate-300">Establishing Satellite Link...</span>
                     </div>
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-40">
                     <div className="max-w-xs mx-auto space-y-4 opacity-30">
                        <FileText className="h-12 w-12 mx-auto" />
                        <p className="font-black uppercase tracking-widest text-sm italic">Library Empty</p>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => {
                  const postId = (post._id || post.id) as string;
                  const isSelected = selectedIds.has(postId);
                  const isDeleting = actionLoading === postId + "_delete";
                  const isTogglingStatus = actionLoading === postId + "_status";
                  return (
                    <TableRow key={postId} className={`border-slate-100 transition-all group ${isSelected ? 'bg-primary/5' : 'hover:bg-slate-50/50'}`}>
                      <TableCell className="px-10 py-8">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelect(postId)}
                          className="h-6 w-6 rounded-lg border-2 border-slate-200 bg-white appearance-none cursor-pointer checked:bg-primary checked:border-primary transition-all shadow-sm"
                        />
                      </TableCell>
                      <TableCell className="max-w-[400px] py-10">
                        <div className="flex items-center gap-8">
                          <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm">
                            <Image 
                              src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"} 
                              alt={post.title} 
                              fill 
                              className="object-cover grayscale-0 opacity-100 transition-all duration-700 group-hover:scale-110" 
                            />
                          </div>
                          <div className="space-y-2">
                             <span className="font-black text-xl tracking-tight uppercase italic group-hover:text-primary transition-colors block leading-none text-gray-900">{post.title}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{post.slug}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-black border-slate-200 text-slate-500 uppercase tracking-[0.2em] px-4 py-1.5 rounded-full bg-slate-50">
                           {post.category || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[10px] font-black uppercase border-none px-4 py-1.5 rounded-full transition-all shadow-sm",
                          post.status === "published" ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] text-slate-400 font-black uppercase tracking-tighter italic">
                         {formatDate((post.createdAt || post.published_at || post.created_at || "") as string)}
                      </TableCell>
                      <TableCell className="text-right px-10">
                        <div className="flex items-center justify-end gap-3 opacity-40 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                             <button className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-gray-900 hover:border-slate-300 transition-all shadow-sm active:scale-95">
                                <ExternalLink className="h-5 w-5" />
                             </button>
                          </Link>
                          <Link href={`/dashboard/edit/${post.slug}`}>
                             <button className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-gray-900 hover:border-slate-300 transition-all shadow-sm active:scale-95">
                                <Pencil className="h-5 w-5" />
                             </button>
                          </Link>
                          <button
                            className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm active:scale-95"
                            onClick={() => handleToggleStatus(post)}
                            disabled={isTogglingStatus || isDeleting}
                          >
                            {isTogglingStatus ? <Loader2 className="h-5 w-5 animate-spin" /> : post.status === "published" ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                          <button
                            className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-95"
                            onClick={() => handleDeleteClick(post)}
                            disabled={isDeleting || isTogglingStatus}
                          >
                            {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
