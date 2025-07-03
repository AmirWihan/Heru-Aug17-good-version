'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { messagesData as initialMessagesData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Search, SendHorizontal, Video, Phone, Mail } from 'lucide-react';

type Message = {
    id: number;
    sender: string;
    text: string;
    timestamp: string;
};

type Conversation = {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    messages: Message[];
    isGroup?: boolean;
};

export function MessagesPage() {
    const [messagesData, setMessagesData] = useState<Conversation[]>(initialMessagesData);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(messagesData[0] || null);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const message: Message = {
            id: Date.now(),
            sender: 'me',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        const updatedConversations = messagesData.map(convo => {
            if (convo.id === selectedConversation.id) {
                return {
                    ...convo,
                    messages: [...convo.messages, message],
                    lastMessage: newMessage,
                    time: 'Just now',
                };
            }
            return convo;
        });

        // Move the updated conversation to the top
        const currentConvo = updatedConversations.find(c => c.id === selectedConversation.id);
        const otherConvos = updatedConversations.filter(c => c.id !== selectedConversation.id);
        const newMessagesData = [currentConvo!, ...otherConvos];

        setMessagesData(newMessagesData);
        setSelectedConversation(currentConvo!);
        setNewMessage('');
    };
    
    return (
        <div className="h-[calc(100vh-10rem)] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="md:col-span-1 lg:col-span-1 flex flex-col h-full">
                <CardHeader className="p-4 border-b">
                    <div className="relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input placeholder="Search messages..." className="pl-10"/>
                    </div>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="p-2">
                        {messagesData.map((convo) => (
                            <button
                                key={convo.id}
                                className={cn(
                                    'flex w-full items-center gap-3 p-3 text-left rounded-lg transition-colors hover:bg-muted',
                                    selectedConversation?.id === convo.id && 'bg-muted'
                                )}
                                onClick={() => {
                                    setSelectedConversation(convo);
                                    // Mark messages as read
                                    const updatedData = messagesData.map(c => 
                                        c.id === convo.id ? { ...c, unreadCount: 0 } : c
                                    );
                                    setMessagesData(updatedData);
                                }}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={convo.avatar} alt={convo.name} />
                                    <AvatarFallback>{convo.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 truncate">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-semibold">{convo.name}</p>
                                        <p className="text-xs text-muted-foreground">{convo.time}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                        {convo.unreadCount > 0 && (
                                            <Badge variant="destructive" className="flex-shrink-0">{convo.unreadCount}</Badge>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
                {selectedConversation ? (
                    <>
                        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                                    <AvatarFallback>{selectedConversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold">{selectedConversation.name}</p>
                                    <p className="text-xs text-green-500">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon"><Phone className="h-5 w-5"/></Button>
                                <Button variant="ghost" size="icon"><Video className="h-5 w-5"/></Button>
                            </div>
                        </CardHeader>

                        <ScrollArea className="flex-1 p-4 bg-muted/20">
                            <div className="space-y-4">
                                {selectedConversation.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={cn(
                                            'flex items-end gap-2 max-w-[80%] md:max-w-[60%]',
                                            msg.sender === 'me' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'p-3 rounded-2xl',
                                                msg.sender === 'me'
                                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                                    : 'bg-card text-card-foreground border rounded-bl-none'
                                            )}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <CardContent className="p-4 border-t">
                             <div className="relative">
                                <Input
                                    placeholder="Type a message..."
                                    className="pr-12"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                >
                                    <SendHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <Mail className="h-12 w-12 mb-4"/>
                        <p className="text-lg font-medium">Select a conversation</p>
                        <p className="text-sm">Choose from the list on the left to start messaging.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
