'use client';

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import './index.css';

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

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface SwipeCompareRendererProps {
  imageUrl: string;
  originalSettings: ImageSettings;
  modifiedSettings: ImageSettings;
  width: number;
  height: number;
  transform?: Transform;
  onTransformChange?: (transform: Transform) => void;
  onZoomChange?: (zoomPercentage: number) => void;
}

export default function SwipeCompareRenderer({
  imageUrl,
  originalSettings,
  modifiedSettings,
  width,
  height,
  transform = { x: 0, y: 0, scale: 1 },
  onTransformChange,
  onZoomChange
}: SwipeCompareRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const originalSpriteRef = useRef<PIXI.Sprite | null>(null);
  const modifiedSpriteRef = useRef<PIXI.Sprite | null>(null);
  const [dividerPosition, setDividerPosition] = useState(50); // 分割线位置，百分比
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖动分割线

  console.log('🔄 SwipeCompareRenderer 渲染 - dividerPosition:', dividerPosition, 'isDragging:', isDragging);
  const [isImageDragging, setIsImageDragging] = useState(false); // 是否正在拖动图片
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }); // 图片拖拽起始位置

  // 应用图像设置到滤镜的辅助函数
  const applyImageSettings = (colorMatrix: PIXI.ColorMatrixFilter, settings: ImageSettings) => {
    // Basic Panel - Exposure (亮度)
    if (settings.exposure !== 0) {
      const exposureFactor = 1 + settings.exposure / 100;
      colorMatrix.brightness(exposureFactor, true);
    }

    // Highlights (对比度影响)
    if (settings.highlights !== 0) {
      const highlightFactor = 1 - settings.highlights * 0.003;
      colorMatrix.contrast(highlightFactor, true);
    }

    // Shadows (暗部亮度)
    if (settings.shadows !== 0) {
      const shadowAdjust = 1 + settings.shadows / 200;
      colorMatrix.brightness(shadowAdjust, true);
    }

    // Whites (亮部增强)
    if (settings.whites !== 0) {
      const whitesAdjust = 1 + settings.whites / 125;
      colorMatrix.brightness(whitesAdjust, true);
    }

    // Blacks (对比度)
    if (settings.blacks !== 0) {
      const blacksFactor = 1 + settings.blacks / 100;
      colorMatrix.contrast(blacksFactor, true);
    }

    // Color Panel - Saturation (饱和度)
    if (settings.saturation !== 0) {
      const saturationValue = 1 + settings.saturation / 100;
      colorMatrix.saturate(saturationValue, true);
    }

    // Temperature (色温)
    if (settings.temperature !== 0) {
      const tempFactor = settings.temperature / 100;
      const matrix = colorMatrix.matrix;

      if (tempFactor > 0) {
        // 暖色调
        matrix[0] += tempFactor * 0.2;
        matrix[6] += tempFactor * 0.1;
        matrix[10] -= tempFactor * 0.2;
      } else {
        // 冷色调
        matrix[0] += tempFactor * 0.2;
        matrix[6] += tempFactor * 0.1;
        matrix[10] -= tempFactor * 0.2;
      }
    }

    // Tint (色调)
    if (settings.tint !== 0) {
      const tintFactor = settings.tint / 100;
      const matrix = colorMatrix.matrix;

      if (tintFactor > 0) {
        matrix[0] += tintFactor * 0.15;
        matrix[6] -= tintFactor * 0.2;
        matrix[10] += tintFactor * 0.15;
      } else {
        matrix[0] += tintFactor * 0.15;
        matrix[6] -= tintFactor * 0.2;
        matrix[10] += tintFactor * 0.15;
      }
    }

    // Effects Panel - Texture (纹理)
    if (settings.texture !== 0) {
      const textureFactor = 1 + settings.texture / 100;
      colorMatrix.contrast(textureFactor, true);
    }

    // Clarity (清晰度)
    if (settings.clarity !== 0) {
      const clarityFactor = 1 + settings.clarity / 100;
      colorMatrix.contrast(clarityFactor, true);
    }
  };

  // 初始化 PIXI 和加载图片
  useEffect(() => {
    if (!containerRef.current || width <= 0 || height <= 0) {
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        // 创建应用
        const app = new PIXI.Application();

        await app.init({
          width,
          height,
          backgroundColor: 0xffffff,
          backgroundAlpha: 0,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true
        });

        if (!mounted || !containerRef.current) {
          app.destroy(true);
          return;
        }

        // 添加 canvas 到容器
        containerRef.current.appendChild(app.canvas);
        appRef.current = app;

        // 使用原生 Image 加载 blob URL
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = imageUrl;
        });

        if (!mounted) return;

        // 从 Image 元素创建纹理
        const texture = PIXI.Texture.from(img);

        // 创建原图精灵（底层）
        const originalSprite = new PIXI.Sprite(texture);
        originalSprite.anchor.set(0.5);

        // 创建修改图精灵（顶层）
        const modifiedSprite = new PIXI.Sprite(texture);
        modifiedSprite.anchor.set(0.5);

        // 计算缩放以适应画布
        const scaleX = width / img.width;
        const scaleY = height / img.height;
        const scale = Math.min(scaleX, scaleY, 1);

        // 设置原图位置和缩放
        originalSprite.scale.set(scale);
        originalSprite.position.set(width / 2, height / 2);

        // 设置修改图位置和缩放（与原图完全重叠）
        modifiedSprite.scale.set(scale);
        modifiedSprite.position.set(width / 2, height / 2);

        // 添加到舞台
        app.stage.addChild(originalSprite);
        app.stage.addChild(modifiedSprite);

        originalSpriteRef.current = originalSprite;
        modifiedSpriteRef.current = modifiedSprite;

        // 设置精灵层级
        modifiedSprite.zIndex = 1;
        originalSprite.zIndex = 0;

      } catch (error) {
        console.error('加载图片失败:', error);
      }
    };

    init();

    return () => {
      mounted = false;
      if (originalSpriteRef.current) {
        originalSpriteRef.current.destroy();
        originalSpriteRef.current = null;
      }
      if (modifiedSpriteRef.current) {
        modifiedSpriteRef.current.destroy();
        modifiedSpriteRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [imageUrl, width, height]);

  // 应用变换
  useEffect(() => {
    if (!originalSpriteRef.current || !modifiedSpriteRef.current) return;

    const texture = originalSpriteRef.current.texture;

    if (!texture || texture.width <= 1) return;

    // 计算基础缩放
    const scaleX = width / texture.width;
    const scaleY = height / texture.height;
    const baseScale = Math.min(scaleX, scaleY, 1);

    const transformedScale = baseScale * transform.scale;

    // 更新两个精灵的位置和缩放
    originalSpriteRef.current.position.set(width / 2 + transform.x, height / 2 + transform.y);
    originalSpriteRef.current.scale.set(transformedScale, transformedScale);

    modifiedSpriteRef.current.position.set(width / 2 + transform.x, height / 2 + transform.y);
    modifiedSpriteRef.current.scale.set(transformedScale, transformedScale);
  }, [transform, width, height]);

  // 应用图像调整效果和遮罩
  useEffect(() => {
    if (!originalSpriteRef.current || !modifiedSpriteRef.current) return;

    // 原图滤镜
    const originalColorMatrix = new PIXI.ColorMatrixFilter();
    applyImageSettings(originalColorMatrix, originalSettings);
    originalSpriteRef.current.filters = [originalColorMatrix];

    // 修改图滤镜
    const modifiedColorMatrix = new PIXI.ColorMatrixFilter();
    const modifiedFilters: PIXI.Filter[] = [modifiedColorMatrix];

    applyImageSettings(modifiedColorMatrix, modifiedSettings);

    // 为修改图添加颗粒效果
    if (modifiedSettings.grain > 0) {
      const blurFilter = new PIXI.BlurFilter();
      blurFilter.blur = modifiedSettings.grain * 0.05;
      modifiedFilters.push(blurFilter);
    }

    modifiedSpriteRef.current.filters = modifiedFilters;

    // 创建遮罩，只显示右半部分
    const mask = new PIXI.Graphics();
    const dividerX = width * (dividerPosition / 100);

    // 确保修改图精灵在原图精灵之上
    if (originalSpriteRef.current && modifiedSpriteRef.current) {
      modifiedSpriteRef.current.zIndex = 1;
      originalSpriteRef.current.zIndex = 0;

      // 重新排序精灵
      if (modifiedSpriteRef.current.parent) {
        modifiedSpriteRef.current.parent.sortChildren();
      }
    }

    mask.beginFill(0xFFFFFF);
    mask.rect(dividerX, 0, width - dividerX, height);
    mask.endFill();

    modifiedSpriteRef.current.mask = mask;

  }, [originalSettings, modifiedSettings, dividerPosition, width, height]);

  // 处理图片拖拽
  const handleImageMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // 检查是否点击在分割线或滑块上
    const target = e.target as HTMLElement;
    if (target.classList.contains('swipe-divider') ||
        target.classList.contains('swipe-slider') ||
        target.closest('.swipe-slider')) {
      return; // 如果点击在分割线相关元素上，不触发图片拖拽
    }

    e.preventDefault();
    setIsImageDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
  };

  // 处理图片拖拽移动
  const handleImageMouseMove = (e: MouseEvent) => {
    if (!isImageDragging || !onTransformChange) return;

    e.preventDefault();

    const newTransform = {
      ...transform,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };

    onTransformChange(newTransform);
  };

  // 处理图片拖拽结束
  const handleImageMouseUp = () => {
    setIsImageDragging(false);
  };

  // 处理滚轮缩放
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
  }, [transform, onTransformChange, onZoomChange]);

  // 添加全局鼠标事件监听
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      handleImageMouseMove(e);
    };

    const handleGlobalMouseUp = () => {
      handleImageMouseUp();
    };

    if (isImageDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isImageDragging, dragStart, transform, onTransformChange]);

  // 应用图像设置和遮罩
  useEffect(() => {
    if (!originalSpriteRef.current || !modifiedSpriteRef.current) return;

    // 原图滤镜
    const originalColorMatrix = new PIXI.ColorMatrixFilter();
    applyImageSettings(originalColorMatrix, originalSettings);
    originalSpriteRef.current.filters = [originalColorMatrix];

    // 修改图滤镜
    const modifiedColorMatrix = new PIXI.ColorMatrixFilter();
    const modifiedFilters: PIXI.Filter[] = [modifiedColorMatrix];
    applyImageSettings(modifiedColorMatrix, modifiedSettings);

    // 为修改图添加颗粒效果
    if (modifiedSettings.grain > 0) {
      const blurFilter = new PIXI.BlurFilter();
      blurFilter.blur = modifiedSettings.grain * 0.05;
      modifiedFilters.push(blurFilter);
    }

    modifiedSpriteRef.current.filters = modifiedFilters;

    // 创建遮罩，只显示右半部分
    const mask = new PIXI.Graphics();
    const dividerX = width * (dividerPosition / 100);

    mask.beginFill(0xFFFFFF);
    mask.rect(dividerX, 0, width - dividerX, height);
    mask.endFill();

    modifiedSpriteRef.current.mask = mask;

    // 确保层级正确
    originalSpriteRef.current.zIndex = 0;
    modifiedSpriteRef.current.zIndex = 1;

  }, [originalSettings, modifiedSettings, dividerPosition, width, height]);

  // 处理分割线上的鼠标按下
  const handleDividerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    // 更新分割线位置到鼠标位置
    updateDividerPosition(e.clientX);
  };

  // 处理滑块上的鼠标按下
  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    // 更新分割线位置到鼠标位置
    updateDividerPosition(e.clientX);
  };

  // 处理鼠标移动
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    e.preventDefault();
    updateDividerPosition(e.clientX);
  };

  // 处理鼠标松开
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 更新分割线位置的辅助函数
  const updateDividerPosition = (clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setDividerPosition(clampedPercentage);
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="swipe-compare-container"
      onMouseDown={handleImageMouseDown}
      style={{ cursor: isImageDragging ? 'grabbing' : 'grab' }}
    >
      {/* 分割线 */}
      <div
        className="swipe-divider"
        style={{
          left: `${dividerPosition}%`
        }}
        onMouseDown={handleDividerMouseDown}
      />
      {/* 分割线滑块 */}
      <div
        className="swipe-slider"
        style={{
          left: `${dividerPosition}%`,
          cursor: isDragging ? 'col-resize' : 'grab'
        }}
        onMouseDown={handleSliderMouseDown}
      >
        <div className="swipe-slider-arrow-left"></div>
        <div className="swipe-slider-arrow-right"></div>
      </div>
    </div>
  );
}