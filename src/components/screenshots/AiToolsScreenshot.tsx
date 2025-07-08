import Image from 'next/image';

export function AiToolsScreenshot() {
  return (
    <div className="rounded-xl shadow-2xl shadow-primary/20 bg-background/50 border overflow-hidden">
        <div className="bg-muted/80 p-2 flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="aspect-[16/10] relative">
            <Image 
                src="https://placehold.co/1200x750.png"
                alt="Heru CRM AI Tools Screenshot"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
                data-ai-hint="ai interface"
            />
        </div>
    </div>
  );
}
