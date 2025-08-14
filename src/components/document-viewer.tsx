
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useGlobalData } from '@/context/GlobalDataContext';
import { Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Save, Download, Printer } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set workerSrc for pdfjs. This is crucial for the worker to be loaded correctly.
// The copy-webpack-plugin in next.config.ts handles moving this file.
pdfjs.GlobalWorkerOptions.workerSrc = `/static/chunks/pdf.worker.min.mjs`;

interface DocumentViewerProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    document: {
        title: string;
        url?: string; // In a real app, this would be a secure, time-limited URL from Firebase Storage
    } | null;
}

export function DocumentViewer({ isOpen, onOpenChange, document }: DocumentViewerProps) {
    const { toast } = useToast();
    const { can } = useGlobalData();
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    // Using a public placeholder PDF for demonstration purposes.
    const fileUrl = 'https://unpkg.com/pdfjs-dist@3.4.120/web/compressed.tracemonkey-pldi-09.pdf';

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset: number) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    const handleSave = () => {
        toast({ title: "Document Saved", description: `${document?.title} has been saved.` });
    };

    const handleDownload = () => {
        toast({ title: "Downloading Document", description: `An export of ${document?.title} has been initiated.` });
    };

    const handlePrint = () => {
        toast({ title: "Printing Document", description: "Opening print dialog..." });
        // window.print() could be used here in a real scenario
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            onOpenChange(open);
            if (!open) {
                setNumPages(null);
                setPageNumber(1);
                setScale(1.0);
            }
        }}>
            <DialogContent className="w-screen max-w-[100vw] h-[100vh] sm:max-w-[96vw] sm:h-[96vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Viewing: {document?.title}</DialogTitle>
                    <DialogDescription>Use the controls below to navigate and manage the document.</DialogDescription>
                </DialogHeader>
                <div className="bg-muted flex-1 overflow-auto flex items-start justify-center p-4">
                    <Document
                        file={fileUrl} // Using the placeholder URL
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={<div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading PDF...</span></div>}
                        error={<div className="text-destructive">Failed to load PDF.</div>}
                    >
                        <Page pageNumber={pageNumber} scale={scale} renderTextLayer={false} />
                    </Document>
                </div>
                <div className="flex items-center justify-between p-2 border-t bg-background rounded-b-lg">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={previousPage} disabled={pageNumber <= 1}><ChevronLeft /></Button>
                        <span className="text-sm font-medium">Page {pageNumber} of {numPages || '--'}</span>
                        <Button variant="ghost" size="icon" onClick={nextPage} disabled={!numPages || pageNumber >= numPages}><ChevronRight /></Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setScale(s => s - 0.1)} disabled={scale <= 0.5}><ZoomOut /></Button>
                        <span className="text-sm font-medium w-12 text-center">{(scale * 100).toFixed(0)}%</span>
                        <Button variant="ghost" size="icon" onClick={() => setScale(s => s + 0.1)} disabled={scale >= 2}><ZoomIn /></Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleSave}><Save className="mr-2 h-4 w-4" />Save</Button>
                        <Button variant="outline" onClick={handleDownload} disabled={!can('deleteExport')}>
                          <Download className="mr-2 h-4 w-4" />Export
                        </Button>
                        <Button variant="outline" onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />Print</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
