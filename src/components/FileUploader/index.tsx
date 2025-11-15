'use client';

import Image from 'next/image';
import { useRef } from 'react';
import './index.css';

interface FileUploaderProps {
  onFilesUpload: (files: File[]) => void;
  className?: string;
}

export default function FileUploader({ onFilesUpload, className = '' }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      onFilesUpload(imageFiles);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFolderClick = () => {
    folderInputRef.current?.click();
  };

  return (
    <div className={`file-uploader ${className}`}>
      <div className="upload-buttons-container">
        <button className="upload-button" onClick={handleUploadClick}>
          <Image src="/file-icon.svg" alt="upload" width={20} height={20} />
          <span>Upload Images</span>
        </button>
        <button className="upload-button" onClick={handleFolderClick}>
          <Image src="/folder.svg" alt="select-files" width={20} height={20} />
          <span>Select Files</span>
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      
      <input
        ref={folderInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      
      <div className="upload-area-footer">
        <p>Maximum 100MB per image, up to 50 images per upload</p>
      </div>
    </div>
  );
}
