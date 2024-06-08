import React from 'react';

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
    onJoin({ name, age, church });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-4xl h-full flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-4">Ingresa tus datos</h2>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-zinc-950"
        />
        <input
          type="text"
          placeholder="Ingresa tu edad"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-zinc-950"
        />
        <input
          type="text"
          placeholder="Ingresa el nombre de tu iglesia"
          value={church}
          onChange={(e) => setChurch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-zinc-950"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded-lg mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleJoin}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Unirse
          </button>
        </div>
      </div>
    </div>
  );
};

export default FullScreenModal;
