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

      <div className="rounded-2xl border border-white/5 bg-secondary/20 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">User</TableHead>
              <TableHead className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Email</TableHead>
              <TableHead className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Role</TableHead>
              <TableHead className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold">Joined</TableHead>
              <TableHead className="text-right text-muted-foreground uppercase text-[10px] tracking-widest font-bold px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  {user.name}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "accent" : "secondary"}>
                    {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.created_at}</TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex items-center justify-end gap-2">
                    {/* Role Toggle Button */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={updatingId === user.id || user.id === currentUserId || user.email === "xyzg135@gmail.com"}
                      className={cn(
                        "h-8 w-8 rounded-lg transition-all",
                        user.role === 'admin' 
                          ? "text-primary hover:text-primary/80 hover:bg-primary/10" 
                          : "text-muted-foreground hover:text-white hover:bg-white/10"
                      )}
                      onClick={() => toggleRole(user)}
                    >
                      {updatingId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : user.role === 'admin' ? (
                        <UserIcon className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Delete Button */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={deletingId === user.id || user.id === currentUserId || user.email === "xyzg135@gmail.com"}
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(user)}
                    >
                      {deletingId === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
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
