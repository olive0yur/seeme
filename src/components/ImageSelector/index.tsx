'use client';

import Image from 'next/image';
import './index.css';

interface ImageFile {
  file: File;
  url: string;
  id: string;
}

interface ImageSelectorProps {
  images: ImageFile[];
  selectedImageId: string | null;
  onImageSelect: (imageId: string) => void;
  onImageRemove: (imageId: string) => void;
  onAddImages: () => void;
  className?: string;
}

export default function ImageSelector({
  images,
  selectedImageId,
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
        {images.map((image, index) => (
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
            
            {/* 图片 */}
            <Image 
              src={image.url} 
              className='image-item-image' 
              alt="image" 
              width={52} 
              height={52}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
