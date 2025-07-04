'use client'

import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  FileText,
  Mail,
  FileDigit,
  Settings,
  X,
  Search,
  Calendar,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { DynamicLogoIcon } from "../icons/DynamicLogoIcon"
import type { Dispatch, SetStateAction } from 'react'
import { useRouter } from "next/navigation"

interface ClientSidebarProps {
  isSidebarOpen: boolean
  setSidebarOpen: Dispatch<SetStateAction<boolean>>
  page: string;
  setPage: Dispatch<SetStateAction<string>>;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'find-lawyer', label: 'Find a Lawyer', icon: Search },
  { id: 'my-lawyers', label: 'My Lawyers', icon: Users },
  { id: 'documents', label: 'My Documents', icon: FileText },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'billing', label: 'Billing', icon: FileDigit },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export function ClientSidebar({ isSidebarOpen, setSidebarOpen, page, setPage }: ClientSidebarProps) {
  const router = useRouter();

  const handleNavigation = (pageId: string) => {
    setPage(pageId);
    router.push('/client/dashboard');
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = page === item.id;
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
            <AvatarImage src="https://i.pravatar.cc/150?u=client" alt="John Applicant" />
            <AvatarFallback>JA</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">John Applicant</p>
            <p className="text-xs text-muted-foreground">Client</p>
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
