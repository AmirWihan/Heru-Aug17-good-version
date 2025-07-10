
'use client';

import { BarChart, CheckCircle, ShieldCheck, Users, Zap } from 'lucide-react';
import { PricingTable } from '@/components/pricing-table';
import { TestimonialCard } from '@/components/testimonial-card';
import { testimonials, faqs } from '@/lib/data';
import { Faq } from '@/components/faq';
import { ClientManagementScreenshot } from '@/components/screenshots/ClientManagementScreenshot';
import { BillingScreenshot } from '@/components/screenshots/BillingScreenshot';
import { DashboardScreenshot } from '@/components/screenshots/DashboardScreenshot';

const lawyerFeatures = [
    {
        icon: Users,
        title: 'Centralized Client Management',
        description: 'Manage all your clients from a single, intuitive dashboard. Track case progress, documents, and communication history effortlessly.',
    },
    {
        icon: Zap,
        title: 'AI-Powered Efficiency Tools',
        description: 'Leverage AI to check applications for errors, summarize lengthy documents, and draft professional client communications in seconds.',
    },
    {
        icon: ShieldCheck,
        title: 'Proactive Risk Alerts',
        description: "Our AI scans active cases for approaching deadlines and missing documents, giving you alerts before they become problems.",
    },
     {
        icon: BarChart,
        title: 'Performance Analytics',
        description: "Gain insights into your firm's performance with reports on case success rates, client acquisition, and revenue.",
    },
];

export default function ForLawyersPage() {
    const lawyerTestimonial = testimonials.find(t => t.role === 'lawyer');
    const lawyerFaqs = faqs.filter(f => f.for === 'lawyer');

    return (
        <div className="space-y-20 py-16">
            {/* Hero Section */}
            <section className="container text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">The AI-Powered CRM for Modern Immigration Firms</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Stop juggling spreadsheets and generic tools. VisaFor is designed specifically for immigration professionals, helping you save time, reduce errors, and grow your practice.
                </p>
            </section>

            {/* Screenshots Section */}
            <section className="container">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-3xl font-bold font-headline">One Platform to Run Your Entire Practice</h2>
                        <p className="text-muted-foreground">From client intake to final submission, VisaFor provides the tools you need to stay organized and efficient.</p>
                    </div>
                     <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DashboardScreenshot />
                        <ClientManagementScreenshot />
                    </div>
                </div>
            </section>

             {/* Features Section */}
            <section className="container">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold font-headline">Features Built for Immigration Professionals</h2>
                     <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Everything you need to streamline your workflow and deliver exceptional service.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {lawyerFeatures.map((feature) => (
                        <div key={feature.title} className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Pricing Section */}
            <section id="pricing" className="container">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold font-headline">Find the Perfect Plan</h2>
                     <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">Start for free and scale as you grow. No long-term contracts, cancel anytime.</p>
                </div>
                <PricingTable />
            </section>

            {/* Testimonial Section */}
            {lawyerTestimonial && (
                 <section className="container">
                    <div className="max-w-4xl mx-auto">
                        <TestimonialCard testimonial={lawyerTestimonial} />
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            <section className="container">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-bold font-headline">Frequently Asked Questions</h2>
                </div>
                 <div className="max-w-3xl mx-auto">
                    <Faq faqs={lawyerFaqs} />
                </div>
            </section>
        </div>
    );
}
