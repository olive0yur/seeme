'use client';

import BounceCards from '@/components/BounceCards';
import FileUploader from '@/components/FileUploader';
import ImageSelector from '@/components/ImageSelector';
import ImagePreview from '@/components/ImagePreview';
import ImageEditor from '@/components/ImageEditor';
import ProjectSelector from '@/components/ProjectSelector';
import BasicPanel from '@/components/BasicPanel';
import ColorPanel from '@/components/ColorPanel';
import EffectsPanel from '@/components/EffectsPanel';
import Image from 'next/image';
import { useState, useRef } from 'react';
import './index.css';

interface ImageFile {
  file: File;
  url: string;
  id: string;
}

interface Project {
  id: string;
  name: string;
  thumbnail: string;
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

interface Transform {
  x: number;
  y: number;
  scale: number;
}

interface ImageState {
  settings: ImageSettings;
  transform: Transform;
  zoomPercentage: number;
}

export default function Dashboard() {
  const [inputValue, setInputValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showUploadArea, setShowUploadArea] = useState(true);
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 图片处理进度相关状态
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  
  // 缩放相关状态
  const [zoomPercentage, setZoomPercentage] = useState(100);

  // 变换相关状态
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });

  // 图标按钮状态 - trans和two，初始状态都为灰色
  const [iconStates, setIconStates] = useState({
    trans: false,
    two: false
  });

  // 对比视图状态：'single' | 'compare' | 'modified'
  const [viewMode, setViewMode] = useState<'single' | 'compare' | 'modified'>('single');

  // trans 模式状态
  const [transMode, setTransMode] = useState(false);

  // 默认设置
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

  // 默认变换状态
  const defaultTransform: Transform = { x: 0, y: 0, scale: 1 };
  const defaultZoom = 100;

  // 为每张图片保存完整的状态（设置 + 变换 + 缩放）
  const imageStateMapRef = useRef<Record<string, ImageState>>({});
  const [imageStateMap, setImageStateMap] = useState<Record<string, ImageState>>({});

  // 当前图片的设置和状态
  const [imageSettings, setImageSettings] = useState<ImageSettings>(defaultSettings);

  // 更新图片完整状态的辅助函数
  const updateImageState = (id: string, state: Partial<ImageState>) => {
    const currentState = imageStateMapRef.current[id] || {
      settings: defaultSettings,
      transform: defaultTransform,
      zoomPercentage: defaultZoom
    };

    const newState = {
      ...currentState,
      ...state
    };

    imageStateMapRef.current = {
      ...imageStateMapRef.current,
      [id]: newState
    };
    setImageStateMap(imageStateMapRef.current);
  };

  // 获取图片状态的辅助函数
  const getImageState = (id: string): ImageState => {
    return imageStateMapRef.current[id] || {
      settings: defaultSettings,
      transform: defaultTransform,
      zoomPercentage: defaultZoom
    };
  };

  const images = [
  "https://static.onew.design/layer1.png",
  "https://static.onew.design/layer2.png",
  "https://static.onew.design/layer3.png",
  "https://static.onew.design/layer4.png",
  "https://static.onew.design/layer5.png"
];

const transformStyles = [
  "rotate(-7deg) translate(-150px,-14px)",
  "rotate(-3deg) translate(-100px,-10px)",
  "rotate(0deg) translate(-50px,-10px)",
  "rotate(3deg) translate(10px,-10px)",
  "rotate(7deg) translate(60px,-8px)"
];

  // 处理文件上传
  const handleFilesUpload = async (files: File[]) => {
    const newImages: ImageFile[] = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
    
    // 如果是第一次上传，自动选择第一张图片
    if (uploadedImages.length === 0 && newImages.length > 0) {
      setSelectedImageId(newImages[0].id);
    }
    
    // 切换到上传后界面并开始处理动画
    setShowUploadArea(false);
    setIsProcessingImage(true);
    setProcessingProgress(0);
    
    // 模拟图片处理进度 (Skin smoothing)
    const duration = 3000; // 3秒完成
    const interval = 50; // 每50ms更新一次
    const steps = duration / interval;
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min((currentStep / steps) * 100, 100);
      setProcessingProgress(Math.floor(progress));
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsProcessingImage(false);
          setProcessingProgress(0);
        }, 500); // 短暂延迟后隐藏遮罩
      }
    }, interval);
  };

  // 处理图片选择
  const handleImageSelect = (imageId: string) => {
    // 如果选择的是同一张图片，不做任何操作
    if (selectedImageId === imageId) return;

    // 保存当前图片的完整状态
    if (selectedImageId) {
      updateImageState(selectedImageId, {
        settings: imageSettings,
        transform: transform,
        zoomPercentage: zoomPercentage
      });
      console.log('💾 保存图片状态:', selectedImageId, imageSettings);
    }

    // 切换到新图片
    setSelectedImageId(imageId);

    // 恢复新图片的完整状态
    const savedState = getImageState(imageId);
    console.log('📂 加载图片状态:', imageId, savedState.settings);
    setImageSettings(savedState.settings);
    setTransform(savedState.transform);
    setZoomPercentage(savedState.zoomPercentage);
  };

  // 处理图片删除
  const handleImageRemove = (imageId: string) => {
    setUploadedImages((prev: ImageFile[]) => {
      const filtered = prev.filter(img => img.id !== imageId);
      
      // 删除该图片的状态
      delete imageStateMapRef.current[imageId];
      setImageStateMap({ ...imageStateMapRef.current });
      
      // 如果删除的是当前选中的图片，选择下一张
      if (selectedImageId === imageId) {
        const currentIndex = prev.findIndex(img => img.id === imageId);
        const nextImage = filtered[currentIndex] || filtered[currentIndex - 1] || null;
        
        if (nextImage) {
          setSelectedImageId(nextImage.id);
          // 恢复下一张图片的完整状态
          const savedState = getImageState(nextImage.id);
          setImageSettings(savedState.settings);
          setTransform(savedState.transform);
          setZoomPercentage(savedState.zoomPercentage);
        } else {
          setSelectedImageId(null);
          setImageSettings(defaultSettings);
          setTransform(defaultTransform);
          setZoomPercentage(defaultZoom);
        }
      }
      
      // 如果没有图片了，回到上传界面
      if (filtered.length === 0) {
        setShowUploadArea(true);
      }
      
      return filtered;
    });
  };

  // 处理添加更多图片
  const handleAddMoreImages = () => {
    fileInputRef.current?.click();
  };

  // 处理项目相关操作
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleProjectRemove = (projectId: string) => {
    setProjects((prev: Project[]) => prev.filter(p => p.id !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  };

  const handleAddProject = () => {
    // 创建新项目逻辑
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: `项目 ${projects.length + 1}`,
      thumbnail: '/avatar.png' // 默认缩略图
    };
    setProjects((prev: Project[]) => [...prev, newProject]);
  };

  // 处理设置变化
  const handleBasicSettingsChange = (basicSettings: Partial<ImageSettings>) => {
    console.log('⚙️ Basic设置变化:', basicSettings);
    setImageSettings((prev: ImageSettings) => {
      const newSettings = {
        ...prev,
        ...basicSettings
      };
      console.log('📝 新的完整设置:', newSettings);
      // 实时保存完整状态
      if (selectedImageId) {
        updateImageState(selectedImageId, {
          settings: newSettings
        });
      }
      return newSettings;
    });
  };

  const handleColorSettingsChange = (colorSettings: Partial<ImageSettings>) => {
    setImageSettings((prev: ImageSettings) => {
      const newSettings = {
        ...prev,
        ...colorSettings
      };
      // 实时保存完整状态
      if (selectedImageId) {
        updateImageState(selectedImageId, {
          settings: newSettings
        });
      }
      return newSettings;
    });
  };

  const handleEffectsSettingsChange = (effectsSettings: Partial<ImageSettings>) => {
    setImageSettings((prev: ImageSettings) => {
      const newSettings = {
        ...prev,
        ...effectsSettings
      };
      // 实时保存完整状态
      if (selectedImageId) {
        updateImageState(selectedImageId, {
          settings: newSettings
        });
      }
      return newSettings;
    });
  };

  // 处理变换变化
  const handleTransformChange = (newTransform: Transform) => {
    setTransform(newTransform);

    // 实时保存完整状态
    if (selectedImageId) {
      updateImageState(selectedImageId, {
        transform: newTransform
      });
    }
  };

  // 处理缩放变化
  const handleZoomChange = (newZoom: number) => {
    setZoomPercentage(newZoom);

    // 实时保存完整状态
    if (selectedImageId) {
      updateImageState(selectedImageId, {
        zoomPercentage: newZoom
      });
    }
  };

  // 重置图片设置
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleResetSettings = () => {
    setImageSettings(defaultSettings);
    setTransform(defaultTransform);
    setZoomPercentage(defaultZoom);

    // 同时清除保存的完整状态
    if (selectedImageId) {
      delete imageStateMapRef.current[selectedImageId];
      setImageStateMap({ ...imageStateMapRef.current });
    }
  };

  // 处理图标按钮点击
  const handleIconClick = (iconType: 'trans' | 'two') => {
    if (iconType === 'two') {
      // two 按钮的特殊处理：循环切换三种视图模式
      setViewMode(prev => {
        let newViewMode: 'single' | 'compare' | 'modified';
        if (prev === 'single') {
          newViewMode = 'compare'; // 第一次点击：显示对比视图
        } else if (prev === 'compare') {
          newViewMode = 'modified'; // 第二次点击：只显示修改后的图
        } else {
          newViewMode = 'single'; // 第三次点击：回到单图模式
        }
        
        // 同时更新按钮状态
        setIconStates(prevStates => ({
          ...prevStates,
          two: newViewMode !== 'single' // 非单图模式时显示为激活状态
        }));
        
        return newViewMode;
      });

      // 激活 two 模式时，关闭 trans 模式
      setTransMode(false);
      setIconStates(prev => ({ ...prev, trans: false }));

    } else if (iconType === 'trans') {
      // trans 按钮逻辑：切换滑动对比模式
      setTransMode(prev => {
        const newTransMode = !prev;
        console.log('🔀 切换 trans 模式:', newTransMode);
        return newTransMode;
      });

      // 激活 trans 模式时，关闭 two 模式并重置 viewMode
      setViewMode('single');
      setIconStates(prev => ({
        ...prev,
        trans: !prev.trans,
        two: false
      }));
    }
  };

  // 获取当前选中的图片
  const selectedImage = uploadedImages.find(img => img.id === selectedImageId) || null;

  // 检查当前图片是否有任何调整(是否有非零的设置值)
  const hasImageAdjustments = () => {
    return (
      imageSettings.exposure !== 0 ||
      imageSettings.highlights !== 0 ||
      imageSettings.shadows !== 0 ||
      imageSettings.whites !== 0 ||
      imageSettings.blacks !== 0 ||
      imageSettings.temperature !== 0 ||
      imageSettings.tint !== 0 ||
      imageSettings.saturation !== 0 ||
      imageSettings.texture !== 0 ||
      imageSettings.clarity !== 0 ||
      imageSettings.grain !== 0
    );
  };

  // 处理下载编辑后的图片
  const handleDownloadImage = async () => {
    if (!selectedImage) return;

    try {
      // 创建一个离屏 canvas 来渲染编辑后的图片
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = selectedImage.url;
      });

      // 创建 canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      // 绘制原图
      ctx.drawImage(img, 0, 0);

      // 应用滤镜效果
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 应用各种调整
      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Exposure (曝光)
        if (imageSettings.exposure !== 0) {
          const exposureFactor = 1 + imageSettings.exposure / 100;
          r *= exposureFactor;
          g *= exposureFactor;
          b *= exposureFactor;
        }

        // Temperature (色温)
        if (imageSettings.temperature !== 0) {
          const tempFactor = imageSettings.temperature / 100;
          r += tempFactor * 50;
          b -= tempFactor * 50;
        }

        // Tint (色调)
        if (imageSettings.tint !== 0) {
          const tintFactor = imageSettings.tint / 100;
          r += tintFactor * 30;
          g -= tintFactor * 40;
          b += tintFactor * 30;
        }

        // Saturation (饱和度)
        if (imageSettings.saturation !== 0) {
          const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
          const saturationFactor = 1 + imageSettings.saturation / 100;
          r = gray + (r - gray) * saturationFactor;
          g = gray + (g - gray) * saturationFactor;
          b = gray + (b - gray) * saturationFactor;
        }

        // Highlights (高光)
        if (imageSettings.highlights !== 0) {
          const brightness = (r + g + b) / 3;
          if (brightness > 128) {
            const factor = 1 - imageSettings.highlights * 0.003;
            const diff = brightness - 128;
            r = 128 + diff * factor + (r - brightness);
            g = 128 + diff * factor + (g - brightness);
            b = 128 + diff * factor + (b - brightness);
          }
        }

        // Shadows (阴影)
        if (imageSettings.shadows !== 0) {
          const brightness = (r + g + b) / 3;
          if (brightness < 128) {
            const factor = 1 + imageSettings.shadows / 200;
            r *= factor;
            g *= factor;
            b *= factor;
          }
        }

        // Whites (白色)
        if (imageSettings.whites !== 0) {
          const factor = 1 + imageSettings.whites / 125;
          const brightness = (r + g + b) / 3;
          if (brightness > 200) {
            r *= factor;
            g *= factor;
            b *= factor;
          }
        }

        // Blacks (黑色)
        if (imageSettings.blacks !== 0) {
          const brightness = (r + g + b) / 3;
          if (brightness < 55) {
            const factor = 1 + imageSettings.blacks / 100;
            const diff = brightness;
            r = diff * factor + (r - brightness);
            g = diff * factor + (g - brightness);
            b = diff * factor + (b - brightness);
          }
        }

        // 确保值在有效范围内
        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }

      // 应用模糊效果 (Grain)
      if (imageSettings.grain > 0) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.putImageData(imageData, 0, 0);
          ctx.filter = `blur(${imageSettings.grain * 0.5}px)`;
          ctx.drawImage(tempCanvas, 0, 0);
          ctx.filter = 'none';
        }
      } else {
        ctx.putImageData(imageData, 0, 0);
      }

      // 转换为 blob 并下载
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edited_${selectedImage.file.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');

    } catch (error) {
      console.error('下载图片失败:', error);
    }
  };

  return <div className='screen-dashboard h-screen relative'>
    {/* 图片上传区域 */}
    {showUploadArea && (
      <div className='upload-area-container'>
        <div className='head-dashboard flex justify-between items-center'>
          <Image src="/seeme-b.svg" alt="logo" width={157} height={29.897} />
          <div className='head-dashboard-title flex items-center gap-[11px]'>
            <Image className='rounded-full' src="/avatar.png" alt="logo" width={40} height={40} />
            <p className='text-[16px] leading-[24px] font-medium'>Name</p>
          </div>
        </div>
        <div className='upload-area'>
          <BounceCards
            className="custom-bounceCards"
            images={images}
            containerWidth={500}
            containerHeight={250}
            animationDelay={1}
            animationStagger={0.1}
            easeType="elastic.out(1, 0.5)"
            transformStyles={transformStyles}
            enableHover={false}
          />
          <div className='upload-area-title'>
            <h1>SeeMe</h1>
            <p>&quot;Retouching is not &apos;skin smoothing&apos;, but &apos;the art of preserving real texture&apos;.&quot;</p>
          </div>
          <FileUploader onFilesUpload={handleFilesUpload} />
        </div>
      </div>
    )}
    
    {/* 上传后区域 */}
    {!showUploadArea && (
      <div className='upload-after-container'>
        {/* logo区域 */}
        <div className='absolute top-[45px] left-[96px] z-11'>
          <Image src="/seeme-b.svg" alt="logo" width={157} height={29.897} />
        </div>

        {/* 图片区域 */}
        <div className='image-modify-area'>
          {/* 右侧项目选择区域 */}
          <div className='right-project-area'>
            <ProjectSelector
              projects={projects}
              selectedProjectId={selectedProjectId}
              onProjectSelect={handleProjectSelect}
              onProjectRemove={handleProjectRemove}
              onAddProject={handleAddProject}
            />
          </div>
          
          {/* 图片选择器 */}
          <div className='image-selector'>
            <ImageSelector
              images={uploadedImages}
              selectedImageId={selectedImageId}
              imageSettingsMap={imageStateMap}
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              onAddImages={handleAddMoreImages}
            />
          </div>
          
          {/* 主图显示区域 */}
          <div className='main-image-area' style={{ position: 'relative' }}>
            <ImageEditor
              image={selectedImage}
              settings={imageSettings}
              transform={transform}
              onTransformChange={handleTransformChange}
              onZoomChange={handleZoomChange}
              viewMode={viewMode}
              transMode={transMode}
            />
            
            {/* 图片处理进度遮罩 */}
            {isProcessingImage && selectedImage && (
              <div 
                className='processing-overlay'
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.60)',
                  backdropFilter: 'blur(2px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px',
                  zIndex: 1000,
                  pointerEvents: 'none'
                }}
              >
                {/* 加载圆圈 */}
                <div 
                  className='processing-spinner'
                  style={{
                    width: '80px',
                    height: '80px',
                    flexShrink: 0,
                    aspectRatio: '1/1',
                    borderRadius: '50%',
                    border: '8px solid #2781FF33',
                    borderTopColor: '#0ABAB5',
                    borderLeftColor: '#0ABAB5',
                    animation: 'spin 1s linear infinite',
                    position: 'relative',
                    boxShadow: '0 0 20px rgba(10, 186, 181, 0.3)'
                  }}
                />
                
                {/* 进度文字 */}
                <div 
                  style={{
                    fontSize: '30px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '36px',
                    color: '#000',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ color: '#0ABAB5', fontWeight: 600 }}>{processingProgress}%</span>
                  {' '}Skin smoothing in progress...
                </div>
              </div>
            )}
            
            {/* 缩放百分比显示 */}
            <div className='zoom-percentage-display'>
              {Math.round(zoomPercentage)}%
            </div>
            
            {/* 图标按钮区域 */}
            <div className='icon-buttons-area'>
              <button 
                className='icon-button'
                onClick={() => handleIconClick('trans')}
              >
                <Image 
                  src={iconStates.trans ? "/trans-b.svg" : "/trans.svg"} 
                  alt="trans" 
                  width={16} 
                  height={16} 
                />
              </button>
              <button 
                className='icon-button'
                onClick={() => handleIconClick('two')}
              >
                <Image 
                  src={iconStates.two ? "/two-b.svg" : "/two.svg"} 
                  alt="two" 
                  width={16} 
                  height={16} 
                />
              </button>
            </div>
          </div>
          
          {/* ai对话框 */}
          <div className='ai-dialog'>
            <input 
              type="text" 
              className='ai-dialog-input' 
              placeholder='Subscribe to start creating...'
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            
            {/* 语音识别按钮 */}
            <div className='flex'>
              <button className='ai-dialog-voice-button mr-[24px]'>
                <Image src="/voice.svg" alt="voice" width={24} height={24} />
              </button>
              {/* 发送按钮 */}
              <button className={`ai-dialog-button ${inputValue.trim() ? 'ai-dialog-button-active' : ''}`}>
                <Image src="/see-arrow.svg" alt="send" width={24} height={24} />
              </button>
            </div>
          </div>
        </div>

        {/* 右侧框 */}
        <div className='right-box'>
          <div className='right-preview'>
            <ImagePreview image={selectedImage} />
          </div>

          <div className='right-settings'>
            <div className='settings-box'>
              <div 
                className='settings-box-title'
                onClick={() => setSettingsCollapsed(!settingsCollapsed)}
              >
                Settings
                <Image 
                  src="/arrow-top.svg" 
                  alt="arrow" 
                  width={14} 
                  height={14}
                  className={`settings-collapse-arrow ${settingsCollapsed ? 'collapsed' : ''}`}
                />
              </div>
              {!settingsCollapsed && (
                <div 
                  className='settings-panels'
                  onWheel={(e) => {
                    // 确保滚轮事件能正常工作
                    e.currentTarget.scrollTop += e.deltaY;
                  }}
                >
                  <BasicPanel 
                    currentSettings={{
                      exposure: imageSettings.exposure,
                      highlights: imageSettings.highlights,
                      shadows: imageSettings.shadows,
                      whites: imageSettings.whites,
                      blacks: imageSettings.blacks
                    }}
                    onSettingsChange={handleBasicSettingsChange} 
                  />
                  <ColorPanel 
                    currentSettings={{
                      temperature: imageSettings.temperature,
                      tint: imageSettings.tint,
                      saturation: imageSettings.saturation
                    }}
                    onSettingsChange={handleColorSettingsChange} 
                  />
                  <EffectsPanel 
                    currentSettings={{
                      texture: imageSettings.texture,
                      clarity: imageSettings.clarity,
                      grain: imageSettings.grain
                    }}
                    onSettingsChange={handleEffectsSettingsChange} 
                  />
                </div>
              )}
            </div>
            <div className='download-button'>
              <button 
                onClick={handleDownloadImage}
                disabled={!hasImageAdjustments()}
                style={{
                  backgroundColor: hasImageAdjustments() ? '#0ABAB5' : '#EFF0F2',
                  color: hasImageAdjustments() ? '#FFFFFF' : '#000000',
                  cursor: hasImageAdjustments() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease'
                }}
              >
                <Image 
                  src="/download.svg" 
                  className='mr-[8px]' 
                  alt="download" 
                  width={18} 
                  height={18}
                  style={{
                    filter: hasImageAdjustments() ? 'brightness(0) invert(1)' : 'none'
                  }}
                />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* 隐藏的文件输入框用于添加更多图片 */}
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      multiple
      style={{ display: 'none' }}
      onChange={(e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
          handleFilesUpload(files);
        }
      }}
    />
  </div>;
}