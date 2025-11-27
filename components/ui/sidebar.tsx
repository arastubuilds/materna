"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, PlusCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/posts", label: "Posts", icon: FileText },
  { href: "/posts/add", label: "Add Post", icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 max-h-screen bg-white border-r shadow-sm hidden md:flex flex-col p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pink-600 tracking-tight">
          Materna
        </h1>
        <p className="text-s text-gray-500 mt-1">Maternal Health Assistant</p>
      </div>

      <nav className="flex flex-col space-y-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-pink-100 text-pink-700"
                  : "text-gray-700 hover:bg-pink-100 hover:text-pink-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-pink-50 rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
