'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const billingSchema = z.object({
  cardNumber: z.string().min(13, "Please enter a valid card number."),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Please enter a valid expiry date (MM/YY)."),
  cvv: z.string().min(3, "Please enter a valid CVV."),
  cardholderName: z.string().min(2, "Please enter the cardholder name."),
  billingAddress: z.string().min(10, "Please enter your billing address."),
  city: z.string().min(2, "Please enter your city."),
  postalCode: z.string().min(3, "Please enter your postal code."),
  country: z.string().min(2, "Please enter your country."),
  plan: z.enum(['starter', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'annually']),
});

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 29, annually: 290 },
    features: [
      'Up to 10 clients',
      'Basic document management',
      'Email support',
      'Standard templates'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Team',
    price: { monthly: 99, annually: 990 },
    features: [
      'Up to 50 clients',
      'Advanced AI tools',
      'Priority support',
      'Custom templates',
      'Team collaboration',
      'Analytics dashboard'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 299, annually: 2990 },
    features: [
      'Unlimited clients',
      'Full AI suite',
      '24/7 support',
      'Custom integrations',
      'Advanced analytics',
      'White-label options',
      'Dedicated account manager'
    ]
  }
];

import { useRouter } from 'next/navigation';

export function BillingSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof billingSchema>>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      billingAddress: '',
      city: '',
      postalCode: '',
      country: '',
      plan: 'pro',
      billingCycle: 'monthly',
    }
  });

  const selectedPlan = form.watch('plan');
  const billingCycle = form.watch('billingCycle');
  const currentPlan = plans.find(p => p.id === selectedPlan);

  const onSubmit = async (values: z.infer<typeof billingSchema>) => {
    setIsLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Payment Successful!',
        description: `Your ${currentPlan?.name} subscription has been activated.`,
      });
      
      // Here you would typically update the user's subscription status
      if (typeof window !== 'undefined') {
        localStorage.setItem('cardOnFile', 'true');
      }
      console.log('Payment processed:', values);
      // Redirect to dashboard after successful payment
      router.replace('/lawyer/dashboard');
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'Please check your card details and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">Manage your subscription and payment information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Choose Your Plan
            </CardTitle>
            <CardDescription>Select the plan that best fits your practice needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="space-y-3">
                      {plans.map((plan) => (
                        <div key={plan.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                          <RadioGroupItem value={plan.id} id={plan.id} />
                          <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold">{plan.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  ${plan.price[billingCycle]}/{billingCycle === 'monthly' ? 'month' : 'year'}
                                </div>
                              </div>
                              <Badge variant={selectedPlan === plan.id ? 'default' : 'secondary'}>
                                {selectedPlan === plan.id ? 'Selected' : 'Select'}
                              </Badge>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="billingCycle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Cycle</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="annually" id="annually" />
                        <Label htmlFor="annually">Annually (Save 20%)</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {currentPlan && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Plan Features:</h4>
                <ul className="space-y-1 text-sm">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>Your payment information is encrypted and secure</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012 3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main Street" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Toronto" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="M5V 3A8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Canada" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Your payment information is encrypted and secure. We use industry-standard SSL encryption.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Processing...' : `Subscribe to ${currentPlan?.name} - $${currentPlan?.price[billingCycle]}/${billingCycle === 'monthly' ? 'month' : 'year'}`}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 