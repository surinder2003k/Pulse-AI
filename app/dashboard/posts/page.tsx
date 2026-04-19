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

import { ConfirmationModal } from "@/components/ConfirmationModal";

export default function DashboardPostsPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant: "danger" | "primary";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "danger"
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
    if (onConfirm) {
      setModalConfig({
        isOpen: true,
        title,
        description: message,
        onConfirm,
        variant: type === "error" || title.toLowerCase().includes("delete") || title.toLowerCase().includes("purge") ? "danger" : "primary"
      });
    } else {
      if (type === "success") toast.success(`${title}: ${message}`);
      else if (type === "error") toast.error(`${title}: ${message}`);
      else toast.info(`${title}: ${message}`);
    }
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
      `Are you sure you want to permanently delete these ${selectedIds.size} assets? This operation cannot be undone.`,
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
        toast.success("Batch assets successfully scrubbed.");
      } else {
        toast.error("Bulk purge command failed.");
      }
    } catch {
      toast.error("Network synchronization failure.");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const handleDeleteClick = (post: Post) => {
    showAlert(
      "error", 
      "Delete Asset?", 
      `Permanently purge "${post.title}" from the neural network?`,
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
        toast.success("Asset successfully eliminated.");
      } else {
        toast.error("Elimination sequence failed.");
      }
    } catch {
      toast.error("Interface link lost.");
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
    <div className="space-y-6 pb-20 p-4 md:p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none text-slate-900">Content <span className="text-primary">Library</span></h1>
          <div className="flex items-center gap-2 mt-3">
             <div className="w-6 h-[2px] bg-primary" />
             <p className="text-slate-400 font-bold text-[9px] tracking-[0.4em] uppercase">Security Level: Administrative</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedIds.size > 0 && (
            <Button 
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="rounded-xl h-12 px-6 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-[9px] shadow-sm transition-all active:scale-95"
            >
              {isBulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Purge ({selectedIds.size})
            </Button>
          )}
          <Link href="/dashboard/create">
            <Button className="rounded-xl h-12 px-6 bg-white hover:bg-slate-50 text-gray-900 border border-slate-200 font-bold uppercase tracking-widest text-[9px] shadow-sm transition-all active:scale-95">
              <Plus className="h-4 w-4 mr-2 text-primary" /> New Asset
            </Button>
          </Link>
        </div>
      </div>

      {/* Asset Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden w-full">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <Table className="w-full">
            <TableHeader className="border-b border-slate-100 bg-slate-50/50">
              <TableRow className="border-none hover:bg-transparent uppercase tracking-[0.1em] text-[9px] font-bold text-slate-500">
                <TableHead className="hidden sm:table-cell w-8 py-3 pl-2 text-center">#</TableHead>
                <TableHead className="hidden sm:table-cell w-8 py-3 px-1">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === posts.length && posts.length > 0} 
                    onChange={toggleSelectAll}
                    className="h-3.5 w-3.5 rounded border-slate-300 bg-white appearance-none cursor-pointer checked:bg-primary checked:border-primary transition-all"
                  />
                </TableHead>
                <TableHead className="py-3 pl-2 max-w-[200px]">Asset Identity</TableHead>
                <TableHead className="py-3 hidden md:table-cell w-24">Category</TableHead>
                <TableHead className="py-3 hidden sm:table-cell text-center w-24">Status</TableHead>
                <TableHead className="py-3 hidden lg:table-cell text-right pr-4 w-32">Timestamp</TableHead>
                <TableHead className="text-right pr-2 py-3 w-32">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || !user ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20">
                     <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        <span className="font-bold tracking-[0.2em] uppercase text-[9px] text-slate-400">Syncing...</span>
                     </div>
                  </TableCell>
                </TableRow>
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20">
                     <div className="max-w-xs mx-auto space-y-2 opacity-30">
                        <FileText className="h-8 w-8 mx-auto text-slate-400" />
                        <p className="font-bold uppercase tracking-widest text-[9px]">Repository Empty</p>
                     </div>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post, index) => {
                  const postId = (post._id || post.id) as string;
                  const isSelected = selectedIds.has(postId);
                  const isDeleting = actionLoading === postId + "_delete";
                  const isTogglingStatus = actionLoading === postId + "_status";
                  return (
                    <TableRow key={postId} className={`border-b border-slate-50 transition-all group ${isSelected ? 'bg-primary/[0.02]' : 'hover:bg-slate-50/50'}`}>
                      <TableCell className="hidden sm:table-cell pl-4 py-4 text-center text-[10px] font-medium text-slate-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell px-2 py-4">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelect(postId)}
                          className="h-3.5 w-3.5 rounded border-slate-300 bg-white appearance-none cursor-pointer checked:bg-primary checked:border-primary transition-all"
                        />
                      </TableCell>
                      <TableCell className="py-4 pl-4 w-full sm:w-auto">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                            <Image 
                              src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"} 
                              alt={post.title} 
                              fill 
                              className="object-cover" 
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                             <span className="font-bold text-sm tracking-tight text-slate-900 truncate max-w-[180px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[500px]">{post.title}</span>
                             <span className="text-[9px] font-medium text-slate-400 truncate uppercase tracking-wider max-w-[180px] sm:max-w-[250px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[500px]">{post.slug}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell py-4">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 py-0.5 bg-slate-100 rounded border border-slate-200/50 text-nowrap">
                           {post.category || "General"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            post.status === "published" ? "bg-primary animate-pulse shadow-[0_0_8px_rgba(255,51,51,0.5)]" : "bg-slate-300"
                          )} />
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-widest",
                            post.status === "published" ? "text-primary" : "text-slate-400"
                          )}>
                            {post.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell py-4 text-[9px] text-slate-400 font-medium uppercase tracking-tight text-right pr-4">
                         {formatDate((post.createdAt || post.published_at || post.created_at || "") as string)}
                      </TableCell>
                      <TableCell className="text-right pr-4 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                             <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                <ExternalLink className="h-3.5 w-3.5" />
                             </Button>
                          </Link>
                          <Link href={`/dashboard/edit/${post.slug}`}>
                             <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                                <Pencil className="h-3.5 w-3.5" />
                             </Button>
                          </Link>
                          <Button
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 rounded-md text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                            onClick={() => handleToggleStatus(post)}
                            disabled={isTogglingStatus || isDeleting}
                          >
                            {isTogglingStatus ? <Loader2 className="h-3 w-3 animate-spin" /> : post.status === "published" ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7 rounded-md text-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            onClick={() => handleDeleteClick(post)}
                            disabled={isDeleting || isTogglingStatus}
                          >
                            {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        variant={modalConfig.variant}
      />
    </div>
  );
}
