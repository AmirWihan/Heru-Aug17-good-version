
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalData } from "@/context/GlobalDataContext";
import { Bell, Check, Trash2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export function NotificationsPage() {
    const { userProfile, notifications, updateNotification } = useGlobalData();

    const handleMarkAsRead = (id: number) => {
        updateNotification(id, { isRead: true });
    };

    const handleMarkAllAsRead = () => {
        notifications.forEach(n => {
            if (!n.isRead && isNotificationForUser(n)) {
                updateNotification(n.id, { isRead: true });
            }
        });
    };

    const handleDelete = (id: number) => {
        // This is a "soft delete" for the UI, a real implementation would handle this differently
        updateNotification(id, { isDeleted: true });
    };

    const isNotificationForUser = (notification: typeof notifications[0]) => {
        if (notification.target === 'All Users') return true;
        if (userProfile?.authRole === 'lawyer' && notification.target === 'Lawyers') return true;
        if (userProfile?.authRole === 'client' && notification.target === 'Clients') return true;
        if (userProfile?.authRole === 'admin') return true; // Admins see all
        return false;
    };

    const userNotifications = notifications.filter(n => isNotificationForUser(n) && !n.isDeleted);
    const unreadCount = userNotifications.filter(n => !n.isRead).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Notifications
                        </CardTitle>
                        <CardDescription>
                            {unreadCount > 0 ? `You have ${unreadCount} unread notification(s).` : 'You are all caught up.'}
                        </CardDescription>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="outline" onClick={handleMarkAllAsRead}>
                            <Check className="mr-2 h-4 w-4" />
                            Mark All as Read
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {userNotifications.length > 0 ? (
                        userNotifications.map(notification => (
                            <div
                                key={notification.id}
                                className={cn(
                                    "flex items-start gap-4 p-4 rounded-lg border",
                                    notification.isRead ? "bg-card text-muted-foreground" : "bg-muted/50"
                                )}
                            >
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-semibold">{notification.title}</h4>
                                        <p className="text-xs text-muted-foreground shrink-0 pl-4" suppressHydrationWarning>
                                            {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <p className="text-sm mt-1">{notification.message}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {!notification.isRead && (
                                        <Button variant="ghost" size="icon" className="h-7 w-7" title="Mark as Read" onClick={() => handleMarkAsRead(notification.id)}>
                                            <Check className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Delete Notification" onClick={() => handleDelete(notification.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Bell className="mx-auto h-12 w-12 mb-4" />
                            <p className="font-semibold">No notifications yet.</p>
                            <p className="text-sm">We'll let you know when there's something new.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
