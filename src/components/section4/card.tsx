import "./card.css";
export default function Card({ url, title, description, index }: { url: string, title: string, description: string, index: number }) {
  return <div>
    <div 
      className="card-box" 
      style={{ 
        backgroundImage: `url('${url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* 黑色遮罩层 */}
      <div className="card-overlay"></div>
      
      <div className="card-index">{'0'+index}</div>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  </div>;
}