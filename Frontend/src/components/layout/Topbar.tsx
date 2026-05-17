import { Bell, Search, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function Topbar({ title, onMenu }: { title: string; onMenu?: () => void }) {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
  });

  return (
    <header className="sticky top-0 z-30 h-16 glass-strong border-b border-border">
      <div className="h-full flex items-center justify-between px-4 lg:px-8 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="lg:hidden p-2 rounded-lg hover:bg-accent/30">
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Live overview · {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search farmers, lands, schemes…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/notifications" className="relative p-2 rounded-xl glass glow-hover">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-warning animate-pulse" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold leading-tight">{user?.name || 'Admin'}</div>
              <div className="text-xs text-muted-foreground uppercase">{user?.role || 'Officer'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
