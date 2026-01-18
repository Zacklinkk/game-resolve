import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Crosshair, AlertTriangle } from 'lucide-react';

interface Props {
  label: string;
  value: number;
  previousValue?: number;
  icon: 'shield' | 'users' | 'crosshair' | 'alert';
  color: string;
}

export const StatBar: React.FC<Props> = ({
  label,
  value,
  previousValue = value,
  icon,
  color
}) => {
  const [showChange, setShowChange] = useState(false);
  const [changeValue, setChangeValue] = useState(0);
  const [floatingNumbers, setFloatingNumbers] = useState<Array<{
    id: number;
    value: number;
    x: number;
  }>>([]);

  // 检测数值变化
  useEffect(() => {
    if (previousValue !== value) {
      const diff = value - previousValue;

      // 显示变化提示
      setChangeValue(diff);
      setShowChange(true);

      // 添加浮动数字动画
      const newFloating = {
        id: Date.now(),
        value: diff,
        x: Math.random() * 40 - 20 // 随机水平偏移
      };
      setFloatingNumbers(prev => [...prev, newFloating]);

      // 2秒后隐藏变化提示
      setTimeout(() => setShowChange(false), 2000);

      // 3秒后移除浮动数字
      setTimeout(() => {
        setFloatingNumbers(prev => prev.filter(f => f.id !== newFloating.id));
      }, 3000);
    }
  }, [value, previousValue]);
  const getIcon = () => {
    switch (icon) {
      case 'shield': return <Shield size={16} />;
      case 'users': return <Users size={16} />;
      case 'crosshair': return <Crosshair size={16} />;
      case 'alert': return <AlertTriangle size={16} />;
    }
  };

  const isPositive = changeValue >= 0;
  const isCritical = value <= 20;
  const isWarning = value <= 40 && value > 20;

  // 根据状态调整颜色
  let barColor = color;
  if (isCritical) {
    barColor = 'bg-red-600';
  } else if (isWarning) {
    barColor = 'bg-orange-500';
  }

  return (
    <div className="relative flex flex-col gap-1 w-full font-tech">
      {/* 标签和数值 */}
      <div className="flex justify-between items-center">
        <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-stone-400">
          {getIcon()} {label}
        </span>
        <div className="flex items-center gap-2">
          {/* 当前数值 - 带动画 */}
          <motion.span
            key={value}
            initial={{ scale: 1.5, color: isPositive ? '#22c55e' : '#ef4444' }}
            animate={{ scale: 1, color: isCritical ? '#ef4444' : isWarning ? '#f97316' : '#a8a29e' }}
            transition={{ duration: 0.5, type: 'spring' }}
            className={`text-sm font-mono font-bold ${
              isCritical ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-stone-300'
            }`}
          >
            {value}%
          </motion.span>

          {/* 变化指示器 */}
          <AnimatePresence>
            {showChange && (
              <motion.span
                initial={{ opacity: 0, x: -10, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 10, scale: 0.8 }}
                className={`text-xs font-bold ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPositive ? `↑ +${changeValue}` : `↓ ${changeValue}`}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 进度条 */}
      <div className="relative w-full h-2 bg-stone-800 border border-stone-700 overflow-hidden">
        {/* 进度条填充 - 带动画 */}
        <motion.div
          className={`h-full transition-colors duration-300 ${barColor}`}
          initial={{ width: `${previousValue}%` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* 扫描线效果 */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)] animate-[pulse_2s_infinite]"></div>

        {/* 闪烁效果（数值危险时）*/}
        {isCritical && (
          <motion.div
            className="absolute inset-0 bg-red-500 pointer-events-none"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* 浮动数字 */}
      <div className="absolute top-0 right-0 pointer-events-none">
        <AnimatePresence>
          {floatingNumbers.map(num => (
            <motion.div
              key={num.id}
              initial={{
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1.5
              }}
              animate={{
                opacity: 0,
                y: -50,
                x: num.x,
                scale: 1.2
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: 'easeOut' }}
              className={`text-lg font-bold ${
                num.value >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
              style={{ textShadow: '0 0 10px currentColor' }}
            >
              {num.value >= 0 ? `+${num.value}` : num.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 危险警告 */}
      <AnimatePresence>
        {isCritical && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[10px] text-red-400 font-bold tracking-wider"
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ⚠️ CRITICAL
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};