'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUp, DollarSign, Percent, UserPlus, Phone, Mail, LineChart } from "lucide-react"

const performanceData = {
    stats: [
        { title: "New Clients", value: "18", icon: UserPlus },
        { title: "Revenue", value: "$42k", icon: DollarSign },
        { title: "Conversion", value: "24%", icon: Percent },
    ],
    teamMembers: [
        { id: 1, name: "Emma Johnson", role: "Senior Lawyer", avatar: "https://i.pravatar.cc/150?u=emma", stats: [{ label: 'Clients', value: '72' }, { label: 'Revenue', value: '$340k' }] },
        { id: 2, name: "Michael Chen", role: "Consultant", avatar: "https://i.pravatar.cc/150?u=michaelchen", stats: [{ label: 'Clients', value: '45' }, { label: 'Revenue', value: '$210k' }] },
    ]
}

export function TeamManagementScreenshot() {
    return (
        <Card className="bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 overflow-hidden" data-ai-hint="team collaboration">
            <div className="bg-muted/50 p-2 flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="p-6 scale-[.85] origin-top-left sm:scale-100 sm:origin-center sm:p-8">
                <CardHeader className="p-0 mb-4">
                    <CardTitle>Team Management</CardTitle>
                    <CardDescription>Manage your team members and their performance.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                    {/* Simplified Team Performance Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-base">Team Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-3 gap-2">
                            {performanceData.stats.map((stat, index) => (
                                <div key={index} className="p-2 rounded-lg bg-muted/50 text-center">
                                    <stat.icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                                    <p className="text-lg font-bold">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Team Member Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {performanceData.teamMembers.map((member) => (
                            <Card key={member.id} className="team-card flex flex-col">
                                <CardHeader className="flex-row items-center gap-3 p-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-bold text-sm">{member.name}</h4>
                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-2 text-xs p-3 pt-0">
                                    {member.stats.map(stat => (
                                        <div key={stat.label} className="bg-muted p-2 rounded text-center">
                                            <p className="font-medium">{stat.value}</p>
                                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}
