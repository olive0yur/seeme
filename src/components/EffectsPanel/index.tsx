'use client';

import React, { useState } from 'react';
import SettingsPanel from '../SettingsPanel';

interface EffectsPanelProps {
  onSettingsChange?: (settings: EffectsSettings) => void;
}

interface EffectsSettings {
  texture: number;
  clarity: number;
  grain: number;
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<EffectsSettings>({
    texture: 0,
    clarity: 0,
    grain: 0
  });

  const handleItemChange = (label: string, value: number) => {
    const newSettings = {
      ...settings,
      [label.toLowerCase()]: value
    };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const effectsItems = [
    { label: 'Texture', value: settings.texture, min: -100, max: 100 },
    { label: 'Clarity', value: settings.clarity, min: -100, max: 100 },
    { label: 'Grain', value: settings.grain, min: 0, max: 100 }
  ];

  return (
    <SettingsPanel
      title="Effects Panel"
      items={effectsItems}
      onItemChange={handleItemChange}
    />
  );
};

export default EffectsPanel;
