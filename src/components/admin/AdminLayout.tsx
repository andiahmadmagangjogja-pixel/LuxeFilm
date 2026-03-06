import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  LogOut, 
  ExternalLink, 
  Settings,
  UserCircle, 
  Database,
  DollarSign,
  MessageSquare,
  Calendar,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Star,
  ListOrdered,
  HelpCircle
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

function GroupTitle({ title, collapsed }: { title: string; collapsed: boolean }) {
  return (
    <p 
      className={`px-4 pt-6 pb-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
        collapsed 
          ? "hidden" 
          : "text-violet-900/40"
      }`}
    >
      {title}
    </p>
  );
}

function NavItem({ 
  to, 
  icon, 
  label,
  collapsed,
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string;
  collapsed: boolean;
}) {
  const activeClasses =
    "bg-gradient-to-r from-violet-600 to-indigo-700 text-white " +
    "shadow-[0_4px_12px_rgba(139,92,246,0.25)] relative " +
    "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 " +
    "before:h-5 before:w-1 before:bg-white before:rounded-r-full";
  
  const inactiveClasses = 
    "text-slate-600 hover:bg-violet-50/60 hover:text-violet-800";

  const content = (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
          isActive ? activeClasses : inactiveClasses
        } w-full`
      }
    >
      <div className="p-1.5 rounded-lg bg-slate-100/80 group-hover:bg-violet-100/80 transition-colors">
        {icon}
      </div>
      {!collapsed && (
        <span className="truncate flex-1">
          {label}
        </span>
      )}
      {!collapsed && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full transition-all duration-300 bg-white/80 animate-pulse" />
      )}
    </NavLink>
  );

  return collapsed ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" align="center" sideOffset={10}>
          <span className="text-xs font-medium">{label}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : content;
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
      <aside 
        className={`
          flex flex-col bg-white border-r border-slate-200 shadow-xl
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-72"}
          shrink-0
          relative
          overflow-y-auto
        `}
      >
        {/* FIXED: Brand Logo Area - Properly visible when collapsed */}
        <div className={`p-4 border-b border-slate-200 bg-gradient-to-b from-violet-50/70 to-transparent ${collapsed ? "py-3" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/15">
              <span className="text-white font-bold text-xl italic tracking-tight">L</span>
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h2 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-violet-700 tracking-tight">
                  Luxefilm
                </h2>
                <span className="text-violet-600 text-sm font-medium block mt-0.5">Control Center</span>
              </div>
            )}
          </div>
          
          {/* FIXED: Collapse button positioned INSIDE the sidebar */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`
              absolute top-3 right-3 
              w-6 h-6 rounded-full bg-white border border-slate-200 shadow-lg
              flex items-center justify-center text-slate-500 hover:text-violet-600
              hover:bg-violet-50 transition-all duration-300 z-10
              ${collapsed ? "rotate-180" : ""}
            `}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          <GroupTitle title="Main" collapsed={collapsed} />
          <NavItem collapsed={collapsed} to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />

          <GroupTitle title="Content" collapsed={collapsed} />
          <NavItem collapsed={collapsed} to="/admin/portfolio" icon={<Briefcase size={20} />} label="Portfolio" />
          <NavItem collapsed={collapsed} to="/admin/services" icon={<Settings size={20} />} label="Layanan" />
          <NavItem collapsed={collapsed} to="/admin/pricing" icon={<DollarSign size={20} />} label="Harga" />
          <NavItem collapsed={collapsed} to="/admin/testimonials" icon={<MessageSquare size={20} />} label="Testimoni " />

          <GroupTitle title="Management" collapsed={collapsed} />
          {/*<NavItem collapsed={collapsed} to="/admin/bookings" icon={<Calendar size={20} />} label="Booking" />*/}
          <NavItem collapsed={collapsed} to="/admin/faq" icon={<HelpCircle  size={20} />} label="FAQ" />
          <NavItem
  collapsed={collapsed}
  to="/admin/work-process"
  icon={<ListOrdered size={20} />}
  label="Work Process"
/>
<NavItem
  collapsed={collapsed}
  to="/admin/why-choose"
  icon={<Star size={20} />}
  label="Why Choose Us"
/>

<NavItem
  collapsed={collapsed}
  to="/admin/problems"
  icon={<AlertCircle size={20} />}
  label="Problems"
/>

          <GroupTitle title="System" collapsed={collapsed} />
          <NavItem collapsed={collapsed} to="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 backdrop-blur-sm mt-auto">
          <div className="flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      collapsed 
                        ? "justify-center hover:bg-violet-50" 
                        : "text-slate-600 hover:text-violet-700 hover:bg-violet-50/50"
                    }`}
                  >
                    <div className="p-1.5 bg-violet-50/80 rounded-lg">
                      <ExternalLink size={16} className="text-violet-500" />
                    </div>
                    {!collapsed && <span className="font-medium">Lihat Website</span>}
                  </a>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" align="center" sideOffset={10}>
                    <span className="text-xs font-medium">View Website</span>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <button
              onClick={logout}
              className={`flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium rounded-lg transition-all duration-200 ${
                collapsed
                  ? "justify-center hover:bg-rose-50"
                  : "text-rose-600 hover:bg-rose-50/70"
              } group`}
            >
              <div className="p-1.5 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                <LogOut size={18} className="text-rose-500" />
              </div>
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

          {!collapsed && (
            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-3 px-2 py-2 bg-white/50 rounded-xl backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center border border-violet-100">
                <UserCircle size={22} className="text-violet-600" />
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">Admin Luxefilm</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">administrator@luxe.com</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-700 font-medium">System Active</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}