
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WeightsPanel } from '@/components/WeightsPanel';
import { UseCaseForm } from '@/components/form/UseCaseForm';
import { ParameterManager } from '@/components/ParameterManager';

// Define the Parameter type locally or use the correct import
interface Parameter {
  id: string;
  name: string;
  description: string;
  weight: number;
  icon?: string;
  category?: string;
}

interface DialogComponentsProps {
  weightsDialogOpen: boolean;
  setWeightsDialogOpen: (open: boolean) => void;
  newUseCaseDialogOpen: boolean;
  setNewUseCaseDialogOpen: (open: boolean) => void;
  parametersDialogOpen: boolean;
  setParametersDialogOpen: (open: boolean) => void;
  parameters: Parameter[];
  updateParameters: (params: Parameter[]) => void;
}

export const DialogComponents = ({
  weightsDialogOpen,
  setWeightsDialogOpen,
  newUseCaseDialogOpen,
  setNewUseCaseDialogOpen,
  parametersDialogOpen,
  setParametersDialogOpen,
  parameters,
  updateParameters
}: DialogComponentsProps) => {
  return (
    <>
      {/* Parameter Manager Dialog */}
      <Dialog open={parametersDialogOpen} onOpenChange={setParametersDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Customize Scoring Parameters</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <ParameterManager 
              parameters={parameters}
              onUpdateParameters={updateParameters}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Weights Dialog */}
      <Dialog open={weightsDialogOpen} onOpenChange={setWeightsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Parameter Weights</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <WeightsPanel 
              parameters={parameters}
              onUpdateParameters={updateParameters}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* New Use Case Dialog */}
      <Dialog open={newUseCaseDialogOpen} onOpenChange={setNewUseCaseDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl">Create New Use Case</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <UseCaseForm 
              onComplete={() => setNewUseCaseDialogOpen(false)} 
              isEditing={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
