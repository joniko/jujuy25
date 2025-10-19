"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
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

  const handleJoin = () => {
    if (!name.trim()) {
      alert('Por favor ingresa tu nombre');
      return;
    }
    onJoin({ name, age, church });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Bienvenido a Oremos 🙏
          </DialogTitle>
          <DialogDescription>
            Por favor, ingresa tus datos para unirte a la oración
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Tu nombre"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age">Edad</Label>
            <Input
              id="age"
              type="number"
              placeholder="Tu edad"
              value={age}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="church">Iglesia</Label>
            <Input
              id="church"
              placeholder="Nombre de tu iglesia"
              value={church}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChurch(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleJoin}>
            Unirse a la Oración
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenModal;
