import "./section7.css";
import BlurText from "../ui/BlurText";
import Image from "next/image";

export default function Section7() {
  return (
    <div className="screen7 h-screen bg-[url('https://static.onew.design/see-cover-7.png')] bg-cover bg-center">
      {/* 第一部分 */}
      <div>
        <BlurText
          text="Let SeeMe "
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-7"
        />
        <BlurText
          text="be your work partner"
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-7"
        />
      </div>

      {/* 第二部分 */}
      <div className="flex flex-col">
        <div className="flex justify-end">
          <div className="w-[50%] description-7">
            <p> Your dedicated AI partner for effortless retouching and perfect color, letting you focus on the art.</p>
            {/* 按钮 */}
            <div className="h-[48px] w-[164px] bg-[#0ABAB5] rounded-[32px] pl-[16px] pr-[4px] flex items-center justify-between mt-[24px] animation-bar">
              <span className="text-[16px] leading-[16px]">Try for Free</span>
              <div className="h-[40px] w-[40px] rounded-full bg-white flex items-center justify-center animation-circle overflow-hidden relative">
                <Image className="arrow absolute" src="/section1/arrow-right.svg" alt="user" width={18} height={18} />
                <Image className="arrow-bottom absolute" src="/section1/arrow-right.svg" alt="user" width={18} height={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}