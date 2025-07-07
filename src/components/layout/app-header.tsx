'use client'

import { Bell, LogOut, Menu, Search, Settings, Rocket, Crown, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLawyerDashboard } from "@/context/LawyerDashboardContext"
import { useGlobalData } from "@/context/GlobalDataContext"
import { plans } from "@/lib/data"
import { Progress } from "../ui/progress"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { GlobalSearch } from "../global-search"


interface AppHeaderProps {
  pageTitle: string
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AppHeader({ pageTitle, setSidebarOpen }: AppHeaderProps) {
  const { setPage } = useLawyerDashboard();
  const { teamMembers, userProfile, logout } = useGlobalData();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // For demo, assume logged-in user is from "Johnson Legal" firm
  const currentFirmName = "Johnson Legal";
  const currentFirmMembers = teamMembers.filter(m => m.firmName === currentFirmName);
  const currentPlanName = currentFirmMembers.length > 0 ? currentFirmMembers[0].plan : 'Pro Team';
  const planDetails = plans.find(p => p.name === currentPlanName);

  const userCount = currentFirmMembers.length;
  const userLimit = planDetails?.userLimit || 10;
  const usagePercentage = typeof userLimit === 'number' ? (userCount / userLimit) * 100 : 0;

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

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
          <div className="flex items-center space-x-2 md:space-x-4">
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button>
                      <Rocket className="mr-0 sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Upgrade</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Your Plan: {currentPlanName}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                          <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-muted-foreground"/> Users</span>
                          <span>{userCount} / {userLimit}</span>
                      </div>
                      <Progress value={usagePercentage} />
                  </div>
                  <DropdownMenuItem onClick={() => setPage('settings')}>
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Upgrade to Enterprise</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPage('settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Manage Subscription</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={userProfile?.avatar} alt={userProfile?.name} />
                  <AvatarFallback>{userProfile?.name ? userProfile.name.split(' ').map(n => n[0]).join('') : 'SJ'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{userProfile?.name || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPage('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
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
