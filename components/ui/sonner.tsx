"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:glass-premium group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-[1.5rem] group-[.toaster]:p-6 group-[.toaster]:font-black group-[.toaster]:uppercase group-[.toaster]:tracking-[0.1em] group-[.toaster]:text-[10px] group-[.toaster]:italic",
          description: "group-[.toaster]:text-white/40 group-[.toaster]:font-medium group-[.toaster]:mt-1",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:rounded-full group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:text-[9px] group-[.toast]:tracking-widest",
          cancelButton:
            "group-[.toast]:bg-white/5 group-[.toast]:text-white/60 group-[.toast]:rounded-full group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:text-[9px] group-[.toast]:tracking-widest",
          error: "group-[.toaster]:border-primary group-[.toaster]:bg-primary/10",
          success: "group-[.toaster]:border-primary group-[.toaster]:bg-primary/10",
          info: "group-[.toaster]:border-white/20 group-[.toaster]:bg-white/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
