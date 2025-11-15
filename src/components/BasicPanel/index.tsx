'use client';

import React, { useState } from 'react';
import SettingsPanel from '../SettingsPanel';

interface BasicPanelProps {
  onSettingsChange?: (settings: BasicSettings) => void;
}

interface BasicSettings {
  exposure: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
}

const BasicPanel: React.FC<BasicPanelProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<BasicSettings>({
    exposure: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0
  });

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
