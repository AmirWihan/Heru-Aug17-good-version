
'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, Wand2, FileStack } from 'lucide-react';
import { DashboardScreenshot } from '@/components/screenshots/DashboardScreenshot';
import { DocumentManagementScreenshot } from '@/components/document-management-screenshot';
import { ClientDashboardScreenshot } from './client-dashboard-screenshot';

const features = [
    {
        icon: ShieldAlert,
        title: "Proactive Risk Alerts",
        description: "Our AI scans active cases for approaching deadlines and missing documents, giving you actionable alerts before they become problems.",
        visual: <DashboardScreenshot />
    },
    {
        icon: FileStack,
        title: "Streamlined Document Management",
        description: "A centralized hub for all case documents. AI can pre-fill forms, and clients can upload required files directly, saving you hours.",
        visual: <DocumentManagementScreenshot />
    },
    {
        icon: Wand2,
        title: "AI-Powered Case Timelines",
        description: "No more guessing games. Our AI provides a personalized, estimated roadmap of your client's entire immigration journey.",
        visual: <ClientDashboardScreenshot />
    }
];

export function LoginFeatureShowcase() {
    const [featureIndex, setFeatureIndex] = useState(0);

    useEffect(() => {
        // Choose a random feature on component mount
        setFeatureIndex(Math.floor(Math.random() * features.length));
    }, []);

    const currentFeature = features[featureIndex];
    const Icon = currentFeature.icon;

    return (
        <div className="w-full h-full bg-muted p-12 flex flex-col justify-center items-center">
            <div className="w-full max-w-2xl animate-fade">
                <div className="mb-8 text-center">
                    <div className="inline-block bg-primary/10 text-primary p-4 rounded-full mb-4">
                        <Icon className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold font-headline">{currentFeature.title}</h2>
                    <p className="text-muted-foreground mt-2 max-w-lg mx-auto">{currentFeature.description}</p>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary to-accent rounded-xl blur-2xl opacity-20"></div>
                     <div className="relative">
                        {currentFeature.visual}
                    </div>
                </div>
            </div>
        </div>
    );
}
