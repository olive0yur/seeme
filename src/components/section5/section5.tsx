import "./section5.css";
import BlurText from "../ui/BlurText";
import CountUp from "../ui/CountUp";

export default function Section5() {
  return <div>
    <div className="screen5 h-screen relative bg-[url('https://static.onew.design/see-cover.png')]">
      {/* 第一部分 */}
      <div> 
        <BlurText
          text="AI-powered conversational retouching &"
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-5"
        />
        <BlurText
          text="smart color for photographers. Boost "
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-5"
        />
        <BlurText
          text="smart color for photographers. Boost "
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-5"
        />
      </div>

      {/* 第二部分 */}
      <div className="stats-container">
        <div className="itemBox">
          <div className="absolute top-[20px] right-[20px] flex gap-[3px] items-center">
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-[#5f6062] rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-[#5f6062] rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-[#5f6062] rounded-full"></div>
          </div>
          <div className="itemBoxTop">
            <CountUp
              from={0}
              to={60}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
            <p className="count-up-text-unit">%</p>
          </div>
          <div className="itemBoxBottom">
            Less Manual Adjustment
          </div>
        </div>
        <div className="divider-line"></div>
        <div className="itemBox">
          <div className="absolute top-[20px] right-[20px] flex gap-[3px] items-center">
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-[#5f6062] rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-[#5f6062] rounded-full"></div>
          </div>
          <div className="itemBoxTop">
            <CountUp
              from={0}
              to={5}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
            <p className="count-up-text-unit">X</p>
          </div>
          <div className="itemBoxBottom">
            Efficiency Boost
          </div>
        </div>
        <div className="divider-line"></div>
        <div className="itemBox">
            <div className="absolute top-[20px] right-[20px] flex gap-[3px] items-center">
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-[#5f6062] rounded-full"></div>
          </div>
          <div className="itemBoxTop">
            <CountUp
              from={0}
              to={98}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
            <p className="count-up-text-unit">%</p>
          </div>
          <div className="itemBoxBottom">
            Color Consistency
          </div>
        </div>
        <div className="divider-line"></div>
         <div className="itemBox">
          <div className="absolute top-[20px] right-[20px] flex gap-[3px] items-center">
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
            <div className="w-[6px] h-[6px] bg-white rounded-full"></div>
          </div>
          <div className="itemBoxTop">
            <CountUp
              from={0}
              to={10}
              separator=","
              direction="up"
              duration={1}
              className="count-up-text"
            />
            <p className="count-up-text-unit">+</p>
          </div>
          <div className="itemBoxBottom">
            Expert Experience
          </div>
        </div>
      </div>
    </div>
  </div>;
}