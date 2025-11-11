import "./card.css";
import Image from "next/image";

export default function Card({ avatar, name, description }: { avatar: string, name: string, description: string }) {
  return (
    <div className="card-box-1">
      <div className="card-content-1">
        <div className="card-description-1">
          <p>{description}</p>
        </div>
        <div className="card-avatar-1">
          <Image src={avatar} alt={name} width={48} height={48} />
          <h3>{name}</h3>
        </div>
      </div>
    </div>
  );
}