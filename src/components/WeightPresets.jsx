import React from 'react';
import { RotateCcw } from 'lucide-react';
import { WEIGHT_PRESETS } from '../data/products';

export default function WeightPresets({ onAddPreset, onReset }) {
  return (
    <div className="weight-presets-row" role="group" aria-label="Quick weight presets">
      {WEIGHT_PRESETS.map((preset) => (
        <button
          key={preset}
          type="button"
          className="preset-btn"
          onClick={() => onAddPreset(preset)}
        >
          +{preset} kg
        </button>
      ))}
      <button
        type="button"
        className="preset-reset-btn"
        onClick={onReset}
        aria-label="Reset weight"
      >
        <RotateCcw size={14} />
        <span>Reset</span>
      </button>
    </div>
  );
}
