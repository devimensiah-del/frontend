import React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

interface KeyValueEditorProps {
  items: Record<string, string>;
  onChange: (newItems: Record<string, string>) => void;
  label?: string;
}

export function KeyValueEditor({ items = {}, onChange, label }: KeyValueEditorProps) {
  const entries = Object.entries(items);

  const handleAdd = () => {
    onChange({ ...items, "": "" });
  };

  const handleRemove = (keyToRemove: string) => {
    const newItems = { ...items };
    delete newItems[keyToRemove];
    onChange(newItems);
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    const value = items[oldKey];
    const newItems = { ...items };
    delete newItems[oldKey];
    newItems[newKey] = value;
    onChange(newItems);
  };

  const handleValueChange = (key: string, newValue: string) => {
    onChange({ ...items, [key]: newValue });
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="space-y-2">
        {entries.map(([key, value], index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={key}
              onChange={(e) => handleKeyChange(key, e.target.value)}
              placeholder="Chave"
              className="w-1/3"
            />
            <Input
              value={value}
              onChange={(e) => handleValueChange(key, e.target.value)}
              placeholder="Valor"
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(key)}
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
        Adicionar Campo
      </Button>
    </div>
  );
}
