import "./section6.css";
import BlurText from "../ui/BlurText";
import AutoScrollList from "../AutoScrollList";
import Card from "./card";
import Image from "next/image";

const cardList = [
  {
    id: 1,
    avatar: "/section6/avatar.svg",
    name: "Alex",
    description: "As a fashion photographer, I'm always looking for tools that enhance my workflow without compromising quality. SeeMe has completely transformed my post-production!",
  },
  {
    id: 2,
    avatar: "/section6/avatar.svg",
    name: "Emily",
    description: "As a fashion photographer, I'm always looking for tools that enhance my workflow without compromising quality. SeeMe has completely transformed my post-production!",
  },
  {
    id: 3,
    avatar: "/section6/avatar.svg",
    name: "John",
    description: "As a fashion photographer, I'm always looking for tools that enhance my workflow without compromising quality. SeeMe has completely transformed my post-production!",
  },
  {
    id: 4,
    avatar: "/section6/avatar.svg",
    name: "Jane",
    description: "As a fashion photographer, I'm always looking for tools that enhance my workflow without compromising quality. SeeMe has completely transformed my post-production!",
  },
  {
    id: 5,
    avatar: "/section6/avatar.svg",
    name: "Jim",
    description: "As a fashion photographer, I'm always looking for tools that enhance my workflow without compromising quality. SeeMe has completely transformed my post-production!",
  },
];

export default function Section6() {
  return <div className="screen6 bg-[#F1F1F1] relative">
    {/* 第一节 */}
    <div>
      <BlurText
        text="Loved By Users"
        delay={150}
        animateBy="words"
        direction="top"
        className="blur-text-6"
      />
    </div>

    {/* 第二节 */}
    <div className="description-6-content mt-[80px]">
      <div className="description-6">
        <div className="flex flex-col">
          <p>
            As a celebrity photographer, I spend hours perfecting skin tone and lighting. With this tool, I can describe exactly what I want—and it gets it right every time. It feels like working with an assistant who truly understands my style.
          </p>
          <div className="avatar-6">
            <Image src="/section6/avatar.svg" alt="avatar" width={48} height={48} />
            <h3>Amir Khan</h3>
          </div>
        </div>
      </div>
    </div>

    {/* 第三节 */}
    <div className="card-list-container mt-[80px]">
      <AutoScrollList
        speed={30}
        step={1}
        gap={34}
      >
        {cardList.map((card) => (
          <Card key={card.id} avatar={card.avatar} name={card.name} description={card.description} />
        ))}
      </AutoScrollList>
    </div>

  </div>;
}