'use client'

import { Bell, LogOut, Menu, Search, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLawyerDashboard } from "@/context/LawyerDashboardContext"
import Link from "next/link"
import { WhatsappIcon } from "../icons/WhatsappIcon"

interface AppHeaderProps {
  pageTitle: string
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AppHeader({ pageTitle, setSidebarOpen }: AppHeaderProps) {
  const { setPage } = useLawyerDashboard();

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
            <Input type="search" placeholder="Search..." className="pl-10" />
          </div>
          <Link href="https://wa.me/15550123456" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
                <WhatsappIcon className="h-5 w-5 text-green-500" />
                <span className="sr-only">Contact on WhatsApp</span>
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Sarah J." />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPage('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link href="/" passHref>
                <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
