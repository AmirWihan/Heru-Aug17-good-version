
'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useGlobalData } from '@/context/GlobalDataContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, Briefcase, Shield, User, Crown, Sparkles, Globe, Users, FileText, Clock } from 'lucide-react';
import { DesktopAppInfo } from '@/components/desktop-app-info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicLogoIcon } from '@/components/icons/DynamicLogoIcon';
import Link from 'next/link';

export default function RoleSelectionPage() {
    const { login } = useGlobalData();
    const router = useRouter();
    const { toast } = useToast();

    const handleAdminLogin = async () => {
        try {
            // Direct login as super admin without authentication
            router.push('/superadmin/dashboard');
        } catch (error) {
            toast({ title: 'Admin Login Failed', variant: 'destructive' });
        }
    };

    const features = [
        {
            icon: Sparkles,
            title: "AI-Powered Tools",
            description: "Document analysis, risk assessment, and intelligent case management"
        },
        {
            icon: Users,
            title: "Team Collaboration",
            description: "Seamless communication between lawyers, clients, and team members"
        },
        {
            icon: FileText,
            title: "Document Management",
            description: "Secure storage, version control, and automated document processing"
        },
        {
            icon: Clock,
            title: "Real-time Updates",
            description: "Track application progress and receive instant notifications"
        }
    ];

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
            
            <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleAdminLogin} title="Super Admin Login" className="hover:bg-yellow-100">
                    <Crown className="h-6 w-6 text-yellow-500" />
                </Button>
                <Link href="/lawyer/demo">
                    <Button variant="ghost" size="sm" className="hover:bg-purple-100 text-purple-600">
                        <Briefcase className="h-4 w-4 mr-1" />
                        Demo Lawyer
                    </Button>
                </Link>
            </div>
            
            <div className="text-center mb-12 max-w-4xl">
                <div className="flex justify-center mb-6">
                    <DynamicLogoIcon className="h-20 w-20 mx-auto animate-pulse" />
                </div>
                <h1 className="text-5xl font-bold font-headline text-foreground mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Welcome to VisaFor
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    The AI-powered CRM platform that revolutionizes immigration case management for legal professionals and their clients.
                </p>
                
                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                            <feature.icon className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                            <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <Link href="/login?role=client" className="h-full group">
                    <Card className="text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full flex flex-col border-2 hover:border-blue-200 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="flex-1">
                            <div className="relative">
                                <User className="h-20 w-20 mx-auto text-blue-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    Client
                                </div>
                            </div>
                            <CardTitle className="mt-4 text-2xl font-bold text-gray-800">I am an Applicant</CardTitle>
                            <CardDescription className="mt-2 text-gray-600">
                                Track your application, manage documents, and communicate with your legal team. Get AI-powered insights and stay updated on your immigration journey.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                                Proceed as Applicant <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/login?role=lawyer" className="h-full group">
                    <Card className="text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer h-full flex flex-col border-2 hover:border-indigo-200 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="flex-1">
                            <div className="relative">
                                <Briefcase className="h-20 w-20 mx-auto text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                                    Professional
                                </div>
                            </div>
                            <CardTitle className="mt-4 text-2xl font-bold text-gray-800">I am a Lawyer</CardTitle>
                            <CardDescription className="mt-2 text-gray-600">
                                Manage your clients, streamline your workflow with AI tools, and grow your practice. Access powerful analytics and team collaboration features.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-300">
                                Proceed as Lawyer <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            {/* Desktop App Section */}
            <div className="w-full max-w-6xl mx-auto mt-16 px-4">
                <DesktopAppInfo />
            </div>
            
            <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Designed & Empowered by VisaFor</span>
                    <span>•</span>
                    <span>AI-Powered Immigration CRM</span>
                </div>
            </footer>
        </div>
    );
}
