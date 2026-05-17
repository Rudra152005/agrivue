import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { motion } from "framer-motion";

export function AppLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen grid-bg">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar title={title} />
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="px-4 lg:px-8 py-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
