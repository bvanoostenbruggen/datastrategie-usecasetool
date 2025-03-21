
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useIsMobile } from '@/hooks/use-mobile';

interface TagInputProps {
  label: string;
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  placeholder: string;
}

export const TagInput = ({
  label,
  tags,
  tagInput,
  setTagInput,
  addTag,
  removeTag,
  placeholder,
}: TagInputProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-2.5">
      <Label>{label}</Label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder={placeholder}
          className="w-full"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={addTag}
          className="sm:min-w-[80px] w-full sm:w-auto"
        >
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
