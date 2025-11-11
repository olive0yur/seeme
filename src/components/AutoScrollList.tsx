'use client';

import { useRef, useEffect, useState, useCallback, ReactNode } from "react";
import "./AutoScrollList.css";

interface AutoScrollListProps {
  children: ReactNode;
  speed?: number; // 滚动速度（毫秒）
  step?: number; // 每次移动的像素
  gap?: number; // item 之间的间距
  className?: string;
  onProgressChange?: (progress: number) => void; // 滚动进度回调 (0-100)
}

export default function AutoScrollList({ 
  children, 
  speed = 30, 
  step = 1, 
  gap = 34,
  className = "",
  onProgressChange
}: AutoScrollListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);

  // 测量内容宽度
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    
    const updateWidth = () => {
      const width = content.offsetWidth + gap;
      setContentWidth(width);
    };
    
    // 延迟测量，确保DOM已经渲染
    const timer = setTimeout(updateWidth, 100);
    
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [gap, children]);

  // 计算并更新进度
  const updateProgress = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !onProgressChange || !contentWidth) return;
    
    const { scrollLeft, clientWidth } = scrollContainer;
    const maxScroll = contentWidth - clientWidth;
    
    // 将滚动位置归一化到一个循环内
    const normalizedScroll = scrollLeft % contentWidth;
    const progress = Math.min((normalizedScroll / maxScroll) * 100, 100);
    onProgressChange(Math.max(0, progress));
  }, [onProgressChange, contentWidth]);

  // 自动滚动
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !contentWidth) return;

    const autoScroll = () => {
      if (!scrollContainer || isUserInteracting) return;
      
      const currentScroll = scrollContainer.scrollLeft;
      
      // 平滑滚动
      scrollContainer.scrollLeft = currentScroll + step;
      
      // 当滚动超过一个内容宽度时，无缝重置
      // 使用精确的内容宽度来确保视觉上完全一致
      if (scrollContainer.scrollLeft >= contentWidth) {
        // 使用 scrollTo 并禁用平滑滚动行为
        scrollContainer.style.scrollBehavior = 'auto';
        scrollContainer.scrollLeft = scrollContainer.scrollLeft - contentWidth;
        // 强制浏览器重绘，确保重置立即生效
        void scrollContainer.offsetHeight;
        scrollContainer.style.scrollBehavior = '';
      }
      
      updateProgress();
    };

    const intervalId = setInterval(autoScroll, speed);

    return () => clearInterval(intervalId);
  }, [isUserInteracting, speed, step, updateProgress, contentWidth]);

  // 鼠标拖动功能
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsUserInteracting(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
    updateProgress();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsUserInteracting(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setIsUserInteracting(false);
      if (scrollRef.current) {
        scrollRef.current.style.cursor = 'grab';
      }
    }
  };

  return (
    <div 
      ref={scrollRef} 
      className={`flex overflow-x-auto cursor-grab auto-scroll-list ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={contentRef} className="flex" style={{ gap: `${gap}px` }}>
        {children}
      </div>
      {/* 复制一遍子元素以实现无缝循环 */}
      <div className="flex" style={{ gap: `${gap}px`, marginLeft: `${gap}px` }}>
        {children}
      </div>
    </div>
  );
}

