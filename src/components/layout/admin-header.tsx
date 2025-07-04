'use client'

import { Bell, Menu, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button"

interface AdminHeaderProps {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  pageTitle: string
}

export function AdminHeader({ setSidebarOpen, pageTitle }: AdminHeaderProps) {
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
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
