import './StreakDisplay.css';

export default function StreakDisplay({ streak }) {
  return (
    <div className="streak-card">
      <div className="streak-icon">🔥</div>
      <div className="streak-content">
        <h3 className="streak-title">Current Streak</h3>
        <div className="streak-value">{streak}</div>
        <p className="streak-subtitle">days in a row</p>
      </div>
    </div>
  );
}

