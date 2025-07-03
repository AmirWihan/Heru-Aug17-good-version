
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { activityLogData, activityTypes, clients, teamMembers } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../ui/button';

export function ActivityLogPage() {
    const [activities, setActivities] = useState(activityLogData);
    const [typeFilter, setTypeFilter] = useState('all');
    const [clientFilter, setClientFilter] = useState('all');
    const [teamFilter, setTeamFilter] = useState('all');

    const filteredActivities = activities.filter(activity => {
        const typeMatch = typeFilter === 'all' || activity.type === typeFilter;
        const clientMatch = clientFilter === 'all' || activity.client.id.toString() === clientFilter;
        const teamMatch = teamFilter === 'all' || activity.teamMember.id.toString() === teamFilter;
        return typeMatch && clientMatch && teamMatch;
    });

    const getIconForType = (type: string) => {
        const activityType = activityTypes.find(t => t.label === type);
        return activityType ? activityType.icon : null;
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline text-foreground">Global Activity Log</h1>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {activityTypes.map(type => (
                                    <SelectItem key={type.id} value={type.label}>{type.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={clientFilter} onValueChange={setClientFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by Client" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Clients</SelectItem>
                                {clients.map(client => (
                                    <SelectItem key={client.id} value={client.id.toString()}>{client.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={teamFilter} onValueChange={setTeamFilter}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filter by Team Member" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Team Members</SelectItem>
                                {teamMembers.map(member => (
                                    <SelectItem key={member.id} value={member.id.toString()}>{member.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => {
                            setTypeFilter('all');
                            setClientFilter('all');
                            setTeamFilter('all');
                        }}>Reset Filters</Button>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="relative pl-6 before:absolute before:inset-y-0 before:w-px before:bg-border before:left-0">
                        {filteredActivities.map((item, index) => {
                            const Icon = getIconForType(item.type);
                            return (
                                <div key={item.id} className="relative pl-8 py-4 first:pt-0 last:pb-0">
                                    <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-background flex items-center justify-center">
                                        <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                            {Icon && <Icon className="h-3 w-3 text-primary" />}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{item.type}</h4>
                                            <span className="text-sm text-muted-foreground">for</span>
                                            <div className="flex items-center gap-1.5 font-medium text-sm">
                                                 <Avatar className="h-5 w-5">
                                                    <AvatarImage src={item.client.avatar} alt={item.client.name} />
                                                    <AvatarFallback>{item.client.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span>{item.client.name}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                     <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                                        Logged by
                                        <Avatar className="h-4 w-4">
                                            <AvatarImage src={item.teamMember.avatar} alt={item.teamMember.name} />
                                            <AvatarFallback>{item.teamMember.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {item.teamMember.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
