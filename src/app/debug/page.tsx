'use client';

import { useGlobalData } from '@/context/GlobalDataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
    const { clients, teamMembers, login } = useGlobalData();

    const testLogin = async (email: string, password: string) => {
        try {
            console.log('🧪 Testing login with:', { email, password });
            const result = await login(email, password);
            console.log('🧪 Login result:', result);
            alert(`Login ${result ? 'SUCCESS' : 'FAILED'}: ${result ? result.name : 'No user returned'}`);
        } catch (error: any) {
            console.log('🧪 Login error:', error);
            alert(`Login ERROR: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Available Clients ({clients.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {clients.map(client => (
                                <div key={client.id} className="p-2 border rounded">
                                    <div><strong>{client.name}</strong></div>
                                    <div className="text-sm text-gray-600">{client.email}</div>
                                    <div className="text-xs text-gray-500">Password: {client.password}</div>
                                    <Button 
                                        size="sm" 
                                        onClick={() => testLogin(client.email, client.password || 'password123')}
                                        className="mt-1"
                                    >
                                        Test Login
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Available Team Members ({teamMembers.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {teamMembers.map(member => (
                                <div key={member.id} className="p-2 border rounded">
                                    <div><strong>{member.name}</strong></div>
                                    <div className="text-sm text-gray-600">{member.email}</div>
                                    <div className="text-xs text-gray-500">Password: {member.password}</div>
                                    <div className="text-xs text-gray-500">Type: {member.type}</div>
                                    <Button 
                                        size="sm" 
                                        onClick={() => testLogin(member.email, member.password || 'password123')}
                                        className="mt-1"
                                    >
                                        Test Login
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Quick Test Buttons</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-x-4">
                        <Button onClick={() => testLogin('admin@heru.com', 'password123')}>
                            Test Super Admin
                        </Button>
                        <Button onClick={() => testLogin('sarah.johnson@example.com', 'password123')}>
                            Test Lawyer
                        </Button>
                        <Button onClick={() => testLogin('james.wilson@example.com', 'password123')}>
                            Test Client
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 