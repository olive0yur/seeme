'use client';

import { useState } from "react";
import BlurText from "../ui/BlurText";
import Card from "./card";
import AutoScrollList from "../AutoScrollList";
import "./section4.css";

const cardList = [
  {
    id: 1,
    title: "Celebrity Portraits",
    url: "/section4/p1.jpg",
    description: "For celebrity photographers and retouch studios enhancing publicity portraits with natural, high-fidelity skin detail.",
  },
  {
    id: 2,
    title: "Magazine Covers & Editorials",
    url: "/section4/p2.jpg",
    description: "For editorial teams producing fashion stories and cover features — ensuring tonal harmony and authentic texture across spreads.",
  },
  {
    id: 3,
    title: "Fashion & Luxury Campaigns",
    url: "/section4/p3.jpg",
    description: "For fashion photographers and creative agencies creating lookbooks or luxury brand visuals with consistent lighting and style.",
  },
  {
    id: 4,
    title: "Red Carpet & Event Photography",  
    url: "/section4/p4.jpg",
    description: "For photographers capturing live celebrity moments under complex lighting, achieving clarity, balance, and visual realism.",
  },
];

export default function Section4({ showProgress = true }: { showProgress?: boolean }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  return <div>
    <div className="screen4 h-screen bg-[#F1F1F1]">
      {/* 第一部分 */}
      <div className="whitespace-nowrap mb-[40px]">
        <BlurText
          text="Application Scenarios"
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-4"
        />
      </div>

      {/* 第二部分 滚动列表 */}
      <AutoScrollList 
        speed={30} 
        step={1} 
        gap={34}
        onProgressChange={setScrollProgress}
      >
        {cardList.map((card) => (
          <Card key={card.id} url={card.url} title={card.title} description={card.description} index={card.id}/>
        ))}
      </AutoScrollList>

      {/* 进度条 */}
      {showProgress && (
        <div className="progress-bar-container">
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  </div>;
}