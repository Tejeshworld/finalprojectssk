"use client";

import { useMemo } from "react";

interface ActivityGraphProps {
  doubts?: { createdAt: string }[];
  answers?: { createdAt: string }[];
}

export default function ActivityGraph({ doubts = [], answers = [] }: ActivityGraphProps) {
  const { days, activityMap } = useMemo(() => {
    // Combine all relevant timestamps
    const contributions = [
      ...doubts.map(d => d.createdAt),
      ...answers.map(a => a.createdAt)
    ];

    // Build daily activity map
    const map: Record<string, number> = {};
    contributions.forEach(date => {
      if (!date) return;
      try {
        const day = new Date(date).toISOString().split("T")[0];
        if (!map[day]) {
          map[day] = 0;
        }
        map[day]++;
      } catch (e) {
        // ignore invalid dates
      }
    });

    // Generate last 120 days array
    const last120Days = Array.from({ length: 120 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (119 - i));
      return date.toISOString().split("T")[0];
    });

    return { days: last120Days, activityMap: map };
  }, [doubts, answers]);

  // Group into columns of 7 for vertical week mapping
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Contribution Activity (4 Months)
      </h4>

      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {weeks.map((week, wIndex) => (
          <div key={`w-${wIndex}`} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {week.map((date) => {
              const count = activityMap[date] || 0;

              // Apply requested heatmap color levels
              const level =
                count > 4 ? 4 :
                  count > 2 ? 3 :
                    count > 1 ? 2 :
                      count > 0 ? 1 : 0;

              let colorClass = "bg-white/5";
              if (level === 4) colorClass = "bg-purple-600";
              else if (level === 3) colorClass = "bg-purple-500/70";
              else if (level === 2) colorClass = "bg-purple-400/50";
              else if (level === 1) colorClass = "bg-purple-300/30";

              return (
                <div
                  key={date}
                  title={`${count} contributions on ${date}`}
                  className={`w-3 h-3 rounded-sm ${colorClass} transition-colors cursor-pointer hover:ring-1 hover:ring-white/50`}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span>Less</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div className="w-3 h-3 rounded-sm bg-white/5" />
          <div className="w-3 h-3 rounded-sm bg-purple-300/30" />
          <div className="w-3 h-3 rounded-sm bg-purple-400/50" />
          <div className="w-3 h-3 rounded-sm bg-purple-500/70" />
          <div className="w-3 h-3 rounded-sm bg-purple-600" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
