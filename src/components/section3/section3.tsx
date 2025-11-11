'use client';

import BlurText from "../ui/BlurText";
import "./section3.css";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册ScrollTrigger插件
gsap.registerPlugin(ScrollTrigger);

export default function Section3() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const markRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scaleItems = [
    { text: "Semantic-driven", description: "No need for selection, sliders, or filters; AI understands semantics and executes directly." },
    { text: "Intelligent", description: "Advanced AI capabilities for smart automation" },
    { text: "Efficient", description: "Streamlined workflows and optimized performance" },
    { text: "Scalable", description: "Grows with your business needs" },
    { text: "Reliable", description: "Consistent and dependable results" }
  ];

  useEffect(() => {
    if (!circleRef.current || !sectionRef.current) return;

    // 初始化所有文本和刻度线为隐藏状态，除了第一个
    textRefs.current.forEach((textEl, index) => {
      if (textEl) {
        gsap.set(textEl, { opacity: index === 0 ? 1 : 0 });
      }
    });
    descriptionRefs.current.forEach((descEl, index) => {
      if (descEl) {
        gsap.set(descEl, { opacity: index === 0 ? 1 : 0 });
      }
    });
    markRefs.current.forEach((markEl, index) => {
      if (markEl) {
        gsap.set(markEl, { opacity: index === 0 ? 1 : 0 });
      }
    });
    // 初始化圆点颜色，第一个为激活色，其他为默认色
    dotRefs.current.forEach((dotEl, index) => {
      if (dotEl) {
        gsap.set(dotEl, { backgroundColor: index === 0 ? "#0ABAB5" : "#909090" });
      }
    });

    let currentActiveStep = 0; // 跟踪当前激活的步骤

    // 创建ScrollTrigger动画 - 分段式旋转
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=1500vh", // 5个段落，每个段落300vh
        scrub: 4, // 增加scrub值，让滚动更平滑缓慢
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // 计算当前应该在哪个段落（0-4）
          const totalSteps = 5; // 总共5个步骤
          const currentStep = Math.floor(self.progress * totalSteps);
          const clampedStep = Math.min(currentStep, totalSteps - 1);
          
          // 每个步骤旋转72度，负数表示逆时针
          const targetRotation = -clampedStep * 72;
          
          // 使用gsap.to创建平滑的跳转动画
          gsap.to(circleRef.current, {
            rotation: targetRotation,
            duration: 1,
            ease: "power2.out"
          });

          // 如果步骤发生变化，更新文本和刻度线显示
          if (clampedStep !== currentActiveStep) {
            // 隐藏当前激活的元素
            if (markRefs.current[currentActiveStep]) {
              gsap.to(markRefs.current[currentActiveStep], {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
              });
            }
            if (textRefs.current[currentActiveStep]) {
              gsap.to(textRefs.current[currentActiveStep], {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
              });
            }
            if (descriptionRefs.current[currentActiveStep]) {
              gsap.to(descriptionRefs.current[currentActiveStep], {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
              });
            }
            // 将当前圆点变为默认色
            if (dotRefs.current[currentActiveStep]) {
              gsap.to(dotRefs.current[currentActiveStep], {
                backgroundColor: "#909090",
                duration: 0.8,
                ease: "power2.out"
              });
            }

            // 显示新的激活元素
            if (markRefs.current[clampedStep]) {
              gsap.to(markRefs.current[clampedStep], {
                opacity: 1,
                duration: 0.8,
                delay: 0.1, // 刻度线最先显示
                ease: "power2.out"
              });
            }
            if (textRefs.current[clampedStep]) {
              gsap.to(textRefs.current[clampedStep], {
                opacity: 1,
                duration: 0.8,
                delay: 0.2, // 稍微延迟显示，让隐藏动画先完成
                ease: "power2.out"
              });
            }
            if (descriptionRefs.current[clampedStep]) {
              gsap.to(descriptionRefs.current[clampedStep], {
                opacity: 1,
                duration: 0.8,
                delay: 0.4, // 描述文字稍后显示
                ease: "power2.out"
              });
            }
            // 将新圆点变为激活色
            if (dotRefs.current[clampedStep]) {
              gsap.to(dotRefs.current[clampedStep], {
                backgroundColor: "#0ABAB5",
                duration: 1.5,
                delay: 0.1, // 和刻度线同时变色
                ease: "power2.out"
              });
            }

            currentActiveStep = clampedStep;
          }
          
          // 更新进度条（可选，如果你有进度条的话）
          if (progressRef.current) {
            gsap.set(progressRef.current, { 
              scaleX: (clampedStep + 1) / totalSteps,
              transformOrigin: "left center"
            });
          }
        }
      }
    });

    return () => {
      // 清理ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <div ref={sectionRef}>
    <div className="screen3 h-screen bg-black relative">
      {/* 第一部分 */}
      <div className="whitespace-nowrap">
        <BlurText
          text="Why Choose"
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-3"
        />
        <BlurText
          text="SeeMe?"
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-3"
        />
      </div>

      {/* 第二部分 */}
      <div className="circle-container" ref={circleRef}>
        {scaleItems.map((item, index) => {
          const angle = index * 72; // 正数表示顺时针旋转，从上方开始：1在上，2在右上，3在右下，4在左下，5在左上
          const angleRad = (angle - 90) * (Math.PI / 180); // 转换为弧度，-90使0度从顶部开始
          const dotRadius = 45; // 圆点的半径位置
          
          // 计算圆点位置（在圆圈边缘）
          const dotX = dotRadius * Math.cos(angleRad);
          const dotY = dotRadius * Math.sin(angleRad);
          
          // 计算向圆心方向移动100px的偏移量
          const moveDistance = 200; // 向圆心移动的距离
          const moveX = -moveDistance * Math.cos(angleRad); // 向圆心方向的X偏移
          const moveY = -moveDistance * Math.sin(angleRad); // 向圆心方向的Y偏移
          

          const moveDistance1 = 280;
          const moveX1 = -moveDistance1 * Math.cos(angleRad);
          const moveY1 = -moveDistance1 * Math.sin(angleRad);

          const moveDistance2 = -50; // 向圆心移动的距离
          const moveX2 = -moveDistance2 * Math.cos(angleRad); // 向圆心方向的X偏移
          const moveY2 = -moveDistance2 * Math.sin(angleRad); // 向圆心方向的Y偏移
          
          return (
            <div key={index}>
              {/* 大圆圈上的实心圆点 */}
              <div
                ref={(el) => { dotRefs.current[index] = el; }}
                className="scale-dot"
                style={{
                  left: `calc(50% + ${dotX}vw)`,
                  top: `calc(50% + ${dotY}vw)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* 指向圆心的线条 */}
                <div 
                  ref={(el) => { markRefs.current[index] = el; }}
                  className="scale-mark"
                  style={{
                    transform: `rotate(${angle}deg)`
                  }}
                ></div>
                
                {/* 数字圆（固定在圆点外侧） */}
                <div 
                  className="scale-number"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${index * 72}deg)`,
                    left: `${moveX2+3}px`,
                    top: `${moveY2+3}px`
                  }}
                >
                  {index + 1}
                </div>

                <div 
                  ref={(el) => { textRefs.current[index] = el; }}
                  className="scale-text" 
                  style={{
                    transform: `translate(-50%, -50%) rotate(${index * 72}deg)`,
                    left: `${moveX}px`,
                    top: `${moveY}px`
                  }}
                >
                  {item.text}
                </div>
                <div 
                  ref={(el) => { descriptionRefs.current[index] = el; }}
                  className="scale-description" 
                  style={{
                    transform: `translate(-50%, -50%) rotate(${index * 72}deg)`,
                    left: `${moveX1}px`,
                    top: `${moveY1}px`
                  }}
                >
                  {item.description}
                </div>
              </div>
              
            </div>
          );
        })}
      </div>

    </div>
  </div>;
}