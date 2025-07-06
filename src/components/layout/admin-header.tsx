'use client'

import { Bell, LogOut, Menu, Search, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { useAdminDashboard } from "@/context/AdminDashboardContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WhatsappIcon } from "../icons/WhatsappIcon"
import { useGlobalData } from "@/context/GlobalDataContext"
import { useRouter } from "next/navigation"


interface AdminHeaderProps {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  pageTitle: string
}

export function AdminHeader({ setSidebarOpen, pageTitle }: AdminHeaderProps) {
  const { setPage } = useAdminDashboard();
  const { userProfile, logout } = useGlobalData();
  const router = useRouter();

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
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
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search users, logs..." className="pl-10" />
          </div>
           <a href="https://wa.me/15550123456" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
                <WhatsappIcon className="h-5 w-5 text-green-500" />
                <span className="sr-only">Contact Support on WhatsApp</span>
            </Button>
          </a>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-foreground" />
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
  )
}
