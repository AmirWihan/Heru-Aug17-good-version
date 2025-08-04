'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Monitor, Smartphone, Zap, Shield, Users, FileText } from 'lucide-react';

export function DesktopAppInfo() {
  const features = [
    {
      icon: Monitor,
      title: "Desktop Application",
      description: "Native desktop experience with offline capabilities"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance for seamless workflow"
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Local data storage with enterprise-grade encryption"
    },
    {
      icon: Users,
      title: "Team Sync",
      description: "Real-time collaboration across all devices"
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Advanced file handling and organization"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Experience VisaFor on Desktop
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Download our native desktop application for enhanced performance, offline capabilities, and a more powerful workflow experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
            <feature.icon className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
          <Download className="mr-2 h-5 w-5" />
          Download for macOS
        </Button>
        <Button size="lg" variant="outline" className="px-8">
          <Download className="mr-2 h-5 w-5" />
          Download for Windows
        </Button>
        <Badge variant="secondary" className="px-3 py-1">
          <Smartphone className="mr-1 h-4 w-4" />
          Mobile App Coming Soon
        </Badge>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Available for macOS 10.15+ and Windows 10+ • Free download
        </p>
      </div>
    </div>
  );
} 