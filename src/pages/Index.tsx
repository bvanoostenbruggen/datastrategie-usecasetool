
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useUseCases } from '@/hooks/useUseCases';
import { exportToExcel } from '@/lib/excelExport';
import { toast } from 'sonner';
import { UseCase } from '@/types/types';
import { SmartFilteringSystem } from '@/components/SmartFilteringSystem';
import { ViewToggle } from '@/components/ViewToggle';
import { ContentView } from '@/components/ContentView';
import { DialogComponents } from '@/components/DialogComponents';
import { PageHeader } from '@/components/PageHeader';
import { TeamViewToggle } from '@/components/TeamViewToggle';
import { useTeam } from '@/contexts/TeamContext';

const Index = () => {
  const { useCases, parameters, updateUseCase, deleteUseCase, updateParameters } = useUseCases();
  const [activeTab, setActiveTab] = useState('list');
  const [weightsDialogOpen, setWeightsDialogOpen] = useState(false);
  const [newUseCaseDialogOpen, setNewUseCaseDialogOpen] = useState(false);
  const [parametersDialogOpen, setParametersDialogOpen] = useState(false);
  const [filteredUseCases, setFilteredUseCases] = useState<UseCase[]>(useCases);
  const { isTeamView, toggleTeamView } = useTeam();

  // Update filtered use cases when the main list changes
  useEffect(() => {
    setFilteredUseCases(useCases);
  }, [useCases]);

  const handleExportToExcel = () => {
    try {
      exportToExcel(useCases, {});
      toast.success('Export completed successfully!', {
        description: 'The CSV file has been downloaded.'
      });
    } catch (error) {
      toast.error('Export failed', {
        description: 'There was an error exporting the data.'
      });
      console.error('Export error:', error);
    }
  };

  const handleFiltersChange = (newFilteredUseCases: UseCase[]) => {
    setFilteredUseCases(newFilteredUseCases);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-7xl px-4 py-6 md:py-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-5">
            <PageHeader 
              onExport={handleExportToExcel}
              onParametersClick={() => setParametersDialogOpen(true)}
              onWeightsClick={() => setWeightsDialogOpen(true)}
              onNewUseCaseClick={() => setNewUseCaseDialogOpen(true)}
            />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <ViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />
              <TeamViewToggle isTeamView={isTeamView} onToggle={toggleTeamView} />
            </div>
          </div>
          
          <SmartFilteringSystem 
            useCases={useCases}
            onFiltersChange={handleFiltersChange}
          />
          
          <div className="pb-6">
            <ContentView 
              activeTab={activeTab}
              filteredUseCases={filteredUseCases || []}
              onUpdateUseCase={updateUseCase}
              onDeleteUseCase={deleteUseCase}
            />
          </div>
        </div>
      </main>
      
      <DialogComponents
        weightsDialogOpen={weightsDialogOpen}
        setWeightsDialogOpen={setWeightsDialogOpen}
        newUseCaseDialogOpen={newUseCaseDialogOpen}
        setNewUseCaseDialogOpen={setNewUseCaseDialogOpen}
        parametersDialogOpen={parametersDialogOpen}
        setParametersDialogOpen={setParametersDialogOpen}
        parameters={parameters}
        updateParameters={updateParameters}
      />
    </div>
  );
};

export default Index;
