import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Briefcase, Users } from 'lucide-react';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <MarketingHeader />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline">
            The Intelligent CRM for Immigration Professionals.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Heru is the all-in-one platform connecting applicants with legal professionals and empowering firms with AI-driven tools to streamline case management.
          </p>
          <p className="mt-8 font-semibold text-lg">Who are you?</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/for-lawyers">
              <Card className="text-left h-full hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-8">
                  <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full mb-4">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-headline">A Legal Professional</h2>
                  <p className="mt-2 text-muted-foreground">
                    Supercharge your firm with AI tools, manage clients effortlessly, and grow your practice.
                  </p>
                  <div className="mt-6 font-semibold text-primary flex items-center">
                    Explore the CRM <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/for-clients">
              <Card className="text-left h-full hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
                <CardContent className="p-8">
                  <div className="bg-accent/20 text-accent-foreground w-12 h-12 flex items-center justify-center rounded-full mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-headline">An Applicant</h2>
                  <p className="mt-2 text-muted-foreground">
                    Navigate your journey with confidence, find verified lawyers, and track your case progress.
                  </p>
                   <div className="mt-6 font-semibold text-primary flex items-center">
                    Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
