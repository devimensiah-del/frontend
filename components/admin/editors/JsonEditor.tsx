import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/Textarea";

interface JsonEditorProps {
  data: any;
  onChange: (newData: any) => void;
  label?: string;
}

export function JsonEditor({ data, onChange, label }: JsonEditorProps) {
  const [jsonString, setJsonString] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJsonString(JSON.stringify(data, null, 2));
  }, [data]);

  const handleChange = (value: string) => {
    setJsonString(value);
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
      setError(null);
    } catch {
      setError("JSON inválido");
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <Textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        className="font-mono text-xs min-h-[200px]"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
