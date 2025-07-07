'use client';
import { useState, useEffect } from 'react';
import { ClientDashboardScreenshot } from './client-dashboard-screenshot';
import { LawyerDashboardScreenshot } from './lawyer-dashboard-screenshot';
import { DocumentManagementScreenshot } from './document-management-screenshot';
import { Bot, GanttChartSquare, FolderKanban } from 'lucide-react';

const features = [
    {
        icon: Bot,
        title: "AI-Powered Risk Alerts",
        description: "Proactively identify at-risk cases with AI that scans for approaching deadlines, missing documents, and stale files.",
        visual: <LawyerDashboardScreenshot />,
    },
    {
        icon: GanttChartSquare,
        title: "Automated Client Timelines",
        description: "Give your clients peace of mind with personalized, AI-generated timelines of their entire immigration journey.",
        visual: <ClientDashboardScreenshot />,
    },
    {
        icon: FolderKanban,
        title: "Streamlined Document Management",
        description: "A centralized hub for all case documents. AI pre-fills forms, and clients can upload required files directly, saving you hours of manual work.",
        visual: <DocumentManagementScreenshot />,
    }
];


export function LoginFeatureShowcase() {
    const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

    // Use useEffect to set a random feature index on mount to avoid hydration mismatch
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * features.length);
        setCurrentFeatureIndex(randomIndex);
    }, []);

    const currentFeature = features[currentFeatureIndex];

    return (
        <div className="flex flex-col h-full p-8 md:p-12 bg-muted justify-center">
            <div className="w-full max-w-2xl mx-auto space-y-8 animate-fade">
                <div className="space-y-4">
                    <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-full">
                        <currentFeature.icon className="w-6 h-6" />
                    </div>
                    <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground">
                        {currentFeature.title}
                    </h2>
                    <p className="text-muted-foreground md:text-lg">
                        {currentFeature.description}
                    </p>
                </div>

                <div className="relative aspect-[4/3] transition-all duration-500 ease-in-out">
                    {currentFeature.visual}
                </div>
            </div>
        </div>
    );
}
