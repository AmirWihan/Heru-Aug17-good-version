'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { teamMembers, teamActivity, teamPerformance } from "@/lib/data";
import { PlusCircle, Phone, Mail, LineChart } from "lucide-react";

const PerformanceBar = ({ label, value, progress, colorClass }: { label: string, value: string, progress: number, colorClass: string }) => (
    <div>
        <div className="flex justify-between mb-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <span className="text-sm font-medium">{value}</span>
        </div>
        <Progress value={progress} indicatorClassName={colorClass} />
    </div>
);

export function TeamPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-headline text-foreground">Team Management</h1>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Member
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg">Team Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <PerformanceBar label="New Clients This Month" value={`${teamPerformance.newClients}`} progress={teamPerformance.newClients/30 * 100} colorClass="bg-green-500" />
                        <PerformanceBar label="Application Success Rate" value={`${teamPerformance.successRate}%`} progress={teamPerformance.successRate} colorClass="bg-blue-500" />
                        <PerformanceBar label="Revenue Generated" value={`$${teamPerformance.revenue.toLocaleString()}`} progress={teamPerformance.revenue/80000 * 100} colorClass="bg-purple-500" />
                        <PerformanceBar label="Client Satisfaction" value={`${teamPerformance.satisfaction}/5.0`} progress={teamPerformance.satisfaction/5 * 100} colorClass="bg-yellow-500" />
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Team Members</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {teamMembers.map(member => (
                                <Card key={member.id} className="team-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                    <CardHeader className="flex-row items-center gap-4">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold">{member.name}</h4>
                                            <p className="text-sm text-muted-foreground">{member.role}</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-3 text-sm">
                                        {member.stats.map(stat => (
                                            <div key={stat.label} className="bg-muted p-2 rounded text-center">
                                                <p className="font-medium">{stat.value}</p>
                                                <p className="text-xs text-muted-foreground">{stat.label}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                    <CardContent className="flex justify-around">
                                        <Button variant="ghost" size="sm"><Phone className="mr-1 h-4 w-4" />Call</Button>
                                        <Button variant="ghost" size="sm"><Mail className="mr-1 h-4 w-4" />Email</Button>
                                        <Button variant="ghost" size="sm"><LineChart className="mr-1 h-4 w-4" />Stats</Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Recent Team Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6 before:absolute before:inset-y-0 before:w-px before:bg-border before:left-0">
                        {teamActivity.map((activity, index) => (
                            <div key={index} className="relative pl-8 py-4">
                                <div className="absolute left-[-11px] top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-card flex items-center justify-center">
                                    <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                                        <activity.icon className="h-3 w-3 text-primary" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="font-medium">{activity.title}</h4>
                                    <span className="text-xs text-muted-foreground">{activity.time}</span >
                                </div>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                {activity.details && <div className="mt-2 text-sm text-foreground/80"><span className="font-medium">{activity.details.label}:</span> {activity.details.value}</div>}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
