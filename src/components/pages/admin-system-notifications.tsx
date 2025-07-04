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
import { Bell, Send } from 'lucide-react';
import { format } from 'date-fns';

const initialNotifications = [
    { id: 1, title: 'Platform Maintenance', message: 'The platform will be down for scheduled maintenance on Sunday at 2 AM EST.', target: 'All Users', date: '2023-07-20T10:00:00Z' },
    { id: 2, title: 'New Feature: AI Tools', message: 'We have launched new AI-powered tools to help you streamline your workflow.', target: 'Lawyers', date: '2023-07-18T14:30:00Z' },
];

export function AdminSystemNotificationsPage() {
    const { toast } = useToast();
    const [notifications, setNotifications] = useState(initialNotifications);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('all');

    const handleSendNotification = () => {
        if (!title || !message) {
            toast({ title: 'Error', description: 'Title and message are required.', variant: 'destructive' });
            return;
        }
        const newNotification = {
            id: notifications.length + 1,
            title,
            message,
            target: target === 'all' ? 'All Users' : (target === 'lawyers' ? 'Lawyers' : 'Clients'),
            date: new Date().toISOString(),
        };
        setNotifications([newNotification, ...notifications]);
        setTitle('');
        setMessage('');
        toast({ title: 'Notification Sent!', description: `Your message has been broadcast to ${newNotification.target}.` });
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
                                        <TableCell>{format(new Date(notif.date), 'PPp')}</TableCell>
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
