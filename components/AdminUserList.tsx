"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Shield, User as UserIcon, Loader2, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function AdminUserList({ 
  initialUsers, 
  currentUserId 
}: { 
  initialUsers: AdminUser[], 
  currentUserId?: string 
}) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const handleDeleteClick = (user: AdminUser) => {
    if (user.id === currentUserId) {
      toast.error("You cannot delete your own account!");
      return;
    }
    if (user.email === "xyzg135@gmail.com") {
      toast.error("Cannot delete the primary admin!");
      return;
    }
    setDeleteTarget(user);
  };

  const toggleRole = async (user: AdminUser) => {
    if (user.id === currentUserId) {
      toast.error("You cannot change your own role!");
      return;
    }
    if (user.email === "xyzg135@gmail.com") {
      toast.error("Cannot change the primary admin's role!");
      return;
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    setUpdatingId(user.id);

    try {
      const res = await fetch('/api/admin/role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, role: newRole })
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
        toast.success(`User ${newRole === 'admin' ? 'promoted to admin' : 'demoted to user'}!`);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update role");
      }
    } catch {
      toast.error("Error updating role");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    setDeletingId(deleteTarget.id);
    const id = deleteTarget.id;
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/admin/users?userId=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
        toast.success("User deleted successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete user");
      }
    } catch {
      toast.error("Error deleting user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setDeleteTarget(null)}
          />
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
                <h2 className="text-xl font-black tracking-tight">Delete User?</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  You are about to permanently delete:
                </p>
                <p className="mt-1 text-sm font-bold text-white/90 line-clamp-2">
                  &ldquo;{deleteTarget.email}&rdquo;
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

      <div className="rounded-[2.5rem] border border-white/5 bg-secondary/5 overflow-hidden shadow-skeuo-in">
        <Table>
          <TableHeader className="bg-black/40">
            <TableRow className="hover:bg-transparent border-white/5 uppercase tracking-[0.4em] text-[10px] font-black italic">
              <TableHead className="py-8 px-10 text-white/30">Identifier</TableHead>
              <TableHead className="py-8 text-white/30">Network Node (Email)</TableHead>
              <TableHead className="py-8 text-white/30">Clearance</TableHead>
              <TableHead className="py-8 text-white/30">Uplinked</TableHead>
              <TableHead className="text-right py-8 px-10 text-white/30">Protocols</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                <TableCell className="px-10 py-8">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center border border-white/10 shadow-skeuo-button group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                      <UserIcon className="h-5 w-5 text-white/40 group-hover:text-primary transition-colors" />
                    </div>
                    <span className="font-black text-lg text-white group-hover:text-primary transition-colors italic uppercase tracking-tighter">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-white/40 font-bold text-xs uppercase tracking-widest">{user.email}</TableCell>
                <TableCell>
                  <Badge className={cn(
                    "text-[10px] font-black uppercase border-none px-4 py-1.5 rounded-full shadow-skeuo-button transition-all",
                    user.role === "admin" ? "bg-primary text-white glow-red" : "bg-white/10 text-white/40"
                  )}>
                    {user.role === "admin" && <Shield className="h-3 w-3 mr-2" />}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-[10px] text-white/20 font-black uppercase tracking-tighter italic">
                  {user.created_at}
                </TableCell>
                <TableCell className="text-right px-10">
                  <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    {/* Role Toggle Button */}
                    <button 
                      disabled={updatingId === user.id || user.id === currentUserId || user.email === "xyzg135@gmail.com"}
                      className="h-12 w-12 rounded-xl bg-secondary/20 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all shadow-skeuo-button active:shadow-skeuo-button-pressed disabled:opacity-20 disabled:cursor-not-allowed"
                      onClick={() => toggleRole(user)}
                      title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                    >
                      {updatingId === user.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : user.role === 'admin' ? (
                        <UserIcon className="h-5 w-5" />
                      ) : (
                        <Shield className="h-5 w-5" />
                      )}
                    </button>
 
                    {/* Delete Button */}
                    <button 
                      disabled={deletingId === user.id || user.id === currentUserId || user.email === "xyzg135@gmail.com"}
                      className="h-12 w-12 rounded-xl bg-red-950/20 border border-red-500/10 flex items-center justify-center text-red-500/40 hover:text-primary hover:border-primary/30 transition-all shadow-skeuo-button active:shadow-skeuo-button-pressed disabled:opacity-20 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteClick(user)}
                      title="Purge User"
                    >
                      {deletingId === user.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

