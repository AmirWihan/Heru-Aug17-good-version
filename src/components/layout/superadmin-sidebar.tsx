// Superadmin Sidebar - matches Lawyer CRM UI
'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useGlobalData } from '@/context/GlobalDataContext';
import { DynamicLogoIcon } from '../icons/DynamicLogoIcon';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  BarChart2, Users, BriefcaseBusiness, UserCheck, Settings, DollarSign, Shield, Bell, LifeBuoy, FileArchive, Zap, UserPlus, Activity, Layers, LogOut, FileText, CalendarCheck, LineChart, Mail, HelpCircle, Globe, X
} from 'lucide-react';

interface SuperadminSidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2, href: '/superadmin/dashboard' },
  { id: 'lawyers', label: 'Lawyer Onboarding', icon: UserCheck, href: '/superadmin/lawyers', badge: '3' },
  { id: 'employees', label: 'Employees & CRM', icon: Users, href: '/superadmin/employees' },
  { id: 'clients', label: 'Clients', icon: BriefcaseBusiness, href: '/superadmin/clients' },
  { id: 'sales', label: 'Sales & Marketing', icon: Activity, href: '/superadmin/sales' },
  { id: 'payments', label: 'Payments', icon: DollarSign, href: '/superadmin/payments' },
  { id: 'ai', label: 'AI Insights', icon: Zap, href: '/superadmin/ai' },
  { id: 'integrations', label: 'API & Integrations', icon: Globe, href: '/superadmin/integrations' },
  { id: 'support', label: 'Support Tickets', icon: LifeBuoy, href: '/superadmin/support', badge: '5', badgeVariant: 'destructive' as 'destructive' },
  { id: 'audit', label: 'Audit Log', icon: FileArchive, href: '/superadmin/audit' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/superadmin/settings' },
];

export function SuperadminSidebar({ isSidebarOpen, setSidebarOpen }: SuperadminSidebarProps) {
  const { userProfile, logout } = useGlobalData();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await logout();
    router.push('/login');
  };

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname === item.href;
    return (
      <li key={item.id}>
        <Link
          href={item.href}
          className={cn(
            "flex items-center p-3 rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground transition-colors",
            isActive && "bg-primary/10 text-primary font-semibold"
          )}
          onClick={() => {
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
        >
          <item.icon className="mr-3 h-5 w-5" />
          <span>{item.label}</span>
          {item.badge && (
            <Badge variant={item.badgeVariant || 'secondary'} className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </Link>
      </li>
    );
  };

  return (
    <>
      <div className={cn(
        "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
        isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setSidebarOpen(false)}></div>
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-card shadow-lg flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 flex items-center justify-between border-b">
          <Link href="/superadmin" className="flex items-center gap-2">
            <DynamicLogoIcon className="h-8 w-8" />
            <span className="text-xl font-bold font-headline text-primary">VisaFor Platform</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="p-4 flex items-center border-b">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={userProfile?.avatar} alt={userProfile?.name} />
            <AvatarFallback>{userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('') : 'SA'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{userProfile?.name}</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t mt-auto">
          <Button variant="ghost" className="w-full flex items-center gap-2" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}
