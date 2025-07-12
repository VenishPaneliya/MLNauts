import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Menu, 
  X, 
  User, 
  ShirtIcon, 
  Crown, 
  HelpCircle, 
  RefreshCw, 
  LayoutDashboard, 
  Upload,
  ChevronDown,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserEntity } from "@/entities/User";

const navigationItems = [
  { title: "Men", url: createPageUrl("Browse?category=men"), icon: ShirtIcon },
  { title: "Women", url: createPageUrl("Browse?category=women"), icon: ShirtIcon },
  { title: "Accessories", url: createPageUrl("Browse?category=accessories"), icon: Crown },
  { title: "Earn More Points", url: createPageUrl("EarnPoints"), icon: RefreshCw },
  { title: "Help", url: createPageUrl("Help"), icon: HelpCircle },
  { title: "My Swaps", url: createPageUrl("MySwaps"), icon: RefreshCw },
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Upload Item", url: createPageUrl("Upload"), icon: Upload },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isLandingPage = currentPageName === "Landing";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await UserEntity.me();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const handleLogin = async () => {
    try {
      await UserEntity.login();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await UserEntity.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50">
      <style>{`
        :root {
          --rewear-sage: #9caf88;
          --rewear-terracotta: #d4a574;
          --rewear-beige: #f5f1eb;
          --rewear-earth: #8b7355;
          --rewear-cream: #faf8f5;
        }
        
        .rewear-gradient {
          background: linear-gradient(135deg, var(--rewear-cream) 0%, var(--rewear-beige) 100%);
        }
        
        .rewear-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(156, 175, 136, 0.1);
          box-shadow: 0 8px 32px rgba(139, 115, 85, 0.08);
        }
        
        .rewear-button {
          background: linear-gradient(135deg, var(--rewear-sage) 0%, var(--rewear-earth) 100%);
          color: white;
          transition: all 0.3s ease;
        }
        
        .rewear-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(156, 175, 136, 0.3);
        }
        
        .logo-transition {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sidebar-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Top Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-b border-stone-200' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className={`logo-transition ${
            scrolled 
              ? 'text-2xl font-bold' 
              : isLandingPage 
                ? 'text-6xl font-bold absolute left-1/2 transform -translate-x-1/2' 
                : 'text-3xl font-bold'
          }`}>
            <Link 
              to={createPageUrl("Landing")} 
              className="font-serif text-transparent bg-gradient-to-r from-stone-600 to-amber-700 bg-clip-text hover:from-stone-700 hover:to-amber-800 transition-all duration-300"
            >
              ReWear
            </Link>
          </div>

          {/* Menu Toggle & Auth */}
          <div className="flex items-center gap-4">
            {!isLandingPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-stone-600 hover:text-stone-800 hover:bg-stone-100"
              >
                {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </Button>
            )}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-stone-600 hover:text-stone-800">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-300 to-amber-300 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden md:block">{user.full_name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Dashboard")}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")}>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleLogin} className="text-stone-600 border-stone-300 hover:bg-stone-50">
                  Sign In
                </Button>
                <Button onClick={handleLogin} className="rewear-button">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {!isLandingPage && (
        <aside className={`fixed left-0 top-0 h-full z-40 pt-20 rewear-card sidebar-transition ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-stone-100 group ${
                  location.pathname === item.url ? 'bg-gradient-to-r from-stone-100 to-amber-50 text-stone-800' : 'text-stone-600'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="font-medium group-hover:text-stone-800 transition-colors">
                    {item.title}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className={${!isLandingPage ? (sidebarCollapsed ? 'ml-16' : 'ml-64') : ''} pt-20 transition-all duration-300}>
        {children}
      </main>
    </div>
  );
}
