'use client';

import Image from "next/image";
import BlurText from "../ui/BlurText";
import "./section1.css";

export default function Section1() {
  return <div className="lg:h-screen screen h-screen bg-[url('/section1/origin.png')] bg-cover bg-center flex flex-col justify-between relative">
    {/* 第一节 */}
    <div className="flex justify-between items-center">
      <Image src="/section1/seeme.svg" alt="logo" width={157} height={29.897} />
      <div className="w-[124px] h-[48px] rounded-[32px] bg-[#0ABAB5] flex items-center justify-between pl-[16px] pr-[4px] animation-bar">
        <span>Log in</span>
        <div className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center animation-circle overflow-hidden relative">
          <Image className="arrow absolute" src="/section1/arrow-right.svg" alt="user" width={18} height={18} />
          <Image className="arrow-bottom absolute" src="/section1/arrow-right.svg" alt="user" width={18} height={18} />
        </div>
      </div>
    </div>

    {/* 第二节 */}
    <div className="absolute top-[230px] left-[100px]">
      <div>
        <BlurText
          text="TO SEE"
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text"
        />
      </div>
      <div> 
        <BlurText
          text="AND TO BE SEEN"
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text"
        /> 
      </div>
    </div>

    {/* 第三节 */}
    <div className="label-content">
      {/* 左边 */}
      <div className="flex flex-col justify-end gap-[40px] text-[#F1F1F1] label-content-top">
        {/* 上部分 */}
        <div className="flex items-center">
          <Image src="/section1/Voice.svg" alt="section3-1" width={48} height={48} className="mr-[12px]" />
          <div className="flex flex-col gap-[12px] whitespace-nowrap">
            <span className="label-top">Conversational Retouching</span>
            <span className="label-bottom">Fine-tune skin, body, and lighting with natural language commands.</span>
          </div>
        </div>
        {/* 下部分 */}
        <div className="flex items-center">
          <Image src="/section1/Magic.svg" alt="section3-1" width={48} height={48} className="mr-[12px]" />
          <div className="flex flex-col gap-[12px] whitespace-nowrap">
            <span className="label-top">Conversational Retouching</span>
            <span className="label-bottom">Fine-tune skin, body, and lighting with natural language commands.</span>
          </div>
        </div>
      </div>

      {/* 右边 */}
      <div className="flex flex-col text-[#F1F1F1] label-content-bottom">
        {/* 上部分 */}
        <div className="whitespace-nowrap">
          <p className="slogan">AI-powered conversational retouching &</p>
          <p className="slogan">smart color for photographers. Boost </p>
          <p className="slogan">your efficiency.</p>
        </div>

        {/* 下部分 */}
        <div className="h-[48px] w-[164px] bg-[#0ABAB5] rounded-[32px] pl-[16px] pr-[4px] flex items-center justify-between mt-[24px] animation-bar">
          <span>Try for Free</span>
          <div className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center animation-circle overflow-hidden relative">
            <Image className="arrow absolute" src="/section1/arrow-right.svg" alt="user" width={18} height={18} />
            <Image className="arrow-bottom absolute" src="/section1/arrow-right.svg" alt="user" width={18} height={18} />
          </div>
        </div>
      </div>
    </div>
  </div>;
} 