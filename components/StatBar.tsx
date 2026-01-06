import React from 'react';
import { Shield, Users, Crosshair, AlertTriangle } from 'lucide-react';

interface Props {
  label: string;
  value: number;
  icon: 'shield' | 'users' | 'crosshair' | 'alert';
  color: string;
}

export const StatBar: React.FC<Props> = ({ label, value, icon, color }) => {
  const getIcon = () => {
    switch (icon) {
      case 'shield': return <Shield size={16} />;
      case 'users': return <Users size={16} />;
      case 'crosshair': return <Crosshair size={16} />;
      case 'alert': return <AlertTriangle size={16} />;
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full font-tech">
      <div className="flex justify-between text-xs uppercase tracking-widest text-stone-400">
        <span className="flex items-center gap-1">{getIcon()} {label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-2 bg-stone-800 border border-stone-700 relative overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${color}`}
          style={{ width: `${value}%` }}
        />
        {/* Scanline effect on bar */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-[pulse_2s_infinite]"></div>
      </div>
    </div>
  );
};