import './StatsCard.css';

export default function StatsCard({ title, value, subtitle, color = '#ffffff' }) {
  return (
    <div className="stats-card" style={{ borderTopColor: color }}>
      <div className="stats-card-content">
        <h3 className="stats-card-title">{title}</h3>
        <div className="stats-card-value" style={{ color }}>
          {value}
        </div>
        <p className="stats-card-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

