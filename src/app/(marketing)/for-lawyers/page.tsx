import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, FileStack, ShieldAlert, Users, Wand2, Zap, FileHeart } from 'lucide-react';
import Link from 'next/link';
import { PricingTable } from '@/components/pricing-table';
import { Faq } from '@/components/faq';
import { TestimonialCard } from '@/components/testimonial-card';
import { faqs, testimonials } from '@/lib/data';
import { FeatureTabs } from '@/components/feature-tabs';


const lawyerTestimonial = testimonials.find((t) => t.role === 'lawyer');

export default function ForLawyersPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            The Command Center for <br /> Modern Immigration Firms.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Stop juggling spreadsheets and disconnected tools. Heru is the
            all-in-one CRM designed to help you manage clients, automate
            workflows, and grow your practice with AI-powered insights.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg">Start Your Free Trial</Button>
            </Link>
          </div>
        </div>
      </section>

       {/* Features Tabs Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-headline">A Single Source of Truth for Every Case</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From your firm's high-level performance to the fine details of each client file, Heru brings everything together in one intelligent, AI-powered platform.
            </p>
          </div>
          <div className="mt-12">
            <FeatureTabs />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-headline">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that's right for your firm's size and needs. No
              hidden fees.
            </p>
          </div>
          <PricingTable />
        </div>
      </section>

      {/* Testimonial Section */}
      {lawyerTestimonial && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 max-w-3xl">
            <TestimonialCard testimonial={lawyerTestimonial} />
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-headline">
              Frequently Asked Questions
            </h2>
          </div>
          <Faq faqs={faqs.filter((f) => f.for === 'lawyer')} />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Ready to Revolutionize Your Practice?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join hundreds of legal professionals who trust Heru to grow
            their firm.
          </p>
          <div className="mt-6">
            <Link href="/register">
              <Button size="lg">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
