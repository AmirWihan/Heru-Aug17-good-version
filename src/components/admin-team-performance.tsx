'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { salesPerformanceData } from "@/lib/data";
import { ArrowUp, UserPlus, Zap, Target } from "lucide-react";

export function SalesTeamPerformance() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales & Marketing Performance</CardTitle>
                <CardDescription>This month's key performance indicators for your growth team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {salesPerformanceData.stats.map((stat, index) => (
                        <div key={index} className="p-4 rounded-lg bg-muted/50">
                             <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-semibold text-muted-foreground">{stat.title}</span>
                                <div className={`p-2 rounded-full bg-primary/10`}>
                                    <stat.icon className={`h-5 w-5 text-primary`} />
                                </div>
                            </div>
                            <div>
                                <p className="text-3xl font-bold">{stat.value}</p>
                                <p className="text-xs text-green-600 flex items-center">
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                    <span>{stat.change} from last month</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div>
                    <h4 className="font-semibold mb-4">Top Performers</h4>
                    <div className="space-y-4">
                        {salesPerformanceData.topPerformers.map((performer) => (
                            <div key={performer.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={performer.avatar} alt={performer.name} />
                                    <AvatarFallback>{performer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{performer.name}</p>
                                    <p className="text-sm text-muted-foreground">{performer.performance}</p>
                                </div>
                                {performer.isTop && <Badge variant="warning">Top Performer</Badge>}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
