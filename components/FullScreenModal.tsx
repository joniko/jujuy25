"use client";

import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: ({ name, age, church }: { name: string; age: string; church: string }) => void;
}

const STORAGE_KEY = 'oremos_user_data';

const FullScreenModal: React.FC<FullScreenModalProps> = ({ isOpen, onClose, onJoin }) => {
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [church, setChurch] = React.useState('');
  const [errors, setErrors] = React.useState({
    name: '',
    age: '',
    church: ''
  });

  // Cargar datos guardados de localStorage cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const { name: savedName, age: savedAge, church: savedChurch } = JSON.parse(savedData);
          setName(savedName || '');
          setAge(savedAge || '');
          setChurch(savedChurch || '');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, [isOpen]);

  const handleJoin = () => {
    const newErrors = {
      name: '',
      age: '',
      church: ''
    };

    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    if (!age.trim()) {
      newErrors.age = 'La edad es obligatoria';
    }
    if (!church.trim()) {
      newErrors.church = 'La iglesia es obligatoria';
    }

    setErrors(newErrors);

    if (newErrors.name || newErrors.age || newErrors.church) {
      return;
    }

    // Guardar datos en localStorage para la próxima vez
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, age, church }));
    } catch (error) {
      console.error('Error saving data:', error);
    }

    onJoin({ name, age, church });
  };

  const handleClearData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setName('');
      setAge('');
      setChurch('');
      setErrors({ name: '', age: '', church: '' });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-xs" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-8 space-y-6 animate-in fade-in-0 zoom-in-95">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Bienvenido a Oremos 🙏</h2>
              <p className="text-muted-foreground">
                {name || age || church ? 
                  'Confirma tus datos o edítalos si es necesario.' : 
                  'Para unirte a la oración, por favor completa todos los campos.'
                }
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
                    setErrors({ ...errors, name: '' });
                  }}
                  onKeyPress={handleKeyPress}
                  autoFocus
                  className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  Edad <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Tu edad"
                  value={age}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setAge(e.target.value);
                    setErrors({ ...errors, age: '' });
                  }}
                  onKeyPress={handleKeyPress}
                  min="1"
                  max="120"
                  className={errors.age ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.age && (
                  <p className="text-sm text-red-500">{errors.age}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="church" className="text-sm font-medium">
                  Iglesia <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="church"
                  placeholder="Nombre de tu iglesia"
                  value={church}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setChurch(e.target.value);
                    setErrors({ ...errors, church: '' });
                  }}
                  onKeyPress={handleKeyPress}
                  className={errors.church ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.church && (
                  <p className="text-sm text-red-500">{errors.church}</p>
                )}
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                onClick={handleJoin}
                className="w-full h-11"
                type="button"
              >
                Unirse a la Oración
              </Button>
              
              {(name || age || church) && (
                <Button 
                  onClick={handleClearData}
                  variant="ghost"
                  className="w-full h-9 text-muted-foreground hover:text-foreground"
                  type="button"
                >
                  <X className="w-4 h-4 mr-2" />
                  Borrar datos guardados
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogPortal>
    </Dialog>
  );
};

export default FullScreenModal;
