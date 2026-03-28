"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ExternalLink, FileText, EyeOff, Eye, Loader2, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Post {
  _id?: string;
  id?: string;
  title: string;
  category: string;
  status: string;
  views: number;
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
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

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
      toast.error("Failed to fetch stories");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const postId = deleteTarget._id || deleteTarget.id;
    if (!postId) return;

    setActionLoading(postId + "_delete");
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Post deleted successfully");
        setPosts(prev => prev.filter(p => (p._id || p.id) !== postId));
      } else {
        toast.error(data.error || "Failed to delete post");
      }
    } catch {
      toast.error("Error deleting post");
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
        toast.success(`Post ${newStatus === "published" ? "published ✅" : "unpublished"}`);
        setPosts(prev => prev.map(p => (p._id || p.id) === postId ? { ...p, status: newStatus } : p));
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Error updating post status");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
          {/* Modal */}
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setDeleteTarget(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">Delete Post?</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  You are about to permanently delete:
                </p>
                <p className="mt-1 text-sm font-bold text-white/90 line-clamp-2">
                  &ldquo;{deleteTarget.title}&rdquo;
                </p>
                <p className="mt-2 text-xs text-red-400/80">This action cannot be undone.</p>
              </div>
              <div className="flex w-full gap-3 mt-2">
                <Button
                  variant="ghost"
                  className="flex-1 rounded-2xl border border-white/10 hover:bg-white/5 font-bold"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black border-0 shadow-[0_4px_20px_rgba(239,68,68,0.3)] active:shadow-none active:translate-y-px transition-all"
                  onClick={confirmDelete}
                >
                  Yes, Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black italic">My Stories</h1>
          <p className="text-muted-foreground mt-1 font-medium">Manage your library of AI-powered content.</p>
        </div>
        <Link href="/dashboard/create">
          <Button className="rounded-2xl h-11 px-6 bg-primary hover:bg-primary/90 text-white gap-2 font-black uppercase tracking-widest text-[10px]">
            New Post
          </Button>
        </Link>
      </div>

      <div className="rounded-3xl border border-white/5 bg-secondary/10 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent uppercase tracking-widest text-[10px]">
              <TableHead className="py-4">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-muted-foreground animate-pulse font-bold tracking-widest">
                  Loading Library...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20">
                  <div className="flex flex-col items-center gap-4">
                    <FileText className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-muted-foreground italic">No stories found. Start your journey with AI.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => {
                const postId = post._id || post.id;
                const isDeleting = actionLoading === postId + "_delete";
                const isTogglingStatus = actionLoading === postId + "_status";
                return (
                  <TableRow key={postId} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="max-w-[300px]">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-white/10 bg-secondary/50">
                          <Image 
                            src={post.feature_image_url || "https://images.unsplash.com/photo-1677442136019-21780ecad995"} 
                            alt={post.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        <span className="font-bold truncate" title={post.title}>{post.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary uppercase">
                        {post.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-bold uppercase border-none ${post.status === "published" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-400"}`}>
                        {post.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{post.views || 0}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate((post.createdAt || post.published_at || post.created_at || "") as string)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-white" title="View post">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 hover:text-yellow-400"
                          title={post.status === "published" ? "Unpublish" : "Publish"}
                          onClick={() => handleToggleStatus(post)}
                          disabled={isTogglingStatus || isDeleting}
                        >
                          {isTogglingStatus
                            ? <Loader2 className="h-4 w-4 animate-spin" />
                            : post.status === "published"
                              ? <EyeOff className="h-4 w-4" />
                              : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="h-8 w-8 hover:text-red-500"
                          onClick={() => setDeleteTarget(post)}
                          disabled={isDeleting || isTogglingStatus}
                          title="Delete post"
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
