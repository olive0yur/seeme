'use client';

import Image from 'next/image';
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

interface ImageSelectorProps {
  images: ImageFile[];
  selectedImageId: string | null;
  imageSettingsMap?: Record<string, ImageSettings>;
  onImageSelect: (imageId: string) => void;
  onImageRemove: (imageId: string) => void;
  onAddImages: () => void;
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

export default function ImageSelector({
  images,
  selectedImageId,
  imageSettingsMap = {},
  onImageSelect,
  onImageRemove,
  onAddImages,
  className = ''
}: ImageSelectorProps) {
  return (
    <>
      {/* 上传按钮 */}
      <button className='add-but' onClick={onAddImages}>+</button>
      
      {/* 分割线 */}
      <div className='divider-line'></div>
      
      {/* 图片列表 */}
      <div className='image-list'>
        {images.map((image, index) => {
          const settings = imageSettingsMap[image.id] || defaultSettings;
          
          return (
            <div 
              key={image.id}
              className={`image-item ${selectedImageId === image.id ? 'image-item-selected' : ''}`}
              onClick={() => onImageSelect(image.id)}
            >
              {/* 删除按钮 */}
              <Image 
                src="/minus.svg" 
                className='minus' 
                alt="close" 
                width={12} 
                height={12}
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemove(image.id);
                }}
              />
              
              {/* 序号 */}
              <p className='image-item-index'>{index + 1}</p>
              
              {/* 使用 PixiJS 渲染带滤镜的缩略图 */}
              <div className='image-item-thumbnail'>
                <PixiImageRenderer 
                  imageUrl={image.url}
                  settings={settings}
                  width={52}
                  height={52}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
