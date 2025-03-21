
import { useRef, useEffect, useState } from 'react';
import { UseCase, ScoreWeights } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PriorityMatrixProps {
  useCases: UseCase[];
  weights?: ScoreWeights;
}

export const PriorityMatrix = ({ useCases, weights }: PriorityMatrixProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xAxis, setXAxis] = useState<keyof UseCase['scores']>('easeOfImplementation');
  const [yAxis, setYAxis] = useState<keyof UseCase['scores']>('impact');

  // Impact and ease level numeric mappings (for legacy compatibility)
  const impactValues = {
    'low': 1,
    'medium': 2,
    'high': 3,
  };

  const easeValues = {
    'low': 1,
    'medium': 2,
    'high': 3,
  };

  // Function to draw the matrix
  const drawMatrix = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Define matrix dimensions
    const padding = 40;
    const axisWidth = rect.width - padding * 2;
    const axisHeight = rect.height - padding * 2;
    
    // Draw axes
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#333333'; // Darker grid lines that fit with the dark theme
    
    // Draw grid lines
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const x = padding + (axisWidth / 5) * i;
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + axisHeight);
      
      const y = padding + (axisHeight / 5) * i;
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + axisWidth, y);
    }
    ctx.stroke();
    
    // Draw labels with white text for dark theme
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF'; // White text for labels
    ctx.textAlign = 'center';
    
    // X-axis labels (1-5)
    for (let i = 1; i <= 5; i++) {
      const x = padding + (axisWidth / 5) * i - (axisWidth / 10);
      ctx.fillText(i.toString(), x, padding + axisHeight + 20);
    }
    
    // Y-axis labels (1-5)
    for (let i = 1; i <= 5; i++) {
      const y = padding + axisHeight - (axisHeight / 5) * i + (axisHeight / 10);
      ctx.save();
      ctx.translate(padding - 20, y);
      ctx.fillText(i.toString(), 0, 0);
      ctx.restore();
    }
    
    // Axis titles - use bold font for headers
    ctx.font = 'bold 14px system-ui, sans-serif';
    
    // X-axis title
    let xAxisTitle = '';
    switch (xAxis) {
      case 'easeOfImplementation': xAxisTitle = 'Ease of Implementation'; break;
      case 'impact': xAxisTitle = 'Impact'; break;
      case 'dataAvailability': xAxisTitle = 'Data Availability'; break;
      case 'businessValue': xAxisTitle = 'Business Value'; break;
      case 'technicalFeasibility': xAxisTitle = 'Technical Feasibility'; break;
      case 'maintainability': xAxisTitle = 'Maintainability'; break;
      case 'ethicalConsiderations': xAxisTitle = 'Ethical Considerations'; break;
    }
    ctx.fillText(xAxisTitle, padding + axisWidth / 2, padding + axisHeight + 40);
    
    // Y-axis title
    let yAxisTitle = '';
    switch (yAxis) {
      case 'easeOfImplementation': yAxisTitle = 'Ease of Implementation'; break;
      case 'impact': yAxisTitle = 'Impact'; break;
      case 'dataAvailability': yAxisTitle = 'Data Availability'; break;
      case 'businessValue': yAxisTitle = 'Business Value'; break;
      case 'technicalFeasibility': yAxisTitle = 'Technical Feasibility'; break;
      case 'maintainability': yAxisTitle = 'Maintainability'; break;
      case 'ethicalConsiderations': yAxisTitle = 'Ethical Considerations'; break;
    }
    ctx.save();
    ctx.translate(padding - 40, padding + axisHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yAxisTitle, 0, 0);
    ctx.restore();
    
    // Plot the use cases as bubbles
    useCases.forEach((useCase, index) => {
      // Skip use cases without scores or required axis values
      if (!useCase.scores || 
          typeof useCase.scores[xAxis] === 'undefined' || 
          typeof useCase.scores[yAxis] === 'undefined') {
        console.log(`Skipping use case ${useCase.title || index} due to missing score values`);
        return;
      }
      
      const xValue = useCase.scores[xAxis];
      const yValue = useCase.scores[yAxis];
      
      // Calculate position (note: higher y values should be at the top)
      const x = padding + (axisWidth / 5) * (xValue - 0.5);
      const y = padding + axisHeight - (axisHeight / 5) * (yValue - 0.5);
      
      // Determine size based on total score (between 10-30)
      const size = 10 + Math.min(useCase.score, 20);
      
      // Draw bubble
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      
      // Different color based on status - using the app's color palette
      let fillColor;
      switch (useCase.status) {
        case 'backlog':
          fillColor = 'rgba(148, 163, 184, 0.7)'; // Slate color for backlog
          break;
        case 'in-progress':
          fillColor = 'rgba(123, 137, 247, 0.7)'; // Purple #7B89F7
          break;
        case 'completed':
          fillColor = 'rgba(245, 190, 207, 0.7)'; // Pink #F5BECF
          break;
        case 'archived':
          fillColor = 'rgba(71, 85, 105, 0.7)'; // Darker gray for archived
          break;
        default:
          fillColor = 'rgba(255, 255, 255, 0.5)'; // White with opacity as fallback
      }
      
      ctx.fillStyle = fillColor;
      ctx.globalAlpha = 0.9; // Slightly higher opacity for better visibility
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#000000'; // Black border for contrast
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add text label with better contrast
      ctx.fillStyle = '#FFFFFF'; // White text for better readability
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(useCase.score.toString(), x, y);
    });
  };

  // Update canvas on resize or when axes change
  useEffect(() => {
    const handleResize = () => {
      drawMatrix();
    };

    window.addEventListener('resize', handleResize);
    drawMatrix();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [useCases, xAxis, yAxis]);

  return (
    <Card className="w-full animate-slide-up border-muted bg-black/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Priority Matrix</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-1">
              <Label htmlFor="x-axis" className="text-xs">X Axis</Label>
              <Select
                value={xAxis}
                onValueChange={(value) => setXAxis(value as keyof UseCase['scores'])}
              >
                <SelectTrigger id="x-axis" className="h-8 text-xs">
                  <SelectValue placeholder="Select parameter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easeOfImplementation">Ease of Implementation</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="dataAvailability">Data Availability</SelectItem>
                  <SelectItem value="businessValue">Business Value</SelectItem>
                  <SelectItem value="technicalFeasibility">Technical Feasibility</SelectItem>
                  <SelectItem value="maintainability">Maintainability</SelectItem>
                  <SelectItem value="ethicalConsiderations">Ethical Considerations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="y-axis" className="text-xs">Y Axis</Label>
              <Select
                value={yAxis}
                onValueChange={(value) => setYAxis(value as keyof UseCase['scores'])}
              >
                <SelectTrigger id="y-axis" className="h-8 text-xs">
                  <SelectValue placeholder="Select parameter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="impact">Impact</SelectItem>
                  <SelectItem value="easeOfImplementation">Ease of Implementation</SelectItem>
                  <SelectItem value="dataAvailability">Data Availability</SelectItem>
                  <SelectItem value="businessValue">Business Value</SelectItem>
                  <SelectItem value="technicalFeasibility">Technical Feasibility</SelectItem>
                  <SelectItem value="maintainability">Maintainability</SelectItem>
                  <SelectItem value="ethicalConsiderations">Ethical Considerations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
