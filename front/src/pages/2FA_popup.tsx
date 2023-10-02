import React, { useState } from 'react';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ isOpen, onClose }) => {
  const [code, setCode] = useState('');

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = () => {
    // Vous pouvez ajouter ici la logique pour vérifier le code et activer le 2FA.
    // Une fois le traitement terminé, vous pouvez fermer la boîte modale en appelant onClose.
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Activer le 2FA</h2>
        <p>Entrez le code reçu par e-mail pour activer le 2FA :</p>
        <input
          type="text"
          placeholder="Code"
          value={code}
          onChange={handleCodeChange}
        />
        <button onClick={handleSubmit}>Activer</button>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;
