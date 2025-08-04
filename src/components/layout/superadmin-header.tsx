'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Search, Menu, Crown, Settings, LogOut, User, BarChart3, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SuperadminHeaderProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function SuperadminHeader({ isSidebarOpen, setSidebarOpen }: SuperadminHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center gap-2 border-b bg-background px-4 md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <div className="flex items-center gap-2 md:gap-4 flex-1">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-500" />
          <span className="font-semibold text-lg">Super Admin</span>
          <Badge variant="secondary" className="ml-2">
            <Shield className="h-3 w-3 mr-1" />
            Enterprise
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-8 w-64"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>

        {/* Analytics Quick View */}
        <Button variant="ghost" size="icon">
          <BarChart3 className="h-5 w-5" />
          <span className="sr-only">Analytics</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/superadmin.png" alt="Super Admin" />
                <AvatarFallback className="bg-yellow-100 text-yellow-700">
                  <Crown className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Super Administrator</p>
                <p className="text-xs leading-none text-muted-foreground">
                  admin@visafor.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 