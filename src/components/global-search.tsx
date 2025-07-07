'use client';

import React, { useEffect, useCallback } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useRouter } from 'next/navigation';
import { Users, Briefcase, Shield, LayoutDashboard, Wand2, CreditCard, Settings } from 'lucide-react';
import { useLawyerDashboard } from '@/context/LawyerDashboardContext';
import { useAdminDashboard } from '@/context/AdminDashboardContext';

interface GlobalSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
    const { userProfile, clients, teamMembers } = useGlobalData();
    const router = useRouter();
    
    // Non-throwing way to get contexts
    const lawyerContext = useLawyerDashboard();
    const adminContext = useAdminDashboard();
    
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpenChange(!open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [onOpenChange, open]);

    const runCommand = useCallback((command: () => unknown) => {
        onOpenChange(false);
        command();
    }, [onOpenChange]);

    const isAdmin = userProfile?.authRole === 'admin';
    const isLawyer = userProfile?.authRole === 'lawyer';

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                
                {isLawyer && (
                    <>
                        <CommandGroup heading="Clients">
                            {clients.map(client => (
                                <CommandItem value={client.name + " " + client.email} key={`client-${client.id}`} onSelect={() => runCommand(() => router.push(`/lawyer/clients/${client.id}`))}>
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>{client.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                        <CommandGroup heading="Team">
                            {teamMembers.filter(m => m.type === 'legal').map(member => (
                                <CommandItem value={member.name + " " + member.email} key={`team-${member.id}`} onSelect={() => runCommand(() => router.push(`/lawyer/team/${member.id}`))}>
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    <span>{member.name}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                         <CommandGroup heading="Navigation">
                            <CommandItem value="Dashboard" onSelect={() => runCommand(() => lawyerContext.setPage('dashboard'))}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </CommandItem>
                             <CommandItem value="AI Tools" onSelect={() => runCommand(() => lawyerContext.setPage('ai-tools'))}>
                                <Wand2 className="mr-2 h-4 w-4" />
                                AI Tools
                            </CommandItem>
                            <CommandItem value="Billing" onSelect={() => runCommand(() => lawyerContext.setPage('billing'))}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Billing
                            </CommandItem>
                        </CommandGroup>
                    </>
                )}
                
                {isAdmin && (
                    <>
                         <CommandGroup heading="Users">
                            {clients.map(client => (
                                <CommandItem value={client.name + " " + client.email} key={`admin-client-${client.id}`} onSelect={() => runCommand(() => router.push(`/admin/clients/${client.id}`))}>
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>{client.name} (Client)</span>
                                </CommandItem>
                            ))}
                             {teamMembers.map(member => (
                                <CommandItem value={member.name + " " + member.email + " " + member.role} key={`admin-team-${member.id}`} onSelect={() => runCommand(() => adminContext.setPage('team'))}>
                                    <Shield className="mr-2 h-4 w-4" />
                                    <span>{member.name} ({member.role})</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                         <CommandGroup heading="Admin Navigation">
                             <CommandItem value="Admin Overview" onSelect={() => runCommand(() => adminContext.setPage('overview'))}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Overview
                            </CommandItem>
                             <CommandItem value="User Management" onSelect={() => runCommand(() => adminContext.setPage('users'))}>
                                <Users className="mr-2 h-4 w-4" />
                                User Management
                            </CommandItem>
                            <CommandItem value="Platform Settings" onSelect={() => runCommand(() => adminContext.setPage('settings'))}>
                                <Settings className="mr-2 h-4 w-4" />
                                Platform Settings
                            </CommandItem>
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </CommandDialog>
    );
}