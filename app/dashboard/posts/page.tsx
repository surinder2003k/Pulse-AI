"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, FileText, EyeOff, Eye, Loader2, AlertTriangle, X, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
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
          category: post.category, tags: post.tags || [],
          featureImage: post.feature_image_url, status: newStatus
        }),
      });
      if (res.ok) {
        toast.success(`STATUS: ${newStatus.toUpperCase()}`);
        setPosts(prev => prev.map(p => (p._id || p.id) === postId ? { ...p, status: newStatus } : p));
      } else {
        toast.error("PROTOCOL FAILURE: STATUS NOT UPDATED");
      }
    } catch {
      toast.error("TERMINAL ERROR");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <PremiumAlert 
        isVisible={alert.isVisible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert(prev => ({ ...prev, isVisible: false }))}
        onConfirm={alert.onConfirm}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Content <span className="text-primary tracking-normal italic">Library</span></h1>
          <p className="text-white/40 mt-4 font-black text-[10px] tracking-[0.4em] uppercase">Network Management Terminal 2.0</p>
        </div>
        <div className="flex items-center gap-4">
          {selectedIds.size > 0 && (
            <Button 
              onClick={handleBulkDelete}
              disabled={isBulkDeleting}
              className="rounded-full h-14 px-8 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 font-black flex items-center gap-2 uppercase tracking-widest text-[10px] transition-all"
            >
              {isBulkDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Purge ({selectedIds.size})
            </Button>
          )}
          <Link href="/dashboard/create">
            <Button className="rounded-full h-14 px-8 bg-white text-black hover:bg-white/90 gap-3 font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all active:scale-95">
              <Plus className="h-4 w-4" /> New Asset
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/5 bg-black/40 overflow-hidden glass-premium shadow-2xl">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-none hover:bg-transparent uppercase tracking-[0.3em] text-[9px] font-black italic opacity-60">
              <TableHead className="w-16 py-6 px-10">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size === posts.length && posts.length > 0} 
                  onChange={toggleSelectAll}
                  className="h-5 w-5 rounded-none border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary appearance-none cursor-pointer transition-all relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-primary after:scale-0 checked:after:scale-100 after:transition-transform"
                />
              </TableHead>
              <TableHead>Asset Title</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Logged</TableHead>
              <TableHead className="text-right px-10">Protocols</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-40 text-white/20 animate-pulse font-black tracking-[0.5em] uppercase text-xs">
                  SYNCHRONIZING WITH SERVER...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-40 italic text-white/30 font-bold uppercase tracking-widest text-xs">
                  LIBRARY EMPTY. INITIATE FIRST SEQUENCE.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => {
                const postId = (post._id || post.id) as string;
                const isSelected = selectedIds.has(postId);
                const isDeleting = actionLoading === postId + "_delete";
                const isTogglingStatus = actionLoading === postId + "_status";
                return (
                  <TableRow key={postId} className={`border-white/5 transition-all group ${isSelected ? 'bg-primary/5' : 'hover:bg-white/[0.02]'}`}>
                    <TableCell className="px-10">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelect(postId)}
                        className="h-5 w-5 rounded-none border-2 border-white/10 bg-transparent checked:bg-primary checked:border-primary appearance-none cursor-pointer transition-all"
                      />
                    </TableCell>
                    <TableCell className="max-w-[400px] py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/5 bg-white/5">
                          <Image 
                            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"} 
                            alt={post.title} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                        </div>
                        <span className="font-black text-lg tracking-tight uppercase group-hover:text-primary transition-colors cursor-default">{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-black border-white/10 text-white/60 uppercase tracking-widest px-3 py-1 rounded-full">{post.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] font-black uppercase border-none px-3 py-1 rounded-full ${post.status === "published" ? "bg-primary text-white glow-red" : "bg-white/10 text-white/40"}`}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] text-white/30 font-bold uppercase tracking-tighter italic">
                      {formatDate((post.createdAt || post.published_at || post.created_at || "") as string)}
                    </TableCell>
                    <TableCell className="text-right px-10">
                      <div className="flex items-center justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all duration-300">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white hover:text-black transition-all">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/edit/${post.slug}`}>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white hover:text-black transition-all">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost" size="icon"
                          className="h-10 w-10 rounded-full hover:bg-white hover:text-black transition-all"
                          onClick={() => handleToggleStatus(post)}
                          disabled={isTogglingStatus || isDeleting}
                        >
                          {isTogglingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : post.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-10 w-10 rounded-full hover:bg-primary hover:text-white transition-all glow-red-hover"
                          onClick={() => handleDeleteClick(post)}
                          disabled={isDeleting || isTogglingStatus}
                        >
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
    </div>
  );
}
