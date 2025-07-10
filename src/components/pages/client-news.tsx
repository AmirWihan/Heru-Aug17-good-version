'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { newsFeedData } from "@/lib/data";
import { Newspaper, Rss } from "lucide-react";

export function ClientNewsPage() {

    const getBadgeVariant = (type: string) => {
        switch (type.toLowerCase()) {
            case 'seminar': return 'info';
            case 'offer': return 'success';
            case 'update': return 'warning';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Newspaper className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold font-headline text-foreground">News & Updates</h1>
                    <p className="text-muted-foreground">The latest news, seminar invitations, and special offers from our legal network.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsFeedData.map((item) => (
                    <Card key={item.id} className="flex flex-col">
                        <CardHeader>
                             <div className="flex items-center gap-3 mb-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={item.authorAvatar} />
                                    <AvatarFallback>{item.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{item.authorName}</p>
                                    <p className="text-sm text-muted-foreground">{item.authorFirm}</p>
                                </div>
                            </div>
                            <Badge variant={getBadgeVariant(item.type)} className="w-fit">{item.type}</Badge>
                            <CardTitle className="pt-2">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground text-sm line-clamp-3">{item.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
                           <span>{item.date}</span>
                           <Button variant="link" className="p-0 h-auto">Read More</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <Button variant="outline" className="w-full">
                <Rss className="mr-2 h-4 w-4" /> Load More Updates
            </Button>
        </div>
    );
}
