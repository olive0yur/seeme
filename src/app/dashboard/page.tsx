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

export default function Dashboard() {
  const [inputValue, setInputValue] = useState('');
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showUploadArea, setShowUploadArea] = useState(true);
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 缩放相关状态
  const [zoomPercentage, setZoomPercentage] = useState(100);
  
  // 图标按钮状态 - trans和two，初始状态都为灰色
  const [iconStates, setIconStates] = useState({
    trans: false,
    two: false
  });
  
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
  
  // 为每张图片保存独立的设置
  const imageSettingsMapRef = useRef<Record<string, ImageSettings>>({});
  const [imageSettingsMap, setImageSettingsMap] = useState<Record<string, ImageSettings>>({});
  
  // 当前图片的设置
  const [imageSettings, setImageSettings] = useState<ImageSettings>(defaultSettings);

  // 更新设置映射的辅助函数
  const updateSettingsMap = (id: string, settings: ImageSettings) => {
    imageSettingsMapRef.current = {
      ...imageSettingsMapRef.current,
      [id]: settings
    };
    setImageSettingsMap(imageSettingsMapRef.current);
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
  const handleFilesUpload = (files: File[]) => {
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
    
    // 切换到上传后界面
    setShowUploadArea(false);
  };

  // 处理图片选择
  const handleImageSelect = (imageId: string) => {
    // 如果选择的是同一张图片，不做任何操作
    if (selectedImageId === imageId) return;
    
    // 保存当前图片的设置
    if (selectedImageId) {
      updateSettingsMap(selectedImageId, imageSettings);
    }
    
    // 切换到新图片
    setSelectedImageId(imageId);
    
    // 恢复新图片的设置
    const savedSettings = imageSettingsMapRef.current[imageId];
    if (savedSettings) {
      setImageSettings(savedSettings);
    } else {
      setImageSettings({ ...defaultSettings });
    }
  };

  // 处理图片删除
  const handleImageRemove = (imageId: string) => {
    setUploadedImages((prev: ImageFile[]) => {
      const filtered = prev.filter(img => img.id !== imageId);
      
      // 删除该图片的设置
      delete imageSettingsMapRef.current[imageId];
      setImageSettingsMap({ ...imageSettingsMapRef.current });
      
      // 如果删除的是当前选中的图片，选择下一张
      if (selectedImageId === imageId) {
        const currentIndex = prev.findIndex(img => img.id === imageId);
        const nextImage = filtered[currentIndex] || filtered[currentIndex - 1] || null;
        
        if (nextImage) {
          setSelectedImageId(nextImage.id);
          // 恢复下一张图片的设置
          const savedSettings = imageSettingsMapRef.current[nextImage.id];
          setImageSettings(savedSettings || defaultSettings);
        } else {
          setSelectedImageId(null);
          setImageSettings(defaultSettings);
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
    setImageSettings((prev: ImageSettings) => {
      const newSettings = {
        ...prev,
        ...basicSettings
      };
      // 实时保存到 map
      if (selectedImageId) {
        updateSettingsMap(selectedImageId, newSettings);
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
      // 实时保存到 map
      if (selectedImageId) {
        updateSettingsMap(selectedImageId, newSettings);
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
      // 实时保存到 map
      if (selectedImageId) {
        updateSettingsMap(selectedImageId, newSettings);
      }
      return newSettings;
    });
  };

  // 重置图片设置
  const handleResetSettings = () => {
    setImageSettings(defaultSettings);
    
    // 同时清除保存的设置
    if (selectedImageId) {
      delete imageSettingsMapRef.current[selectedImageId];
      setImageSettingsMap({ ...imageSettingsMapRef.current });
    }
  };

  // 处理图标按钮点击
  const handleIconClick = (iconType: 'trans' | 'two') => {
    setIconStates(prev => {
      const newStates = { ...prev };
      
      // 如果点击的图标当前是激活状态，可以取消激活（允许两个都为灰色）
      if (prev[iconType]) {
        newStates[iconType] = false;
      } else {
        // 如果点击的图标当前是非激活状态，则激活它
        newStates[iconType] = true;
      }
      
      // 但是不允许两个同时都为黑色（激活状态）
      if (newStates.trans && newStates.two) {
        // 如果两个都要激活，则取消另一个的激活状态
        const otherIcon = iconType === 'trans' ? 'two' : 'trans';
        newStates[otherIcon] = false;
      }
      
      return newStates;
    });
  };

  // 获取当前选中的图片
  const selectedImage = uploadedImages.find(img => img.id === selectedImageId) || null;

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
              imageSettingsMap={imageSettingsMap}
              onImageSelect={handleImageSelect}
              onImageRemove={handleImageRemove}
              onAddImages={handleAddMoreImages}
            />
          </div>
          
          {/* 主图显示区域 */}
          <div className='main-image-area'>
            <ImageEditor 
              image={selectedImage} 
              settings={imageSettings}
              onZoomChange={setZoomPercentage}
            />
            
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
                  <BasicPanel onSettingsChange={handleBasicSettingsChange} />
                  <ColorPanel onSettingsChange={handleColorSettingsChange} />
                  <EffectsPanel onSettingsChange={handleEffectsSettingsChange} />
                </div>
              )}
            </div>
            <div className='download-button'>
              <button onClick={handleResetSettings}>
                <Image src="/download.svg" className='mr-[8px]' alt="download" width={18} height={18} />Download
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