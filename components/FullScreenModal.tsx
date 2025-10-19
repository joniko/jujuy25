"use client";

import React from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: ({ name, age, church }: { name: string; age: string; church: string }) => void;
}

const FullScreenModal: React.FC<FullScreenModalProps> = ({ isOpen, onClose, onJoin }) => {
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [church, setChurch] = React.useState('');
  const [error, setError] = React.useState('');

  const handleJoin = () => {
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }
    setError('');
    onJoin({ name, age, church });
  };

  const handleSkip = () => {
    onJoin({ name: 'Anónimo', age: '', church: '' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-8 space-y-6 animate-in fade-in-0 zoom-in-95">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Bienvenido a Oremos 🙏</h2>
              <p className="text-muted-foreground">
                Únete a nuestra comunidad de oración. Por favor, ingresa tus datos.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Nombre <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  Edad (opcional)
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Tu edad"
                  value={age}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min="1"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="church" className="text-sm font-medium">
                  Iglesia (opcional)
                </Label>
                <Input
                  id="church"
                  placeholder="Nombre de tu iglesia"
                  value={church}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChurch(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button 
                onClick={handleJoin}
                className="w-full h-11"
                type="button"
              >
                Unirse a la Oración
              </Button>
              <Button 
                variant="ghost" 
                onClick={handleSkip}
                className="w-full h-11"
                type="button"
              >
                Continuar como Anónimo
              </Button>
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
};

export default FullScreenModal;
