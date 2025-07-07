import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart, ShieldAlert, Users, Zap, PlayCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { LawyerDashboardScreenshot } from '@/components/lawyer-dashboard-screenshot';
import { PricingTable } from '@/components/pricing-table';
import { Faq } from '@/components/faq';
import { TestimonialCard } from '@/components/testimonial-card';
import { faqs, testimonials } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

const lawyerTestimonial = testimonials.find((t) => t.role === 'lawyer');

export default function ForLawyersPage() {
  return (
    <div className="dark bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Immigration professional working"
            fill
            className="object-cover opacity-20"
            data-ai-hint="professional business background"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center z-10">
          <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Trusted by 500+ Immigration Lawyers
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
            A Smarter Way to
            <br />
            <span className="text-cyan-400">Manage Immigration Cases</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Streamline your immigration law practice with our all-in-one CRM. Track cases, manage documents, and communicate with clients effortlessly.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">Start Free Trial <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
            <Link href="#">
              <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 hover:text-white w-full sm:w-auto">
                <PlayCircle className="mr-2 h-5 w-5" /> Watch Demo
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Cancel Anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-background">
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
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block bg-destructive/10 text-destructive p-3 rounded-full mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">Disorganized Cases</h3>
              <p className="text-muted-foreground mt-2">
                Juggling client data across spreadsheets, emails, and physical
                files leads to costly errors and inefficiencies.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block bg-destructive/10 text-destructive p-3 rounded-full mb-4">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg">Compliance & Risk</h3>
              <p className="text-muted-foreground mt-2">
                Manually tracking deadlines and document versions is a huge
                compliance risk. One missed date can jeopardize a client's
                entire case.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block bg-destructive/10 text-destructive p-3 rounded-full mb-4">
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

      {/* Solution/Feature Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
              <Zap className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold font-headline">
              Your All-in-One Command Center
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Heru brings everything you need into one intelligent
              platform, designed to supercharge your practice.
            </p>
          </div>
          <div className="mt-12">
            <LawyerDashboardScreenshot />
          </div>
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-1">
              <h3 className="font-semibold">Centralized Client Management</h3>
              <p className="text-muted-foreground">
                Manage every client profile, document, task, and communication
                from a single, unified view.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">AI-Powered Risk Analysis</h3>
              <p className="text-muted-foreground">
                Our AI proactively scans your caseload for approaching
                deadlines, missing documents, and stale cases.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Automated Document Checklists</h3>
              <p className="text-muted-foreground">
                Assign pre-built or custom document checklists to clients and
                track submission status in real-time.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Secure Client Portal</h3>
              <p className="text-muted-foreground">
                Give clients a secure, branded portal to upload documents, view
                case progress, and communicate with your team.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">AI-Assisted Communication</h3>
              <p className="text-muted-foreground">
                Generate professional client emails and case summaries in
                seconds, tailored to the specific context.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Advanced Reporting</h3>
              <p className="text-muted-foreground">
                Get instant insights into your firm's revenue, client
                acquisition, and team performance with visual reports.
              </p>
            </div>
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
      <section className="py-20 border-t border-border">
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
