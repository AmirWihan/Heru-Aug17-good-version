
'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { askHeru } from '@/ai/flows/ircc-chat-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Message = {
    id: number;
    role: 'user' | 'bot';
    text: string;
};

export function IrccChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: 'bot', text: "Hello! I'm the VisaFor AI assistant. Ask me any question about Canadian immigration based on IRCC information." }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            role: 'user',
            text: inputValue,
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const jsonString = JSON.stringify({ query: inputValue });
            const response = await askHeru(jsonString);
            const botMessage: Message = {
                id: Date.now() + 1,
                role: 'bot',
                text: response.response,
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            toast({
                title: 'Error',
                description: 'Sorry, I encountered an error. Please try again.',
                variant: 'destructive',
            });
             const errorMessage: Message = {
                id: Date.now() + 1,
                role: 'bot',
                text: "I'm having trouble connecting right now. Please try again in a moment.",
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    size="icon"
                    className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                </Button>
            </div>

            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 animate-fade">
                    <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl">
                        <CardHeader className="flex flex-row items-center gap-3 border-b">
                            <Avatar>
                                <AvatarFallback className="bg-primary text-primary-foreground"><Sparkles className="h-5 w-5"/></AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg">VisaFor AI Assistant</CardTitle>
                                <CardDescription>Powered by IRCC Data</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-4 overflow-hidden">
                             <ScrollArea className="h-full" ref={scrollAreaRef as any}>
                                <div className="space-y-4 pr-4">
                                    {messages.map(message => (
                                        <div key={message.id} className={cn(
                                            "flex gap-3 items-start",
                                            message.role === 'user' && "justify-end"
                                        )}>
                                             {message.role === 'bot' && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback className="bg-muted"><Bot className="h-4 w-4"/></AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn(
                                                "p-3 rounded-lg max-w-[80%]",
                                                message.role === 'bot' ? 'bg-muted' : 'bg-primary text-primary-foreground'
                                            )}>
                                                <p className="text-sm">{message.text}</p>
                                            </div>
                                             {message.role === 'user' && (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback><User className="h-4 w-4"/></AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3 items-start">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback className="bg-muted"><Bot className="h-4 w-4"/></AvatarFallback>
                                            </Avatar>
                                            <div className="p-3 rounded-lg bg-muted flex items-center">
                                                <Loader2 className="h-4 w-4 animate-spin"/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </CardContent>
                        <div className="p-4 border-t">
                             <div className="relative">
                                <Input
                                    placeholder="Ask about Canadian immigration..."
                                    className="pr-12"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
                                    disabled={isLoading}
                                />
                                <Button
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !inputValue.trim()}
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </>
    );
}
