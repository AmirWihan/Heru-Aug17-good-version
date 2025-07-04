'use client';

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import type { Client } from "@/lib/data";
import { X, ExternalLink } from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';
import { ClientProfile } from './client-profile';

interface ClientDetailSheetProps {
    client: Client;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onUpdateClient: (updatedClient: Client) => void;
}

export function ClientDetailSheet({ client, isOpen, onOpenChange, onUpdateClient }: ClientDetailSheetProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isAdminView = pathname.startsWith('/admin');
    const expandUrl = isAdminView ? `/admin/clients/${client.id}` : `/lawyer/clients/${client.id}`;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-3xl p-0 flex flex-col h-full">
                <SheetHeader className="p-6 border-b shrink-0">
                    <div className="flex justify-between items-start">
                         <SheetTitle className="text-2xl font-bold">Client Details</SheetTitle>
                         <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" onClick={() => router.push(expandUrl)} title="Open in full page">
                                <ExternalLink className="h-5 w-5" />
                            </Button>
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-5 w-5" />
                                </Button>
                            </SheetClose>
                         </div>
                    </div>
                </SheetHeader>
                <div className="overflow-y-auto flex-1">
                    <div className="p-6">
                        <ClientProfile client={client} onUpdateClient={onUpdateClient} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
