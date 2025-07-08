import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, FileStack, ShieldAlert, Users, Wand2, Zap, FileHeart } from 'lucide-react';
import Link from 'next/link';
import { LawyerDashboardScreenshot } from '@/components/lawyer-dashboard-screenshot';
import { PricingTable } from '@/components/pricing-table';
import { Faq } from '@/components/faq';
import { TestimonialCard } from '@/components/testimonial-card';
import { faqs, testimonials } from '@/lib/data';
import { DocumentManagementScreenshot } from '@/components/document-management-screenshot';
import { ClientDashboardScreenshot } from '@/components/client-dashboard-screenshot';

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

      {/* Problem Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold font-headline">
              The Old Way is Broken
            </h2>
            <p className="mt-4 text-muted-foreground">
              Managing an immigration practice involves navigating a maze of
              documents, deadlines, and constant client communication. It's easy
              to get bogged down.
            </p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 text-destructive mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">Disorganized Cases</h3>
              <p className="text-muted-foreground mt-2">
                Juggling client data across spreadsheets, emails, and physical
                files leads to costly errors and inefficiencies.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 text-destructive mb-4">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">Compliance & Risk</h3>
              <p className="text-muted-foreground mt-2">
                Manually tracking deadlines and document versions is a huge
                compliance risk. One missed date can jeopardize a client's
                entire case.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 text-destructive mb-4">
                <BarChart className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">No Clear Overview</h3>
              <p className="text-muted-foreground mt-2">
                Without a centralized dashboard, it's impossible to get a
                real-time view of your firm's performance, revenue, and case
                pipeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 1: Centralized Dashboard */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-headline">A Single Source of Truth for Every Case</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Heru's intelligent dashboard gives you a 360-degree view of your firm. Track client progress, monitor team tasks, and see revenue insights—all in one place.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3"><Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" /><div><h4 className="font-semibold">Centralized Client Management</h4><p className="text-muted-foreground">Access every client profile, document, and communication instantly.</p></div></li>
              <li className="flex items-start gap-3"><ShieldAlert className="h-6 w-6 text-primary flex-shrink-0 mt-1" /><div><h4 className="font-semibold">AI-Powered Risk Alerts</h4><p className="text-muted-foreground">Proactively identify approaching deadlines and missing documents before they become problems.</p></div></li>
              <li className="flex items-start gap-3"><BarChart className="h-6 w-6 text-primary flex-shrink-0 mt-1" /><div><h4 className="font-semibold">Firm-Wide Reporting</h4><p className="text-muted-foreground">Make data-driven decisions with real-time analytics on revenue, case types, and team performance.</p></div></li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-r from-primary to-accent rounded-xl blur-2xl opacity-10 animate-pulse"></div>
            <div className="relative">
              <LawyerDashboardScreenshot />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: AI Document Automation */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="md:order-2">
            <h2 className="text-3xl font-bold font-headline">Automate the Tedious. Focus on the Strategy.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Stop wasting billable hours on repetitive data entry. Heru’s AI can pre-fill complex immigration forms from a single client intake form, drastically reducing preparation time and eliminating costly errors.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3"><Wand2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" /><div><h4 className="font-semibold">Intelligent Form Filling</h4><p className="text-muted-foreground">Complete a client's intake once and let AI populate dozens of official forms.</p></div></li>
              <li className="flex items-start gap-3"><FileStack className="h-6 w-6 text-primary flex-shrink-0 mt-1" /><div><h4 className="font-semibold">Streamlined Document Management</h4><p className="text-muted-foreground">Request, review, and approve documents in a centralized, easy-to-track system.</p></div></li>
            </ul>
          </div>
          <div className="md:order-1 relative">
            <div className="absolute -inset-8 bg-gradient-to-l from-primary to-accent rounded-xl blur-2xl opacity-10 animate-pulse"></div>
            <div className="relative">
              <DocumentManagementScreenshot />
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: Client Collaboration */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold font-headline">A Seamless Experience for Your Clients</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Empower your clients with a secure, professional portal where they can track their application progress, upload documents, and communicate with your team.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3"><FileHeart className="h-6 w-6 text-primary flex-shrink-0 mt-1" /><div><h4 className="font-semibold">Secure Document Upload</h4><p className="text-muted-foreground">Clients can easily upload requested documents, which appear directly in their case file.</p></div></li>
              <li className="flex items-start gap-3"><Zap className="h-6 w-6 text-primary flex-shrink-0 mt-1" /><div><h4 className="font-semibold">AI-Powered Timelines</h4><p className="text-muted-foreground">Provide clients with a personalized, estimated timeline of their immigration journey.</p></div></li>
            </ul>
          </div>
          <div className="relative">
              <ClientDashboardScreenshot />
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
