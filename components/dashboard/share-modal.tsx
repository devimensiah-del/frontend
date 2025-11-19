'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Mail, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  submission: {
    id: string;
    company_name: string;
  };
  open: boolean;
  onClose: () => void;
}

export function ShareModal({ submission, open, onClose }: ShareModalProps) {
  const { toast } = useToast();
  const [emails, setEmails] = useState<string[]>(['']);
  const [expiryDays, setExpiryDays] = useState('7');
  const [isLoading, setIsLoading] = useState(false);

  const addEmailField = () => {
    setEmails([...emails, '']);
  };

  const removeEmailField = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validEmails = emails.filter(email => email.trim() && email.includes('@'));

    if (validEmails.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro de validação',
        description: 'Por favor, insira pelo menos um email válido',
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Sessão expirada. Por favor, faça login novamente.',
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/dashboard/submissions/${submission.id}/share`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            emails: validEmails,
            expiry_days: parseInt(expiryDays),
          }),
        }
      );

      if (!response.ok) throw new Error('Erro ao compartilhar relatório');

      toast({
        title: 'Relatório compartilhado!',
        description: `Convites enviados para ${validEmails.length} email(s)`,
      });

      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao compartilhar',
        description: error instanceof Error ? error.message : 'Tente novamente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar Relatório</DialogTitle>
          <DialogDescription>
            Envie acesso ao relatório <strong>{submission.company_name}</strong> para outras pessoas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email fields */}
          <div className="space-y-4">
            <Label>Emails dos Destinatários</Label>
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {emails.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeEmailField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addEmailField}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Email
            </Button>
          </div>

          {/* Expiry */}
          <div className="space-y-2">
            <Label htmlFor="expiry">Validade do Acesso</Label>
            <Select value={expiryDays} onValueChange={setExpiryDays}>
              <SelectTrigger id="expiry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="14">14 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              Após este período, o acesso será revogado automaticamente
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar Convites'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
