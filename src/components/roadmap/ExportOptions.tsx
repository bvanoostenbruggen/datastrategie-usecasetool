
import { FileDown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportOptionsProps {
  roadmapItems: any[];
  view: string;
  phases: any[];
}

export const ExportOptions = ({ roadmapItems, view, phases }: ExportOptionsProps) => {
  const exportRoadmap = () => {
    const exportItems = phases.flatMap(phase => {
      return roadmapItems
        .filter(item => item.phase === phase.id)
        .map(item => ({
          ...item,
          phaseLabel: phase.label
        }));
    });
    
    let csvContent = "Phase,Title,Description,Score,Status,Estimated Time (Weeks),Estimated FTE\n";
    
    exportItems.forEach(item => {
      csvContent += `"${item.phaseLabel}","${item.title}","${item.description}",${item.score},${item.status},${item.estimatedTimeInWeeks},${item.estimatedFTE}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'use-case-roadmap.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Roadmap Exported",
      description: "Your roadmap has been exported as CSV",
    });
  };
  
  const exportPdf = async () => {
    const element = document.getElementById('roadmap-content');
    if (!element) return;
    
    try {
      toast({
        title: "Generating PDF",
        description: "Please wait while we create your PDF...",
      });
      
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('use-case-roadmap.pdf');
      
      toast({
        title: "PDF Created Successfully",
        description: "Your roadmap has been exported as PDF",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error Generating PDF",
        description: "There was a problem creating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        onClick={exportRoadmap} 
        variant="outline" 
        className="gap-1"
      >
        <FileDown className="h-4 w-4" />
        CSV
      </Button>
      <Button 
        onClick={exportPdf} 
        variant="outline" 
        className="gap-1"
      >
        <FileText className="h-4 w-4" />
        PDF
      </Button>
    </div>
  );
};
