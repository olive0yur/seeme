'use client';

import Image from 'next/image';
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

export default function ImagePreview({ image, settings, className = '' }: ImagePreviewProps) {
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
      <div className="image-preview-container">
        <Image
          src={image.url}
          alt="preview"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          style={{ 
            objectFit: 'contain',
            filter: settings ? generateFilterStyle(settings) : 'none'
          }}
          className="preview-image"
        />
      </div>
    </div>
  );
}
