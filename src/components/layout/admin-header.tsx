
'use client'

import { Bell, LogOut, Menu, Search, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { useAdminDashboard } from "@/context/AdminDashboardContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGlobalData } from "@/context/GlobalDataContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GlobalSearch } from "../global-search"
import { Badge } from "../ui/badge"

interface AdminHeaderProps {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  pageTitle: string
}

export function AdminHeader({ setSidebarOpen, pageTitle }: AdminHeaderProps) {
  const { setPage } = useAdminDashboard();
  const { userProfile, logout, notifications } = useGlobalData();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  const unreadCount = (notifications || []).filter(n => !n.isRead).length;

  return (
    <>
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-sm shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>
            <h1 className="font-headline text-xl font-semibold text-foreground">{pageTitle}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="relative hidden sm:flex justify-start text-muted-foreground w-64"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Search...
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setPage('notifications')} className="relative">
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0">{unreadCount}</Badge>}
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={userProfile?.avatar} alt={userProfile?.name} />
                  <AvatarFallback>{userProfile?.name?.split(' ').map(n => n[0]).join('') || 'SA'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{userProfile?.name || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPage('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Platform Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  )
}
