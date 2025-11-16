'use client';

import React, { useState, useEffect } from 'react';
import SettingsPanel from '../SettingsPanel';

interface BasicPanelProps {
  currentSettings?: BasicSettings;
  onSettingsChange?: (settings: BasicSettings) => void;
}

interface BasicSettings {
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
}

const BasicPanel: React.FC<BasicPanelProps> = ({ currentSettings, onSettingsChange }) => {
  const [settings, setSettings] = useState<BasicSettings>({
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0
  });

  // 当外部传入的 currentSettings 变化时,更新内部状态
  useEffect(() => {
    if (currentSettings) {
      setSettings({
        exposure: currentSettings.exposure,
        highlights: currentSettings.highlights,
        shadows: currentSettings.shadows,
        whites: currentSettings.whites,
        blacks: currentSettings.blacks
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

  const basicItems = [
    { label: 'Exposure', value: settings.exposure, min: -100, max: 100 },
    { label: 'Highlights', value: settings.highlights, min: -100, max: 100 },
    { label: 'Shadows', value: settings.shadows, min: -100, max: 100 },
    { label: 'Whites', value: settings.whites, min: -100, max: 100 },
    { label: 'Blacks', value: settings.blacks, min: -100, max: 100 }
  ];

  return (
    <SettingsPanel
      title="Basic Panel"
      items={basicItems}
      onItemChange={handleItemChange}
    />
  );
};

export default BasicPanel;
