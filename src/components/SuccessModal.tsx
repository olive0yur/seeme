'use client';

import Image from 'next/image';
import './SuccessModal.css';

interface SuccessModalProps {
  isVisible: boolean;
  title: string;
  description: string;
  onClose?: () => void;
}

export default function SuccessModal({ isVisible, title, description, onClose }: SuccessModalProps) {
  if (!isVisible) return null;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
        <Image 
          src="/success.svg" 
          alt="Success" 
          width={60} 
          height={60}
        />
        <h2 className="success-title">{title}</h2>
        <p className="success-description">{description}</p>
      </div>
    </div>
  );
}
