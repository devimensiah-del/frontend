import React from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface ListEditorProps {
  items: string[];
  onChange: (newItems: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function ListEditor({ items = [], onChange, label, placeholder }: ListEditorProps) {
  const handleAdd = () => {
    onChange([...items, ""]);
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Textarea
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 min-h-[2.5rem]"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full border-dashed border-gray-300 text-gray-500 hover:border-gold-500 hover:text-gold-600"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Item
      </Button>
    </div>
  );
}
