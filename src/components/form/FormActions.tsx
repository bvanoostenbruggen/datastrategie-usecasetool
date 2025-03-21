
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface FormActionsProps {
  onCancel: () => void;
  isEditing: boolean;
  disableSubmit?: boolean;
  customSubmitText?: string;
  customCancelText?: string;
}

export const FormActions = ({ 
  onCancel, 
  isEditing, 
  disableSubmit = false,
  customSubmitText,
  customCancelText = "Cancel"
}: FormActionsProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
      <Button 
        type="button" 
        variant="outline"
        size="sm"
        onClick={onCancel}
        className="w-full sm:w-auto h-10 px-4 min-w-[100px] transition-all duration-200 hover:bg-muted/20"
      >
        {customCancelText}
      </Button>
      <Button 
        type="submit" 
        disabled={disableSubmit}
        variant="pink"
        size="sm"
        className="w-full sm:w-auto h-10 px-4 min-w-[120px] font-medium transition-all duration-200"
      >
        {customSubmitText || (isEditing ? 'Update Use Case' : 'Create Use Case')}
      </Button>
    </div>
  );
};
