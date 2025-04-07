
import React, { useState } from 'react';
import { Tag } from '@/lib/types';
import { X } from 'lucide-react';

interface TagInputProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagRemove: (tagId: string) => void;
}

const TagInput: React.FC<TagInputProps> = ({ 
  availableTags, 
  selectedTags, 
  onTagSelect, 
  onTagRemove 
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const filteredTags = availableTags
    .filter(tag => !selectedTags.some(selectedTag => selectedTag.id === tag.id))
    .filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <div 
            key={tag.id}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: tag.color || '#e5e7eb', color: '#fff' }}
          >
            {tag.name}
            <button 
              type="button" 
              onClick={() => onTagRemove(tag.id)}
              className="ml-1 rounded-full"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="relative">
        <input 
          type="text"
          placeholder="Search tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-input px-3 py-2 text-sm"
        />
        
        {searchTerm && filteredTags.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredTags.map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => {
                  onTagSelect(tag);
                  setSearchTerm('');
                }}
                className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
              >
                <span 
                  className="inline-block w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: tag.color || '#e5e7eb' }}
                ></span>
                {tag.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
