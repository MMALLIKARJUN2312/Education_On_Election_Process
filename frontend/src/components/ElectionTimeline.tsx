import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://election-education-backend-jjgscd3gxa-uc.a.run.app/api/v1/election';

interface Event {
  title: string;
  description: string;
}

export const ElectionTimeline: React.FC = () => {
  const [timeline, setTimeline] = useState<Event[]>([]);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/timeline`);
        // Map description to desc if backend uses different naming
        setTimeline(response.data.map((item: { title: string; description?: string; desc?: string }) => ({
            title: item.title,
            description: item.description || item.desc
        })));
      } catch (error) {
        console.error("Failed to fetch timeline:", error);
      }
    };
    fetchTimeline();
  }, []);

  if (timeline.length === 0) return null;

  return (
    <div className="glass-card" role="region" aria-labelledby="timeline-title">
      <h2 id="timeline-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>General Election Process</h2>
      <ol className="timeline" aria-label="Step-by-step election process">
        {timeline.map((step, index) => (
          <li key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <article className="content">
              <h3>{index + 1}. {step.title}</h3>
              <p>{step.description}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
};

