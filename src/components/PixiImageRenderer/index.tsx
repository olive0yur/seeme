'use client';

import { useEffect, useRef } from 'react';
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

interface PixiImageRendererProps {
  imageUrl: string;
  settings: ImageSettings;
  width: number;
  height: number;
  transform?: {
    x: number;
    y: number;
    scale: number;
  };
}

export default function PixiImageRenderer({ 
  imageUrl, 
  settings, 
  width, 
  height,
  transform = { x: 0, y: 0, scale: 1 }
}: PixiImageRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const spriteRef = useRef<PIXI.Sprite | null>(null);

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
          autoDensity: true,
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
        const sprite = new PIXI.Sprite(texture);

        sprite.anchor.set(0.5);
        
        // 计算缩放以适应画布
        const scaleX = width / img.width;
        const scaleY = height / img.height;
        const scale = Math.min(scaleX, scaleY, 1);
        
        sprite.scale.set(scale);
        sprite.position.set(width / 2, height / 2);
        
        // 添加到舞台
        app.stage.addChild(sprite);
        spriteRef.current = sprite;

      } catch (error) {
        console.error('加载图片失败:', error);
      }
    };

    init();

    return () => {
      mounted = false;
      if (spriteRef.current) {
        spriteRef.current.destroy();
        spriteRef.current = null;
      }
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
        appRef.current = null;
      }
    };
  }, [imageUrl, width, height]);

  // 应用变换
  useEffect(() => {
    if (!spriteRef.current) return;
    
    const sprite = spriteRef.current;
    const texture = sprite.texture;
    
    if (!texture || texture.width <= 1) return;
    
    const baseScale = Math.min(
      width / texture.width,
      height / texture.height,
      1
    );
    
    sprite.position.set(width / 2 + transform.x, height / 2 + transform.y);
    sprite.scale.set(baseScale * transform.scale, baseScale * transform.scale);
  }, [transform, width, height]);

  // 应用图像调整效果
  useEffect(() => {
    if (!spriteRef.current) return;

    const colorMatrix = new PIXI.ColorMatrixFilter();
    
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
    
    const filters: PIXI.Filter[] = [colorMatrix];
    
    // Grain (颗粒/模糊)
    if (settings.grain > 0) {
      const blurFilter = new PIXI.BlurFilter();
      blurFilter.blur = settings.grain * 0.05;
      filters.push(blurFilter);
    }
    
    spriteRef.current.filters = filters;
    
  }, [settings]);

  return <div ref={containerRef} className="pixi-canvas-container" />;
}
