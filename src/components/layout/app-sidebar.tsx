
'use client'

import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Mail,
  FileDigit,
  LineChart,
  Settings,
  HelpCircle,
  X,
  Users2,
  Wand2,
  CheckSquare,
  ClipboardList,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { DynamicLogoIcon } from "../icons/DynamicLogoIcon"
import { useRouter } from "next/navigation"
import { useGlobalData } from "@/context/GlobalDataContext"

interface AppSidebarProps {
  activePage: string
  setPage: (page: string) => void
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'team', label: 'Team Management', icon: Users2 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'applications', label: 'Applications', icon: FileText, badge: '24' },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: '3' },
  { id: 'messages', label: 'Messages', icon: Mail, badge: '5', badgeVariant: 'destructive' as 'destructive' },
  { id: 'activity', label: 'Activity Log', icon: ClipboardList },
  { id: 'billing', label: 'Billing', icon: FileDigit },
  { id: 'reports', label: 'Reports', icon: LineChart },
  { id: 'ai-tools', label: 'AI Tools', icon: Wand2 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'support', label: 'Help & Support', icon: HelpCircle },
]

export function AppSidebar({ activePage, setPage, isSidebarOpen, setSidebarOpen }: AppSidebarProps) {
  const router = useRouter();
  const { userProfile } = useGlobalData();

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
            <span className="text-xl font-bold font-headline text-primary">Heru</span>
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
            <p className="text-xs text-muted-foreground">{userProfile?.role}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            {navItems.map((item) => <NavLink key={item.id} item={item} />)}
          </ul>
        </nav>
      </aside>
    </>
  )
}
