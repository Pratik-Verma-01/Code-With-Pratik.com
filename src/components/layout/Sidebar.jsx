import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderPlus, UserCircle, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

const links = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Projects', href: '/dashboard/projects', icon: FolderPlus },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 hidden lg:block border-r border-white/10 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
