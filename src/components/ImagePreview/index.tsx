'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import PixiImageRenderer from '../PixiImageRenderer';
import './index.css';

interface ImageFile {
  file: File;
  url: string;
  id: string;
}

interface ImageSettings {
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  temperature: number;
  tint: number;
  saturation: number;
  texture: number;
  clarity: number;
  grain: number;
}

interface ImagePreviewProps {
  image: ImageFile | null;
  settings?: ImageSettings;
  className?: string;
}

const defaultSettings: ImageSettings = {
  exposure: 0,
  highlights: 0,
  shadows: 0,
  whites: 0,
  blacks: 0,
  temperature: 0,
  tint: 0,
  saturation: 0,
  texture: 0,
  clarity: 0,
  grain: 0
};

export default function ImagePreview({ image, settings = defaultSettings, className = '' }: ImagePreviewProps) {
  const [containerSize, setContainerSize] = useState({ width: 400, height: 300 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 获取容器尺寸
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!image) {
    return (
      <div className={`image-preview ${className}`}>
        <div className="image-preview-placeholder">
          <div className="placeholder-content">
            <Image src="/file-icon.svg" alt="no image" width={48} height={48} />
            <p>选择图片进行预览</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-preview ${className}`}>
      <div ref={containerRef} className="image-preview-container">
        <img 
          src={image.url}
          alt="原始图片预览"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    </div>
  );
}
