
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useGlobalData } from "@/context/GlobalDataContext"
import { ArrowUp, DollarSign, Percent, UserPlus, Zap, Target } from "lucide-react"

export function TeamPerformance() {
    const { teamMembers, clients } = useGlobalData();

    // Calculate performance data from global state
    const salesTeam = teamMembers.filter(m => m.type === 'sales' || m.type === 'advisor');
    const totalLeads = 84; // Mock data as leads aren't fully integrated
    const totalClients = clients.length;
    const conversionRate = totalLeads > 0 ? (totalClients / totalLeads) * 100 : 0;
    
    const performanceData = {
        stats: [
            { title: "New Clients This Month", value: "18", change: "12%", icon: UserPlus, iconBg: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-600 dark:text-blue-400", cardBg: "bg-blue-50 dark:bg-blue-950/50" },
            { title: "Revenue This Month", value: "$42,580", change: "8%", icon: DollarSign, iconBg: "bg-purple-100 dark:bg-purple-900/50", iconColor: "text-purple-600 dark:text-purple-400", cardBg: "bg-purple-50 dark:bg-purple-950/50" },
            { title: "Overall Conversion", value: `${conversionRate.toFixed(1)}%`, change: "1.8%", icon: Percent, iconBg: "bg-green-100 dark:bg-green-900/50", iconColor: "text-green-600 dark:text-green-400", cardBg: "bg-green-50 dark:bg-green-950/50" },
        ],
        topPerformers: salesTeam.slice(0, 3).map(member => ({
            id: member.id,
            name: member.name,
            avatar: member.avatar,
            performance: `${Math.floor(Math.random() * 10) + 5} new clients • $${(Math.random() * 10000 + 5000).toFixed(0)} revenue`,
            isTopSeller: member.id === 5, // Jessica Miller is top seller in demo data
        }))
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Team Performance</CardTitle>
                <CardDescription>Monthly key performance indicators for your growth team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {performanceData.stats.map((stat, index) => (
                        <div key={index} className={`p-4 rounded-lg ${stat.cardBg}`}>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-semibold text-muted-foreground">{stat.title}</span>
                                <div className={`p-2 rounded-full ${stat.iconBg}`}>
                                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
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
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Top Performers</h4>
                        <Button variant="link" className="p-0 h-auto text-primary">View All</Button>
                    </div>
                    <div className="space-y-4">
                        {performanceData.topPerformers.map((performer) => (
                            <div key={performer.id} className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={performer.avatar} alt={performer.name} />
                                    <AvatarFallback>{performer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-medium">{performer.name}</p>
                                    <p className="text-sm text-muted-foreground">{performer.performance}</p>
                                </div>
                                {performer.isTopSeller && <Badge variant="warning">Top Seller</Badge>}
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
