// components/DrawerForm.tsx
import React, { useState } from 'react';
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, Button, Input } from '@shadcn/ui';

const DrawerForm = ({ isOpen, onClose, onJoin }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [church, setChurch] = useState('');

  const handleJoin = () => {
    onJoin({ name, age, church });
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader>Ingresa tus datos</DrawerHeader>
        <DrawerBody>
          <Input
            placeholder="Ingresa tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="Ingresa tu edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mb-4"
          />
          <Input
            placeholder="Ingresa el nombre de tu iglesia"
            value={church}
            onChange={(e) => setChurch(e.target.value)}
            className="mb-4"
          />
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleJoin}>
            Unirse
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerForm;
