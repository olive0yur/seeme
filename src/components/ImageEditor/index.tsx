'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect } from 'react';
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

interface ImageEditorProps {
  image: ImageFile | null;
  settings?: ImageSettings;
  transform?: Transform;
  onTransformChange?: (transform: Transform) => void;
  onZoomChange?: (zoomPercentage: number) => void;
  className?: string;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
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

export default function ImageEditor({ 
  image, 
  settings = defaultSettings, 
  transform: externalTransform = { x: 0, y: 0, scale: 1 },
  onTransformChange,
  onZoomChange,
  className = '' 
}: ImageEditorProps) {
  const [transform, setTransform] = useState<Transform>(externalTransform);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
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

  // 当外部传入的变换状态改变时，更新内部状态
  useEffect(() => {
    setTransform(externalTransform);
    onZoomChange?.(externalTransform.scale * 100);
  }, [externalTransform, onZoomChange]);

  // 当图片改变时，如果没有外部变换状态，则重置变换
  useEffect(() => {
    if (!externalTransform || (externalTransform.x === 0 && externalTransform.y === 0 && externalTransform.scale === 1)) {
      setTransform({ x: 0, y: 0, scale: 1 });
      onZoomChange?.(100);
    }
  }, [image?.id, externalTransform, onZoomChange]);

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

    const newTransform = {
      ...transform,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    
    setTransform(newTransform);
    onTransformChange?.(newTransform);
  }, [isDragging, dragStart, image, transform, onTransformChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 使用原生事件监听器处理滚轮缩放
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !image) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      
      setTransform(prev => {
        const newScale = Math.max(0.1, Math.min(5, prev.scale * delta));
        const newTransform = {
          ...prev,
          scale: newScale
        };
        onTransformChange?.(newTransform);
        onZoomChange?.(newScale * 100);
        return newTransform;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [image, onTransformChange]);

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
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <PixiImageRenderer 
          key={image.id}
          imageUrl={image.url}
          settings={settings}
          width={containerSize.width}
          height={containerSize.height}
          transform={transform}
        />
      </div>
    </div>
  );
}
