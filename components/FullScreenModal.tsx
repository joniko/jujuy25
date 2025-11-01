"use client";

import React, { useEffect } from 'react';
import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from 'lucide-react';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: ({ name, age, church, attendance }: { name: string; age: string; church: string; attendance: 'online' | 'presencial' }) => void;
}

const STORAGE_KEY = 'oremos_user_data';
const ATTENDANCE_STORAGE_KEY = 'oremos_attendance_data';
const ATTENDANCE_EXPIRY_HOURS = 5;
const USER_DATA_EXPIRY_HOURS = 4;

const FullScreenModal: React.FC<FullScreenModalProps> = ({ isOpen, onJoin }) => {
  const [name, setName] = React.useState('');
  const [age, setAge] = React.useState('');
  const [church, setChurch] = React.useState('');
  const [attendance, setAttendance] = React.useState<'online' | 'presencial'>('online');
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
          const { name: savedName, age: savedAge, church: savedChurch, timestamp } = JSON.parse(savedData);
          
          // Verificar si los datos tienen menos de 4 horas
          const hoursSinceSaved = (Date.now() - (timestamp || 0)) / (1000 * 60 * 60);
          
          if (hoursSinceSaved < USER_DATA_EXPIRY_HOURS) {
            setName(savedName || '');
            setAge(savedAge || '');
            setChurch(savedChurch || '');
          } else {
            // Si pasaron más de 4 horas, limpiar datos
            localStorage.removeItem(STORAGE_KEY);
          }
        }

        // Cargar y validar attendance guardado
        const savedAttendance = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
        if (savedAttendance) {
          const { type, timestamp } = JSON.parse(savedAttendance);
          const hoursSinceSet = (Date.now() - timestamp) / (1000 * 60 * 60);
          
          // Si pasaron más de 5 horas, resetear a online
          if (hoursSinceSet < ATTENDANCE_EXPIRY_HOURS) {
            setAttendance(type);
          } else {
            setAttendance('online');
            localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
          }
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

    // Guardar datos en localStorage para la próxima vez con timestamp
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        name, 
        age, 
        church,
        timestamp: Date.now()
      }));
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify({ 
        type: attendance, 
        timestamp: Date.now() 
      }));
    } catch (error) {
      console.error('Error saving data:', error);
    }

    onJoin({ name, age, church, attendance });
  };

  const handleClearData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
      localStorage.removeItem('oremos_user_comment');
      setName('');
      setAge('');
      setChurch('');
      setAttendance('online');
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
              {/* Attendance Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Modalidad de Participación
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttendance('online')}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      attendance === 'online'
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    💻 Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance('presencial')}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      attendance === 'presencial'
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50'
                    }`}
                  >
                    📍 Presencial
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {attendance === 'presencial' 
                    ? 'Tu selección se mantendrá por 5 horas' 
                    : 'Conectándote desde casa u otro lugar'
                  }
                </p>
              </div>

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
