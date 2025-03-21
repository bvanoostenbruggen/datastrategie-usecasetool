
import { useRef, useEffect, useState } from 'react';
import { UseCase, ScoreWeights, ScoreLevel } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { MoveIcon } from 'lucide-react';

interface DraggablePriorityMatrixProps {
  useCases: UseCase[];
  weights?: ScoreWeights;
  onUpdateUseCase: (id: string, data: Partial<UseCase>) => void;
}

export const DraggablePriorityMatrix = ({ useCases, weights, onUpdateUseCase }: DraggablePriorityMatrixProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [xAxis, setXAxis] = useState<keyof UseCase['scores']>('easeOfImplementation');
  const [yAxis, setYAxis] = useState<keyof UseCase['scores']>('impact');
  const [dragging, setDragging] = useState<string | null>(null);
  const [hoveredUseCase, setHoveredUseCase] = useState<string | null>(null);
  const [useCasePositions, setUseCasePositions] = useState<Record<string, { x: number, y: number }>>({});

  // Ensure use cases have valid scores
  const validUseCases = useCases.filter(useCase => 
    useCase.scores && 
    typeof useCase.scores[xAxis] !== 'undefined' && 
    typeof useCase.scores[yAxis] !== 'undefined'
  );

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
    validUseCases.forEach((useCase) => {
      // Since we've filtered for valid use cases, we know these are defined
      const xValue = useCase.scores![xAxis] as number;
      const yValue = useCase.scores![yAxis] as number;
      
      // Calculate position (note: higher y values should be at the top)
      const x = padding + (axisWidth / 5) * (xValue - 0.5);
      const y = padding + axisHeight - (axisHeight / 5) * (yValue - 0.5);
      
      // Store position for drag and drop
      setUseCasePositions(prev => ({
        ...prev,
        [useCase.id]: { x, y }
      }));
      
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
      
      // Highlight hovered or dragged use case
      if (hoveredUseCase === useCase.id || dragging === useCase.id) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.globalAlpha = 0.9;
      } else {
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = 0.8;
      }
      
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Add a move cursor icon inside the circle for draggable indication
      if (hoveredUseCase === useCase.id) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw a simple move icon inside
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(x - 5, y);
        ctx.lineTo(x + 5, y);
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x, y + 5);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Add text label with better contrast
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Show title on hover, otherwise show score
      if (hoveredUseCase === useCase.id) {
        // Truncate title if too long
        const truncatedTitle = useCase.title.length > 20 
          ? useCase.title.substring(0, 17) + '...' 
          : useCase.title;
        
        ctx.fillText(truncatedTitle, x, y - size - 10);
        ctx.fillText(useCase.score.toFixed(1), x, y);
      } else {
        ctx.fillText(useCase.score.toFixed(1), x, y);
      }
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
  }, [validUseCases, xAxis, yAxis, dragging, hoveredUseCase]);

  // Helper function to get use case at a specific position
  const getUseCaseAtPosition = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const padding = 40;
    const axisWidth = rect.width - padding * 2;
    const axisHeight = rect.height - padding * 2;

    for (const useCase of validUseCases) {
      if (!useCase.scores) continue;

      const xValue = useCase.scores[xAxis] as number;
      const yValue = useCase.scores[yAxis] as number;
      
      const uc_x = padding + (axisWidth / 5) * (xValue - 0.5);
      const uc_y = padding + axisHeight - (axisHeight / 5) * (yValue - 0.5);
      const size = 10 + Math.min(useCase.score, 20);

      // Check if click is within the circle
      const distance = Math.sqrt(Math.pow(x - uc_x, 2) + Math.pow(y - uc_y, 2));
      if (distance <= size) {
        return useCase.id;
      }
    }

    return null;
  };

  // Calculate scores from position
  const calculateScoresFromPosition = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 3, y: 3 };

    const rect = canvas.getBoundingClientRect();
    const padding = 40;
    const axisWidth = rect.width - padding * 2;
    const axisHeight = rect.height - padding * 2;

    // Ensure x is within bounds
    x = Math.max(padding, Math.min(padding + axisWidth, x));
    // Ensure y is within bounds
    y = Math.max(padding, Math.min(padding + axisHeight, y));

    // Calculate scores (1-5)
    const xScore = 1 + 4 * ((x - padding) / axisWidth);
    // Note: y-axis is inverted (higher value at top)
    const yScore = 1 + 4 * (1 - ((y - padding) / axisHeight));

    // Round to nearest 0.5
    const roundedXScore = Math.round(xScore * 2) / 2;
    const roundedYScore = Math.round(yScore * 2) / 2;

    // Clamp between 1-5
    const clampedXScore = Math.max(1, Math.min(5, roundedXScore)) as ScoreLevel;
    const clampedYScore = Math.max(1, Math.min(5, roundedYScore)) as ScoreLevel;

    return {
      x: clampedXScore,
      y: clampedYScore
    };
  };

  // Mouse event handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (dragging) {
      // Update the position of the dragged use case
      const { x: xScore, y: yScore } = calculateScoresFromPosition(x, y);
      
      // Set cursor to grabbing
      canvas.style.cursor = 'grabbing';
    } else {
      // Check if mouse is over a use case
      const useCaseId = getUseCaseAtPosition(x, y);
      setHoveredUseCase(useCaseId);
      
      // Set cursor based on whether a use case is hovered
      canvas.style.cursor = useCaseId ? 'grab' : 'default';
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if a use case was clicked
    const useCaseId = getUseCaseAtPosition(x, y);
    if (useCaseId) {
      setDragging(useCaseId);
      canvas.style.cursor = 'grabbing';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate new scores based on position
    const { x: xScore, y: yScore } = calculateScoresFromPosition(x, y);

    // Update the use case with new scores
    const useCase = validUseCases.find(uc => uc.id === dragging);
    if (useCase && useCase.scores) {
      const newScores = { ...useCase.scores };
      newScores[xAxis] = xScore as ScoreLevel;
      newScores[yAxis] = yScore as ScoreLevel;

      onUpdateUseCase(dragging, { scores: newScores });
      
      // Show toast notification
      toast.success('Use case position updated', {
        description: `${useCase.title} has been updated with new scores.`
      });
    }

    // Reset dragging state
    setDragging(null);
    canvas.style.cursor = 'default';
  };

  const handleMouseLeave = () => {
    setHoveredUseCase(null);
    if (dragging) {
      setDragging(null);
    }
  };

  return (
    <Card className="w-full animate-slide-up border-muted bg-black/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MoveIcon className="mr-2 h-5 w-5" />
            Draggable Priority Matrix
          </CardTitle>
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
        {validUseCases.length > 0 ? (
          <div className="w-full h-[400px] relative">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-default"
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-black/30 p-1 rounded">
              Drag and drop items to adjust scores
            </div>
          </div>
        ) : (
          <div className="w-full h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">
              No valid use cases to display. Make sure use cases have scores for the selected parameters.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
