
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { WhatsappIcon } from '../icons/WhatsappIcon';
import { useGlobalData } from '@/context/GlobalDataContext';

export function AdminSystemNotificationsPage() {
    const { toast } = useToast();
    const { notifications, addNotification } = useGlobalData();
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('all');
    const [sendViaWhatsapp, setSendViaWhatsapp] = useState(false);

    const handleSendNotification = () => {
        if (!title || !message) {
            toast({ title: 'Error', description: 'Title and message are required.', variant: 'destructive' });
            return;
        }
        addNotification({
            id: Date.now(),
            date: new Date().toISOString(),
            title,
            message,
            target: target === 'all' ? 'All Users' : (target === 'lawyers' ? 'Lawyers' : 'Clients'),
            isRead: false,
        });

        setTitle('');
        setMessage('');
        setSendViaWhatsapp(false);
        toast({ title: 'Notification Sent!', description: `Your message has been broadcast to the selected users.` });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Compose Notification</CardTitle>
                        <CardDescription>Send a broadcast message to users of the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Scheduled Maintenance" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message here..." rows={6} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="target">Target Audience</Label>
                            <Select value={target} onValueChange={setTarget}>
                                <SelectTrigger id="target">
                                    <SelectValue placeholder="Select audience" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="lawyers">Lawyers Only</SelectItem>
                                    <SelectItem value="clients">Clients Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="flex items-center space-x-2 pt-2">
                            <Switch id="whatsapp-broadcast" checked={sendViaWhatsapp} onCheckedChange={setSendViaWhatsapp}/>
                            <Label htmlFor="whatsapp-broadcast" className="flex items-center gap-1.5">Also broadcast via <WhatsappIcon className="h-4 w-4 text-green-500"/> WhatsApp</Label>
                        </div>
                        <Button className="w-full" onClick={handleSendNotification}>
                            <Send className="mr-2 h-4 w-4" /> Send Notification
                        </Button>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Sent Notifications</CardTitle>
                        <CardDescription>A log of all past broadcast messages.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Date Sent</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notifications.map(notif => (
                                    <TableRow key={notif.id}>
                                        <TableCell>
                                            <div className="font-medium">{notif.title}</div>
                                            <div className="text-sm text-muted-foreground truncate">{notif.message}</div>
                                        </TableCell>
                                        <TableCell>{notif.target}</TableCell>
                                        <TableCell suppressHydrationWarning>{format(new Date(notif.date), 'PPp')}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
