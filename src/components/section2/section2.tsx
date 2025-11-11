import BlurText from "../ui/BlurText";
import Image from "next/image";
import "./section2.css";

export default function Section2() {
  return <div className="lg:h-auto h-screen screen2">
    {/* 第一部分 */}
    <div className="whitespace-nowrap">
      <BlurText
          text="Retouching is not 'Skin smoothing',"
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-2"
        />
         <BlurText
          text="but 'The art of preserving real texture'."
          delay={150}
          animateBy="words"
          direction="top"
          className="blur-text-2"
        />
    </div>

    {/* 第二部分 */}
    <div className="w-full px-[80px] pt-[80px] mt-[80px] bg-[#e4e4e4]">
      <div className="bg-[url('https://static.onew.design/see-tool-7.png')] bg-contain bg-center bg-no-repeat aspect-[1720/654]">
        {/* <Image src="https://static.onew.design/see-tool.png" alt="section2-1" width={1720} height={1000} className="w-full h-auto" /> */}
      </div>
    </div>

    {/* 第三部分 */}

    <div className="grid-content ">
      <div>
        <div className="icon-box">
          <Image src="/section2/icon1.svg" width={32} height={32} alt="section2-1" />
        </div>
        <div className="icon-label">Semantic Understanding</div>
        <div className="icon-desc">
          <span>The user inputs instructions, and the system </span>
          <span>automatically parses the semantics and generates </span>
          <span>executable photo editing actions.</span>
        </div>
      </div>
      <div>
        <div className="icon-box">
          <Image src="/section2/icon2.svg" width={32} height={32} alt="section2-1" />
        </div>
        <div className="icon-label">Realistic Texture</div>
        <div className="icon-desc">
          <span>The model does not perform filter-style modification </span>
          <span>but recognizes skin texture and structure</span>
        </div>
      </div>
      <div>
         <div className="icon-box">
          <Image src="/section2/icon3.svg" width={32} height={32} alt="section2-1" />
        </div>
        <div className="icon-label">Explainable Operations</div>
        <div className="icon-desc">
          <span>Each AI photo editing session generates a visual step</span>
          <span>list，where users can see each action.</span>
        </div>
      </div>
      <div>
        <div className="icon-box">
          <Image src="/section2/icon4.svg" width={32} height={32} alt="section2-1" />
        </div>
        <div className="icon-label">Efficiency and Consistency</div>
        <div className="icon-desc">
          <span>Semantic instructions can be quickly applied to the same</span>
          <span>set of photos to maintain a consistent style</span>
        </div>
      </div>
    </div>
  </div>;
}