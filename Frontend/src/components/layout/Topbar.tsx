import { useState } from "react";
import { Bell, Search, Menu, ArrowLeft, Bot, CloudRain, Sun, ChevronDown, LogOut } from "lucide-react";
import { Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function Topbar({ title, onMenu }: { title: string; onMenu?: () => void }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data.data;
    },
  });

  return (
    <header className="sticky top-0 z-30 h-16 glass-strong border-b border-border backdrop-blur-2xl">
      <div className="h-full flex items-center justify-between px-4 lg:px-8 gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="lg:hidden p-2 rounded-lg hover:bg-accent/30">
            <Menu className="h-5 w-5" />
          </button>
          <button
            id="topbar-back-btn"
            onClick={() => router.history.back()}
            className="p-2 rounded-xl glass glow-hover transition-all hover:scale-105 hover:text-primary"
            title="Go back"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">{title}</h1>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-0.5">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live System</span>
              <span className="hidden sm:inline">· {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2 flex-1 max-w-lg shadow-inner">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Smart Search: Command AI, farmers, lands, schemes…"
            className="bg-transparent outline-none text-sm flex-1 placeholder:text-muted-foreground/70"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border/60 rounded px-1.5 py-0.5 bg-background/50">⌘K</kbd>
        </div>

        <div className="flex items-center gap-3">
          {/* Weather Widget */}
          <div className="hidden lg:flex items-center gap-2 glass rounded-xl px-3 py-1.5 mr-2">
            <CloudRain className="h-4 w-4 text-info" />
            <span className="text-xs font-medium">24°C</span>
            <div className="w-px h-3 bg-border mx-1"></div>
            <Sun className="h-4 w-4 text-warning" />
            <span className="text-xs font-medium text-muted-foreground">Clear</span>
          </div>

          <button className="p-2 rounded-xl bg-gradient-primary glow text-primary-foreground hover:scale-105 transition-all group relative">
            <Bot className="h-4 w-4 group-hover:animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-foreground"></span>
            </span>
          </button>

          <Link to="/notifications" className="relative p-2 rounded-xl glass glow-hover">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive animate-pulse shadow-[0_0_8px_var(--color-destructive)]" />
          </Link>
          
          <div className="w-px h-6 bg-border mx-1 hidden sm:block"></div>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
              aria-expanded={showDropdown}
              aria-haspopup="true"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md relative">
                {user?.name?.[0]?.toUpperCase() || 'U'}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold leading-tight">{user?.name || 'Loading...'}</div>
                <div className="text-[10px] text-primary uppercase tracking-wider font-medium mt-0.5">{user?.role || ''}</div>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block ml-1" />
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
                <div className="absolute right-0 top-12 mt-2 w-56 rounded-xl glass-strong border border-border p-2 shadow-xl z-50 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                  <div className="px-3 py-2 border-b border-border/50 mb-1.5">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">User Profile</div>
                    <div className="text-sm font-semibold text-foreground truncate mt-1">{user?.name || 'User'}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{user?.email || ''}</div>
                  </div>
                  <div className="px-3 py-1 flex items-center gap-2 mb-2">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">{user?.role || 'User'} Dashboard</span>
                  </div>
                  <button
                    onClick={async () => {
                      setShowDropdown(false);
                      try {
                        await api.post("/auth/logout");
                      } catch (err) {
                        console.error("Logout request failed", err);
                      }
                      localStorage.removeItem("token");
                      localStorage.removeItem("userRole");
                      window.location.href = "/login";
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
