import { ScoreParameter, ScoreLevel, UseCase } from '@/types/types';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface ScoreRadarChartProps {
  useCase: UseCase;
  size?: 'small' | 'medium' | 'large';
  highlights?: Record<string, 'high' | 'low' | null>;
  parameters?: ScoreParameter[];
}

export const ScoreRadarChart = ({ useCase, size = 'medium', highlights = {}, parameters }: ScoreRadarChartProps) => {
  // Use either provided parameters or extract from scores
  const scoreParameters = parameters || Object.keys(useCase.scores || {}).map(id => ({
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
    description: '',
    weight: 1,
    preferredDirection: 'high' as const
  }));
  
  // Create formatted data for the chart
  const data = scoreParameters.map(param => {
    const score = useCase.scores?.[param.id] || 3;
    const highlight = highlights[param.id];
    
    // For parameters where lower is better, invert the score for visualization
    // This ensures all "good" scores point outward in the radar chart
    let normalizedScore = score;
    if (param.preferredDirection === 'low') {
      normalizedScore = (6 - score) as ScoreLevel; // 5 becomes 1, 4 becomes 2, etc.
    }
    
    return {
      parameter: param.name,
      id: param.id,
      score: normalizedScore,
      rawScore: score, // Keep the original score for the tooltip
      fullMark: 5,
      highlight,
      preferredDirection: param.preferredDirection || 'high',
    };
  });

  // Calculate if this chart has any highlighted items
  const hasHighItems = data.some(d => d.highlight === 'high');
  const hasLowItems = data.some(d => d.highlight === 'low');

  // Custom tooltip to show the correct score
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const direction = item.preferredDirection === 'low' ? 'Lower is better' : 'Higher is better';
      
      return (
        <div className="bg-background/90 border border-border p-2 rounded-md shadow-md">
          <p className="font-semibold">{item.parameter}</p>
          <p className="text-xs opacity-70">{direction}</p>
          <p className="font-mono">Score: {item.rawScore}</p>
        </div>
      );
    }
    return null;
  };

  // Calculate chart height based on size
  const chartHeight = size === 'small' ? 150 : size === 'medium' ? 250 : 350;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <RadarChart 
        cx="50%" 
        cy="50%" 
        outerRadius="75%" 
        data={data}
      >
        <PolarGrid 
          stroke="rgba(255, 255, 255, 0.2)" 
          gridType="circle"
        />
        <PolarAngleAxis
          dataKey="parameter"
          tick={{ 
            fill: 'rgba(255, 255, 255, 0.8)', 
            fontSize: 10,
            dy: 3
          }}
          stroke="rgba(255, 255, 255, 0.3)"
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 5]}
          tick={{ 
            fill: 'rgba(255, 255, 255, 0.6)', 
            fontSize: 8
          }}
          stroke="rgba(255, 255, 255, 0.2)"
          axisLine={false}
        />
        
        <Tooltip content={<CustomTooltip />} />
        
        {/* Primary radar shape */}
        <Radar
          name="Score"
          dataKey="score"
          stroke="rgba(147, 51, 234, 0.9)" // Purple with opacity
          fill="rgba(147, 51, 234, 0.7)"
          fillOpacity={0.3}
          dot={{ 
            fill: "rgba(147, 51, 234, 1)", 
            strokeWidth: 0, 
            r: 3 
          }}
          activeDot={{ 
            r: 5, 
            strokeWidth: 2, 
            stroke: "#fff" 
          }}
        />
        
        {/* Only render high value items differently */}
        {hasHighItems && (
          <Radar
            name="High Value"
            dataKey={(entry) => entry.highlight === 'high' ? entry.score : 0}
            stroke="rgba(34, 197, 94, 0.9)" // Green with opacity
            fill="rgba(34, 197, 94, 0.7)"
            fillOpacity={0.4}
            dot={{ 
              fill: "rgba(34, 197, 94, 1)", 
              r: 4, 
              strokeWidth: 0 
            }}
            activeDot={{ 
              r: 5, 
              strokeWidth: 2, 
              stroke: "#fff" 
            }}
          />
        )}
        
        {/* Only render low value items differently */}
        {hasLowItems && (
          <Radar
            name="Low Value"
            dataKey={(entry) => entry.highlight === 'low' ? entry.score : 0}
            stroke="rgba(239, 68, 68, 0.9)" // Red with opacity
            fill="rgba(239, 68, 68, 0.7)"
            fillOpacity={0.4}
            dot={{ 
              fill: "rgba(239, 68, 68, 1)", 
              r: 4, 
              strokeWidth: 0 
            }}
            activeDot={{ 
              r: 5, 
              strokeWidth: 2, 
              stroke: "#fff" 
            }}
          />
        )}
        
        {(hasHighItems || hasLowItems) && (
          <Legend 
            payload={[
              { value: 'Score', color: 'rgba(147, 51, 234, 0.9)' },
              ...(hasHighItems ? [{ value: 'High Value', color: 'rgba(34, 197, 94, 0.9)' }] : []),
              ...(hasLowItems ? [{ value: 'Low Value', color: 'rgba(239, 68, 68, 0.9)' }] : [])
            ]}
            wrapperStyle={{ fontSize: 10, paddingTop: 10 }}
          />
        )}
      </RadarChart>
    </ResponsiveContainer>
  );
};
