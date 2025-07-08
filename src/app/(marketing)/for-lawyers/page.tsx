import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldAlert, Users, FileStack, DollarSign, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { PricingTable } from '@/components/pricing-table';
import { Faq } from '@/components/faq';
import { TestimonialCard } from '@/components/testimonial-card';
import { faqs, testimonials } from '@/lib/data';
import { DashboardScreenshot } from '@/components/screenshots/DashboardScreenshot';
import { ClientManagementScreenshot } from '@/components/screenshots/ClientManagementScreenshot';
import { DocumentManagementScreenshot } from '@/components/document-management-screenshot';
import { BillingScreenshot } from '@/components/screenshots/BillingScreenshot';


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

       {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 space-y-24">
            {/* Feature 1: AI Risk Alerts */}
             <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-4">
                    <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                        <ShieldAlert className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold font-headline">Proactive, AI-Powered Insights</h2>
                    <p className="text-lg text-muted-foreground">
                       Don't wait for problems to arise. Our AI scans active cases for approaching deadlines and missing documents, giving you actionable alerts before they become critical issues.
                    </p>
                    <ul className="space-y-2 pt-2">
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Automatic Deadline Tracking</span></li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Missing Document Alerts</span></li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Stale Case Notifications</span></li>
                    </ul>
                </div>
                <div>
                    <DashboardScreenshot />
                </div>
            </div>
            
            {/* Feature 2: Client Management */}
             <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="md:order-2 space-y-4">
                    <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                        <Users className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold font-headline">A Single Hub for Every Client</h2>
                    <p className="text-lg text-muted-foreground">
                       Move beyond spreadsheets. Heru provides a robust CRM to manage client details, track case progress, and log all communications in one organized place.
                    </p>
                    <ul className="space-y-2 pt-2">
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Centralized Client Database</span></li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Case Status Tracking</span></li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Detailed Activity Logs</span></li>
                    </ul>
                </div>
                <div className="md:order-1">
                    <ClientManagementScreenshot />
                </div>
            </div>

            {/* Feature 3: Document Hub */}
             <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-4">
                    <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                        <FileStack className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold font-headline">Automate Your Document Workflow</h2>
                    <p className="text-lg text-muted-foreground">
                      Request, review, and manage all case-related documents securely. Our AI can even pre-fill standard forms based on client data, saving you countless hours.
                    </p>
                    <ul className="space-y-2 pt-2">
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>AI-Powered Form Filling</span></li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Secure Client Document Uploads</span></li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Centralized Document Library</span></li>
                    </ul>
                </div>
                <div>
                    <DocumentManagementScreenshot />
                </div>
            </div>

            {/* Feature 4: Billing */}
             <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="md:order-2 space-y-4">
                    <div className="inline-block bg-primary/10 text-primary p-3 rounded-full mb-4">
                        <DollarSign className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold font-headline">Simplify Your Billing</h2>
                    <p className="text-lg text-muted-foreground">
                      Generate invoices, track payments, and get a clear overview of your firm's financial health. With QuickBooks integration, your accounting is always in sync.
                    </p>
                     <ul className="space-y-2 pt-2">
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Automated Invoicing</span></li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Real-time Revenue Tracking</span></li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Seamless QuickBooks Integration</span></li>
                    </ul>
                </div>
                <div className="md:order-1">
                    <BillingScreenshot />
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
