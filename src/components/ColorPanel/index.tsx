'use client';

import React, { useState, useEffect } from 'react';
import SettingsPanel from '../SettingsPanel';

interface ColorPanelProps {
  currentSettings?: ColorSettings;
  onSettingsChange?: (settings: ColorSettings) => void;
}

interface ColorSettings {
  temperature: number;
  tint: number;
  saturation: number;
}

const ColorPanel: React.FC<ColorPanelProps> = ({ currentSettings, onSettingsChange }) => {
  const [settings, setSettings] = useState<ColorSettings>({
    temperature: 0,
    tint: 0,
    saturation: 0
  });

  // 当外部传入的 currentSettings 变化时,更新内部状态
  useEffect(() => {
    if (currentSettings) {
      setSettings({
        temperature: currentSettings.temperature,
        tint: currentSettings.tint,
        saturation: currentSettings.saturation
      });
    }
  }, [currentSettings]);

  const handleItemChange = (label: string, value: number) => {
    const newSettings = {
      ...settings,
      [label.toLowerCase()]: value
    };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const colorItems = [
    { 
      label: 'Temperature', 
      value: settings.temperature, 
      min: -100, 
      max: 100,
      gradient: 'linear-gradient(90deg, #3B3BFF 0%, #CECECE 50%, #FFFF54 100%)'
    },
    { 
      label: 'Tint', 
      value: settings.tint, 
      min: -100, 
      max: 100,
      gradient: 'linear-gradient(90deg, #00D736 0%, #D6D6D6 50%, #E000E0 100%)'
    },
    { 
      label: 'Saturation', 
      value: settings.saturation, 
      min: -100, 
      max: 100,
      gradient: 'linear-gradient(90deg, #CACACA 0%, #66D082 39.51%, #FFB502 65.4%, #FF0200 100%)'
    }
  ];

  return (
    <SettingsPanel
      title="Color Panel"
      items={colorItems}
      onItemChange={handleItemChange}
    />
  );
};

export default ColorPanel;
