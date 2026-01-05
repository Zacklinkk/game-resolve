import React, { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<Props> = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  // 使用 ref 来存储回调函数，这样即使父组件重渲染导致 onComplete 函数地址变化，
  // 也不会触发下方的 useEffect 重新执行，从而避免打字效果重置。
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // 重置显示文本
    setDisplayedText('');
    
    let i = 0;
    
    // 使用本地索引 i 来控制切片，确保在 React 的严格模式下也能正确运行。
    // 移除了之前的 lastTextRef 检查，因为 React 的依赖数组 [text] 已经足够处理更新逻辑。
    const timer = setInterval(() => {
      if (i < text.length) {
        // 使用 slice 截取是最稳健的方法，确保显示的文本严格对应当前进度
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        if (onCompleteRef.current) onCompleteRef.current();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]); // 依赖列表中移除了 onComplete，防止死循环

  return (
    <p className="leading-relaxed text-lg text-stone-300 font-serif whitespace-pre-line drop-shadow-md min-h-[50vh]">
      {displayedText}
      <span className="animate-pulse inline-block w-2 h-4 bg-amber-600 ml-1 align-middle"></span>
    </p>
  );
};