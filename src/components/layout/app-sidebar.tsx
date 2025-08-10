
'use client'

import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  FileText,
  CalendarCheck,
  Mail,
  LineChart,
  Settings,
  HelpCircle,
  X,
  Wand2,
  CheckSquare,
  Bell,
  BriefcaseBusiness,
  Landmark,
  Handshake,
  Phone,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { DynamicLogoIcon } from "../icons/DynamicLogoIcon"
import { useRouter } from "next/navigation"
import { useGlobalData } from "@/context/GlobalDataContext"
import { TeamMember } from "@/lib/data"

interface AppSidebarProps {
  activePage: string
  setPage: (page: string) => void
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'leads', label: 'Leads', icon: BriefcaseBusiness, roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'clients', label: 'Clients', icon: Users, roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'team', label: 'Team Management', icon: Users, roles: ['Admin'] },
  { id: 'documents', label: 'Documents', icon: FileText, roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'applications', label: 'Applications', icon: FileText, badge: '24', roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck, roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: '3', roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'messages', label: 'Messages', icon: Mail, badge: '5', badgeVariant: 'destructive' as 'destructive', roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'notifications', label: 'Notifications', icon: Bell, roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'activity', label: 'Activity Log', icon: FileText, roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'billing', label: 'Billing', icon: Landmark, roles: ['Admin'] },
  { id: 'reports', label: 'Reports', icon: LineChart, roles: ['Admin'] },
  { id: 'ai-tools', label: 'AI Tools', icon: Wand2, roles: ['Admin', 'Standard User', 'Viewer'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin'] },
  { id: 'support', label: 'Help & Support', icon: HelpCircle, roles: ['Admin', 'Standard User', 'Viewer'] },
];


export function AppSidebar({ activePage, setPage, isSidebarOpen, setSidebarOpen }: AppSidebarProps) {
  const router = useRouter();
  const { userProfile, can, hasPermission } = useGlobalData();
  const teamMember = userProfile as TeamMember;
  const firmName = teamMember?.firmName || 'VisaFor';

  const handleNavigation = (page: string) => {
    setPage(page)
    router.push('/lawyer/dashboard');
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = activePage === item.id;
    return (
      <li key={item.id}>
        <button
          onClick={() => handleNavigation(item.id)}
          className={cn(
            "flex w-full items-center p-3 rounded-lg text-foreground/80 hover:bg-muted hover:text-foreground transition-colors",
            isActive && "bg-primary/10 text-primary font-semibold"
          )}
        >
          <item.icon className="mr-3 h-5 w-5" />
          <span>{item.label}</span>
          {item.badge && (
            <Badge variant={item.badgeVariant || 'secondary'} className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </button>
      </li>
    )
  }

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
          <Link href="/" className="flex items-center gap-2">
            <DynamicLogoIcon className="h-8 w-8" />
            <span className="text-xl font-bold font-headline text-primary">{firmName}</span>
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
            <AvatarFallback>{userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{userProfile?.name}</p>
            <p className="text-xs text-muted-foreground">{teamMember?.role}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            {navItems.map((item) => {
              // Baseline role filter
              if (!item.roles.includes(teamMember.accessLevel)) return null;
              // Permission-based visibility
              if (item.id === 'billing' && !can('financials')) return null;
              if (item.id === 'reports' && !can('highLevelSettings')) return null;
              if (item.id === 'team') {
                const v = hasPermission('viewManageTeam');
                if (v !== true) return null; // only full manage access shows Team Management
              }
              if (item.id === 'settings' && !can('highLevelSettings')) return null;
              return <NavLink key={item.id} item={item} />
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}
