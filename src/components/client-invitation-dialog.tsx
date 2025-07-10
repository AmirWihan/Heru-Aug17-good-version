
'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import type { Client } from "@/lib/data";

interface ClientInvitationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  invitationLink: string;
  onSend: () => void;
}

export function ClientInvitationDialog({ isOpen, onOpenChange, client, invitationLink, onSend }: ClientInvitationDialogProps) {
  const emailSubject = `Invitation to Join Your Secure Client Portal`;
  const emailBody = `Hello ${client.name},\n\nPlease join our secure client portal to manage your case documents, communicate with our team, and track your application progress.\n\nClick the link below to create your account:\n${invitationLink}\n\nWe look forward to working with you.\n\nBest regards,\nThe Team`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Send Portal Invitation to {client.name}</DialogTitle>
          <DialogDescription>
            A simulated email with the following content will be sent to {client.email}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="email-to">To</Label>
                <Input id="email-to" value={client.email} readOnly />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input id="email-subject" value={emailSubject} readOnly />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email-body">Body</Label>
                <Textarea id="email-body" value={emailBody} readOnly rows={10} className="bg-muted/50" />
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={onSend}>
                <Send className="mr-2 h-4 w-4" /> Send Invitation
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
