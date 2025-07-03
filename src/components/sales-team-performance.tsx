'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, DollarSign, Percent, UserPlus } from "lucide-react"

const performanceData = {
    stats: [
        { title: "New Clients", value: "18", change: "12%", icon: UserPlus, iconBg: "bg-blue-100 dark:bg-blue-900/50", iconColor: "text-blue-600 dark:text-blue-400", cardBg: "bg-blue-50 dark:bg-blue-950/50" },
        { title: "Revenue", value: "$42,580", change: "8%", icon: DollarSign, iconBg: "bg-purple-100 dark:bg-purple-900/50", iconColor: "text-purple-600 dark:text-purple-400", cardBg: "bg-purple-50 dark:bg-purple-950/50" },
        { title: "Conversion Rate", value: "24%", change: "3%", icon: Percent, iconBg: "bg-green-100 dark:bg-green-900/50", iconColor: "text-green-600 dark:text-green-400", cardBg: "bg-green-50 dark:bg-green-950/50" },
    ],
    topPerformers: [
        { id: 1, name: "Emma Johnson", avatar: "https://i.pravatar.cc/150?u=emma", performance: "12 new clients • $15,200 revenue", isTopSeller: true },
        { id: 2, name: "Michael Chen", avatar: "https://i.pravatar.cc/150?u=michaelchen", performance: "9 new clients • $10,450 revenue", isTopSeller: false },
        { id: 3, name: "Sophia Williams", avatar: "https://i.pravatar.cc/150?u=sophia", performance: "8 new clients • $9,320 revenue", isTopSeller: false },
    ]
}

export function SalesTeamPerformance() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Sales Team Performance</CardTitle>
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
