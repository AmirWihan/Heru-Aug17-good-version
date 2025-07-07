import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Star } from "lucide-react";

type Testimonial = {
    quote: string;
    name: string;
    role: string;
    avatar: string;
};

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
    return (
        <Card className="bg-transparent border-0 shadow-none">
            <CardContent className="p-0 text-center">
                 <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                </div>
                <blockquote className="text-xl md:text-2xl font-medium">
                    "{testimonial.quote}"
                </blockquote>
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
