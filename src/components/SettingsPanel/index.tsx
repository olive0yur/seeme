'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './index.css';

interface SettingItem {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  gradient?: string;
}

interface SettingsPanelProps {
  title: string;
  items: SettingItem[];
  isCollapsed?: boolean;
  onItemChange?: (label: string, value: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  title,
  items,
  isCollapsed = false,
  onItemChange
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);

  const handleSliderChange = (label: string, value: number) => {
    onItemChange?.(label, value);
  };

  // 防止滑块拦截滚轮事件
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      
      // 检查是否在滑块或滑块容器内
      if (target.matches('input[type="range"]') || 
          target.closest('.settings-item-slider') ||
          target.closest('.slider-track')) {
        e.preventDefault();
        const parent = target.closest('.settings-panels') as HTMLElement;
        if (parent) {
          // 增加滚动距离，提高灵敏度
          const scrollAmount = e.deltaY * 2;
          parent.scrollTop += scrollAmount;
        }
      }
    };

    document.addEventListener('wheel', handleWheel, { passive: false });
    return () => document.removeEventListener('wheel', handleWheel);
  }, []);

  const getSliderBackground = (item: SettingItem) => {
    if (item.gradient) {
      return item.gradient;
    }
    
    // 计算滑块位置百分比
    const min = item.min || -100;
    const max = item.max || 100;
    const percentage = ((item.value - min) / (max - min)) * 100;
    
    return `linear-gradient(90deg, #0ABAB5 0%, #0ABAB5 ${percentage}%, #F1F1F1 ${percentage}%, #F1F1F1 100%)`;
  };

  return (
    <div className="settings-panel">
      <div 
        className="settings-panel-header"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="settings-panel-title">{title}</span>
        <Image 
          src="/see-arrow.svg" 
          alt="arrow" 
          width={12} 
          height={12}
          className={`settings-panel-arrow ${collapsed ? 'collapsed' : ''}`}
        />
      </div>
      
      {!collapsed && (
        <div className="settings-panel-content">
          {items.map((item, index) => (
            <div key={index} className="settings-item">
              <div className="settings-item-header">
                <span className="settings-item-label">{item.label}</span>
                <span className="settings-item-value">{item.value}</span>
              </div>
              <div className="settings-item-slider">
                <div 
                  className="slider-track"
                  style={{
                    background: getSliderBackground(item)
                  }}
                >
                  <input
                    type="range"
                    min={item.min || -100}
                    max={item.max || 100}
                    step={item.step || 1}
                    value={item.value}
                    onChange={(e) => handleSliderChange(item.label, Number(e.target.value))}
                    className="slider"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;
