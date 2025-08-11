
'use client';
import { cn } from "@/lib/utils";
import { User, Lock, Bell, Palette, Building2, Users, Puzzle, Database, CreditCard } from 'lucide-react';
import type { FC } from "react";
import { useGlobalData } from "@/context/GlobalDataContext";

const baseNavGroups = [
    {
        title: 'Workspace',
        items: [
            { id: 'general', label: 'General', icon: Building2 },
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
    const { userProfile, can } = useGlobalData();
    const isAdmin = (userProfile?.authRole === 'superadmin') ||
      (userProfile?.authRole === 'lawyer' && (userProfile as any).accessLevel === 'Admin');

    const navGroups = (() => {
        // Preserve icon component references (functions). Avoid JSON cloning which strips functions.
        const groups = baseNavGroups.map(group => ({
            ...group,
            items: [...group.items],
        }));
        if (isAdmin) {
            // insert Roles & Access after Users & Teams
            const workspace = groups[0];
            const idx = workspace.items.findIndex((i: any) => i.id === 'team');
            workspace.items.splice(idx + 1, 0, { id: 'roles', label: 'Roles & Access', icon: Lock });
        }
        // Hide Billing if user lacks financials permission
        const workspace = groups[0];
        workspace.items = workspace.items.filter((i: any) => {
            if (i.id === 'billing') return can('financials');
            return true;
        });
        return groups;
    })();
    return (
        <nav className="space-y-6">
            {navGroups.map((group) => (
                <div key={group.title}>
                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.title}</h3>
                    <div className="mt-2 space-y-1">
                        {group.items.map((item) => {
                             const Icon = item.icon as any;
                             const hasIcon = typeof Icon === 'function';
                             if (!hasIcon && typeof window !== 'undefined') {
                                 // eslint-disable-next-line no-console
                                 console.error('[SettingsSidebar] Invalid icon for item', item.id, item);
                             }
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
                                     {hasIcon ? (
                                         <Icon className="mr-3 h-5 w-5" />
                                     ) : (
                                         <span className="mr-3 inline-block" style={{ width: 20, height: 20 }} />
                                     )}
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
