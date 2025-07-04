'use client'

import { Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"

interface ClientHeaderProps {
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  pageTitle: string
}

export function ClientHeader({ setSidebarOpen, pageTitle }: ClientHeaderProps) {
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
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src="https://i.pravatar.cc/150?u=client" alt="Client" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
