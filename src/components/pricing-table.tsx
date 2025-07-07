'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { plans } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Check, Star } from 'lucide-react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import Link from 'next/link';

export function PricingTable() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('annually');
    const proPlan = plans.find(p => p.id === 'pro');

    return (
        <div className="mt-12 space-y-8">
            <div className="flex items-center justify-center gap-4">
                <Label htmlFor="billing-cycle" className={cn(billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>Monthly</Label>
                <Switch 
                    id="billing-cycle"
                    checked={billingCycle === 'annually'}
                    onCheckedChange={(checked) => setBillingCycle(checked ? 'annually' : 'monthly')}
                />
                <Label htmlFor="billing-cycle" className={cn(billingCycle === 'annually' ? 'text-foreground' : 'text-muted-foreground')}>
                    Annually <span className="text-green-600 font-normal">(Save 17%)</span>
                </Label>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {plans.map((plan, index) => (
                    <Card key={plan.id} className={cn(
                        "flex flex-col",
                        plan.id === 'pro' && 'border-primary ring-2 ring-primary relative'
                    )}>
                        {plan.id === 'pro' && (
                             <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <Badge variant="default" className="flex items-center gap-1">
                                    <Star className="h-4 w-4" /> Most Popular
                                </Badge>
                            </div>
                        )}
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                            <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                            <div className="pt-4">
                                {typeof plan.price === 'object' ?
                                    <>
                                        <span className="text-4xl font-bold">${billingCycle === 'annually' ? Math.floor(plan.price.annually / 12) : plan.price.monthly}</span>
                                        <span className="text-muted-foreground"> / user / mo</span>
                                        {billingCycle === 'annually' && <p className="text-xs text-muted-foreground">Billed as ${plan.price.annually} annually</p>}
                                    </>
                                : <span className="text-4xl font-bold">Custom</span>
                                }
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <ul className="space-y-3">
                                <li className="flex items-center gap-3"><Check className="h-5 w-5 text-green-500" /><span>Up to <span className="font-semibold">{plan.userLimit} users</span></span></li>
                                <li className="flex items-center gap-3"><Check className="h-5 w-5 text-green-500" /><span>Up to <span className="font-semibold">{plan.clientLimit} clients</span></span></li>
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-center gap-3"><Check className="h-5 w-5 text-green-500" /><span>{feature}</span></li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Link href="/register" className="w-full">
                                <Button className="w-full" variant={plan.id === 'pro' ? 'default' : 'outline'}>
                                    {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
