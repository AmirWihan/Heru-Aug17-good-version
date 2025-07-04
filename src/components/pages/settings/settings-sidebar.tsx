
'use client';
import { cn } from "@/lib/utils";
import { User, Lock, Bell, Palette, Building, Users, Puzzle, Database, CreditCard } from 'lucide-react';
import type { FC } from "react";

const navGroups = [
    {
        title: 'Workspace',
        items: [
            { id: 'general', label: 'General', icon: Building },
            { id: 'team', label: 'Users & Teams', icon: Users },
            { id: 'billing', label: 'Billing', icon: CreditCard },
        ]
    },
    {
        title: 'Your Account',
        items: [
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'appearance', label: 'Appearance', icon: Palette },
        ]
    },
    {
        title: 'Tools',
        items: [
            { id: 'integrations', label: 'Integrations', icon: Puzzle },
            { id: 'data', label: 'Data Management', icon: Database },
        ]
    }
];

interface SettingsSidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
}

export const SettingsSidebar: FC<SettingsSidebarProps> = ({ activePage, setActivePage }) => {
    return (
        <nav className="space-y-6">
            {navGroups.map((group) => (
                <div key={group.title}>
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.title}</h3>
                    <div className="mt-2 space-y-1">
                        {group.items.map((item) => {
                             const Icon = item.icon;
                             return (
                                <button
                                    key={item.id}
                                    onClick={() => setActivePage(item.id)}
                                    className={cn(
                                        "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                        activePage === item.id
                                            ? "bg-muted text-primary font-semibold"
                                            : "text-foreground/70 hover:bg-muted/50 hover:text-foreground"
                                    )}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    <span>{item.label}</span>
                                </button>
                             )
                        })}
                    </div>
                </div>
            ))}
        </nav>
    );
};
