import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container grid gap-12 py-12 lg:grid-cols-4">
        <div className="lg:col-span-1 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <DynamicLogoIcon className="h-8 w-8" />
            <span className="font-bold font-headline text-xl">Heru</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            The all-in-one platform for modern immigration firms and applicants.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:col-span-3">
            <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/for-lawyers" className="text-muted-foreground hover:text-foreground">For Lawyers</Link></li>
                    <li><Link href="/for-clients" className="text-muted-foreground hover:text-foreground">For Applicants</Link></li>
                    <li><Link href="/for-lawyers#pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                </ul>
            </div>
             <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                </ul>
            </div>
             <div className="md:col-span-1 col-span-2">
                <h4 className="font-semibold mb-4">Stay Updated</h4>
                <p className="text-muted-foreground text-sm mb-4">Subscribe for the latest product updates and news.</p>
                <div className="flex w-full items-center space-x-2">
                    <Input type="email" placeholder="Email" className="bg-background" />
                    <Button type="submit">Subscribe</Button>
                </div>
            </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between py-6 text-sm text-muted-foreground">
            <p>&copy; 2024 Heru Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                 <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                 <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
