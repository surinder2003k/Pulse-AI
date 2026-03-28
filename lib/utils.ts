import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import slugifyLib from "slugify"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  })
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function formatDate(date: string | Date | undefined | null) {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


export const ADMIN_EMAIL = "xyzg135@gmail.com";
