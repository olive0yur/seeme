'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect } from 'react';
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

interface ImageEditorProps {
  image: ImageFile | null;
  settings?: ImageSettings;
  className?: string;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

// 生成CSS滤镜字符串的函数
const generateFilterStyle = (settings: ImageSettings): string => {
  const filters = [];
  
  // Basic Panel 效果
  if (settings.exposure !== 0) {
    filters.push(`brightness(${100 + settings.exposure}%)`);
  }
  
  if (settings.highlights !== 0) {
    filters.push(`contrast(${100 - settings.highlights * 0.3}%)`);
  }
  
  if (settings.shadows !== 0) {
    const shadowBrightness = 100 + settings.shadows * 0.5;
    filters.push(`brightness(${shadowBrightness}%)`);
  }
  
  if (settings.whites !== 0) {
    filters.push(`brightness(${100 + settings.whites * 0.8}%)`);
  }
  
  if (settings.blacks !== 0) {
    filters.push(`contrast(${100 + settings.blacks}%)`);
  }
  
  // Color Panel 效果
  if (settings.temperature !== 0) {
    filters.push(`hue-rotate(${settings.temperature * 0.5}deg)`);
  }
  
  if (settings.tint !== 0) {
    filters.push(`hue-rotate(${settings.tint * 0.3}deg)`);
  }
  
  if (settings.saturation !== 0) {
    filters.push(`saturate(${100 + settings.saturation}%)`);
  }
  
  // Effects Panel 效果
  if (settings.texture !== 0) {
    const sharpness = 1 + (settings.texture / 100);
    filters.push(`contrast(${100 * sharpness}%)`);
  }
  
  if (settings.clarity !== 0) {
    filters.push(`contrast(${100 + settings.clarity}%)`);
  }
  
  if (settings.grain !== 0) {
    const blur = settings.grain * 0.01;
    filters.push(`blur(${blur}px)`);
    filters.push(`contrast(${100 + settings.grain * 0.5}%)`);
  }
  
  return filters.length > 0 ? filters.join(' ') : 'none';
};

export default function ImageEditor({ image, settings, className = '' }: ImageEditorProps) {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 重置变换当图片改变时
  useEffect(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, [image?.id]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!image) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
  }, [image, transform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !image) return;

    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  }, [isDragging, dragStart, image]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!image) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, transform.scale * delta));
    
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }));
  }, [image, transform.scale]);

  if (!image) {
    return (
      <div className={`image-editor ${className}`}>
        <div className="image-editor-placeholder">
          <div className="placeholder-content">
            <Image src="/file-icon.svg" alt="no image" width={48} height={48} />
            <p>选择图片开始编辑</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`image-editor ${className}`}>
      <div 
        ref={containerRef}
        className="image-editor-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div
          className="image-editor-image-container"
          style={{
            transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) scale(${transform.scale})`,
            transformOrigin: 'center center'
          }}
        >
          <Image
            src={image.url}
            alt="editing"
            width={500}
            height={500}
            style={{ 
              objectFit: 'contain',
              maxWidth: '100%',
              height: 'auto',
              userSelect: 'none',
              pointerEvents: 'none',
              filter: settings ? generateFilterStyle(settings) : 'none'
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
