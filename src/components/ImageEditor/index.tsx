'use client';

import Image from 'next/image';
import { useState, useRef, useCallback, useEffect } from 'react';
import PixiImageRenderer from '../PixiImageRenderer';
import CompareImageRenderer from '../CompareImageRenderer';
import SwipeCompareRenderer from '../SwipeCompareRenderer';
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
  viewMode?: 'single' | 'compare' | 'modified';
  transMode?: boolean;
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
  className = '',
  viewMode = 'single',
  transMode = false
}: ImageEditorProps) {
  // 直接使用外部 transform,不需要内部状态
  const transform = externalTransform;
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // 调试：监控 settings 变化
  useEffect(() => {
    console.log('🖼️ ImageEditor 接收到新的 settings:', settings, 'image:', image?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    settings.exposure,
    settings.highlights,
    settings.shadows,
    settings.whites,
    settings.blacks,
    settings.temperature,
    settings.tint,
    settings.saturation,
    settings.texture,
    settings.clarity,
    settings.grain,
    image?.id
  ]);

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
      
      const newScale = Math.max(0.1, Math.min(5, transform.scale * delta));
      const newTransform = {
        ...transform,
        scale: newScale
      };
      onTransformChange?.(newTransform);
      onZoomChange?.(newScale * 100);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [image, transform, onTransformChange, onZoomChange]);

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

  // 根据视图模式渲染不同的内容
  const renderContent = () => {
    console.log('🎬 渲染内容 - transMode:', transMode, 'viewMode:', viewMode);
    
    if (transMode) {
      // trans 模式：滑动对比，左边原图，右边修改图
      // 确保原图使用真正的默认设置（全0值）
      const trueOriginalSettings = {
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

      console.log('✅ 渲染 SwipeCompareRenderer');
      return (
        <SwipeCompareRenderer
          key={`${image.id}-swipe`}
          imageUrl={image.url}
          originalSettings={trueOriginalSettings}
          modifiedSettings={settings}
          width={containerSize.width}
          height={containerSize.height}
          transform={transform}
          onTransformChange={onTransformChange}
          onZoomChange={onZoomChange}
        />
      );
    } else if (viewMode === 'compare') {
      // 对比模式：修改图和原图并排
      return (
        <CompareImageRenderer
          key={`${image.id}-compare`}
          imageUrl={image.url}
          originalSettings={defaultSettings}
          modifiedSettings={settings}
          width={containerSize.width}
          height={containerSize.height}
          transform={transform}
        />
      );
    } else {
      // 默认模式：显示编辑后的图
      return (
        <PixiImageRenderer
          key={image.id}
          imageUrl={image.url}
          settings={settings}
          width={containerSize.width}
          height={containerSize.height}
          transform={transform}
        />
      );
    }
  };

  return (
    <div className={`image-editor ${className} ${viewMode === 'compare' ? 'compare-mode' : ''}`}>
      <div 
        ref={containerRef}
        className="image-editor-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
