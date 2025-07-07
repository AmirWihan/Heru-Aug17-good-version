import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Briefcase, Users } from 'lucide-react';
import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';

export default function RoleSelectPage() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <MarketingHeader />
      <main className="flex-1 flex items-center justify-center">
        <section className="container mx-auto px-4 py-20 text-center max-w-4xl">
           <DynamicLogoIcon className="h-16 w-16 mx-auto mb-6" />
           <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Welcome to Heru
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The all-in-one platform for immigration. Please select your role to get started.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/for-lawyers">
              <Card className="text-left h-full hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 group bg-card">
                <CardContent className="p-8">
                  <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-headline">I'm a Legal Professional</h2>
                  <p className="mt-2 text-muted-foreground">
                    Manage your clients, streamline your firm, and leverage AI tools.
                  </p>
                  <div className="mt-6 font-semibold text-primary flex items-center group-hover:underline">
                    Explore the CRM <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/for-clients">
              <Card className="text-left h-full hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 group bg-card">
                <CardContent className="p-8">
                  <div className="bg-green-500/10 text-green-600 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold font-headline">I'm an Applicant</h2>
                  <p className="mt-2 text-muted-foreground">
                    Connect with experts, manage your documents, and track your case.
                  </p>
                   <div className="mt-6 font-semibold text-primary flex items-center group-hover:underline">
                    Start Your Journey <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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