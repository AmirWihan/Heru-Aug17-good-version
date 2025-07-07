import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { LawyerDashboardScreenshot } from '@/components/lawyer-dashboard-screenshot';
import { DocumentManagementScreenshot } from '@/components/document-management-screenshot';

export default function ForLawyersPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline">
                        Stop Drowning in Paperwork.
                        <br />
                        <span className="text-primary">Start Winning Cases.</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                        ImmiAssist is the AI-powered CRM built for modern immigration firms. Centralize client data, automate tasks, and mitigate risks with our intelligent platform, so you can focus on what matters most: your clients.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <Link href="/register">
                            <Button size="lg">Get Started for Free</Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline">Request a Demo</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature 1: AI Risk Alerts */}
            <section className="py-16 bg-muted/50">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                        <div className="inline-block bg-primary/10 text-primary p-3 rounded-full">
                            <ShieldAlert className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-bold font-headline">Proactively Mitigate Risk</h2>
                        <p className="text-lg text-muted-foreground">
                            Our AI system scans your active cases for approaching deadlines, missing documents, and stale files, providing you with actionable alerts before they become problems.
                        </p>
                        <ul className="space-y-2 pt-2">
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Automated Deadline Tracking</span></li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Missing Document Flags</span></li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500" /><span>Stale Case Identification</span></li>
                        </ul>
                    </div>
                    <div>
                        <LawyerDashboardScreenshot />
                    </div>
                </div>
            </section>

            {/* Feature 2: Document Management */}
            <section className="py-16">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div className="md:order-2 space-y-4">
                        <h2 className="text-3xl font-bold font-headline">Streamline Document Management</h2>
                        <p className="text-lg text-muted-foreground">
                            A centralized hub for all case documents. AI can pre-fill forms, and clients can upload required files directly, saving you hours of manual work and back-and-forth emails.
                        </p>
                    </div>
                    <div className="md:order-1">
                        <DocumentManagementScreenshot />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 border-t">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Transform Your Practice?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Join hundreds of legal professionals who trust ImmiAssist.</p>
                    <div className="mt-6">
                        <Link href="/register">
                            <Button size="lg">Sign Up Now <ArrowRight className="ml-2 h-4 w-4" /></Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
