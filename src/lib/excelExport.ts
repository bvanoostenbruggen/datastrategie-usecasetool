
import { UseCase, ScoreWeights } from '@/types/types';

export const exportToExcel = (useCases: UseCase[], weights: ScoreWeights) => {
  // Make sure we have data to export
  if (!useCases || useCases.length === 0) {
    throw new Error('No use cases to export');
  }

  // Format the data for Excel
  const formattedData = useCases.map(useCase => ({
    'Title': useCase.title,
    'Description': useCase.description || '',
    'Business Objective': useCase.businessObjective || '',
    'Expected Outcome': useCase.expectedOutcome || '',
    'Success Criteria': useCase.successCriteria || '',
    'Team': useCase.team?.join(', ') || '',
    'Technologies': useCase.technologies?.join(', ') || '',
    'Status': useCase.status || '',
    'Total Score': useCase.score?.toFixed(1) || '0.0',
    'Impact': useCase.scores?.impact || '',
    'Ease of Implementation': useCase.scores?.easeOfImplementation || '',
    'Data Availability': useCase.scores?.dataAvailability || '',
    'Business Value': useCase.scores?.businessValue || '', 
    'Technical Feasibility': useCase.scores?.technicalFeasibility || '',
    'Maintainability': useCase.scores?.maintainability || '',
    'Ethical Considerations': useCase.scores?.ethicalConsiderations || '',
    'Estimated Time': useCase.estimatedTime || '',
    'Estimated Resources': useCase.estimatedResources || '',
    'Created': useCase.createdAt ? new Date(useCase.createdAt).toLocaleDateString() : '',
    'Last Updated': useCase.updatedAt ? new Date(useCase.updatedAt).toLocaleDateString() : '',
  }));

  // Add weights information as metadata
  const weightInfo = [
    {
      'Title': '-- WEIGHT CONFIGURATION --',
      'Description': '',
      'Business Objective': '',
      'Expected Outcome': '',
      'Success Criteria': '',
      'Team': '',
      'Technologies': '',
      'Status': '',
      'Total Score': '',
      'Impact': weights.impact,
      'Ease of Implementation': weights.easeOfImplementation,
      'Data Availability': weights.dataAvailability,
      'Business Value': weights.businessValue, 
      'Technical Feasibility': weights.technicalFeasibility,
      'Maintainability': weights.maintainability,
      'Ethical Considerations': weights.ethicalConsiderations,
      'Estimated Time': '',
      'Estimated Resources': '',
      'Created': '',
      'Last Updated': '',
    }
  ];

  // Create a worksheet
  const worksheet = [
    ...weightInfo,
    ...formattedData
  ];

  // Convert to CSV
  const headers = Object.keys(worksheet[0]);
  let csvContent = headers.join(',') + '\n';
  
  worksheet.forEach(row => {
    const values = headers.map(header => {
      const cellValue = row[header as keyof typeof row] || '';
      // Escape quotes and wrap fields in quotes to handle commas and special characters
      const escapedValue = String(cellValue).replace(/"/g, '""');
      return `"${escapedValue}"`;
    });
    csvContent += values.join(',') + '\n';
  });

  try {
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set filename with current date
    const date = new Date().toISOString().slice(0, 10);
    const filename = `use-case-prioritization-${date}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
    return true; // Export successful
  } catch (error) {
    console.error('Error during export:', error);
    throw new Error('Failed to download the export file');
  }
};
