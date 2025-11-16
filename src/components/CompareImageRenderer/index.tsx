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

interface CompareImageRendererProps {
  imageUrl: string;
  originalSettings: ImageSettings;
  modifiedSettings: ImageSettings;
  width: number;
  height: number;
  transform?: {
    x: number;
    y: number;
    scale: number;
  };
}

export default function CompareImageRenderer({
  imageUrl,
  originalSettings,
  modifiedSettings,
  width,
  height,
  transform = { x: 0, y: 0, scale: 1 }
}: CompareImageRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const originalSpriteRef = useRef<PIXI.Sprite | null>(null);
  const modifiedSpriteRef = useRef<PIXI.Sprite | null>(null);

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

        // 创建原图精灵（左侧）
        const originalSprite = new PIXI.Sprite(texture);
        originalSprite.anchor.set(0.5);

        // 创建修改图精灵（右侧）
        const modifiedSprite = new PIXI.Sprite(texture);
        modifiedSprite.anchor.set(0.5);

        // 计算缩放以适应画布
        const scaleX = (width / 2) / img.width;
        const scaleY = height / img.height;
        const scale = Math.min(scaleX, scaleY, 1);

        // 设置原图位置和缩放（左侧）- 在左半部分居中
        originalSprite.scale.set(scale);
        originalSprite.position.set(width / 4, height / 2);

        // 设置修改图位置和缩放（右侧）- 在右半部分居中
        modifiedSprite.scale.set(scale);
        modifiedSprite.position.set(width * 3 / 4, height / 2);

        // 添加到舞台
        app.stage.addChild(originalSprite);
        app.stage.addChild(modifiedSprite);

        originalSpriteRef.current = originalSprite;
        modifiedSpriteRef.current = modifiedSprite;

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
    const scaleX = (width / 2) / texture.width;
    const scaleY = height / texture.height;
    const baseScale = Math.min(scaleX, scaleY, 1);

    const transformedScale = baseScale * transform.scale;

    // 更新原图位置和缩放（左侧）
    originalSpriteRef.current.position.set(width / 4 + transform.x, height / 2 + transform.y);
    originalSpriteRef.current.scale.set(transformedScale, transformedScale);

    // 更新修改图位置和缩放（右侧）
    modifiedSpriteRef.current.position.set(width * 3 / 4 + transform.x, height / 2 + transform.y);
    modifiedSpriteRef.current.scale.set(transformedScale, transformedScale);
  }, [transform, width, height]);

  // 应用图像调整效果
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

  }, [originalSettings, modifiedSettings]);

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

  return <div ref={containerRef} className="pixi-canvas-container" />;
}