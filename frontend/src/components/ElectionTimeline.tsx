import React from 'react';

const defaultTimeline = [
  { title: "Eligibility Check", desc: "Ensure you meet age and citizenship requirements to vote." },
  { title: "Voter Registration", desc: "Register to vote before the deadline in your area." },
  { title: "Review Candidates/Issues", desc: "Research impartial, factual information about what is on the ballot." },
  { title: "Find Polling Station", desc: "Locate where you need to go to cast your vote, or request a mail-in ballot." },
  { title: "Election Day", desc: "Go to the polling station with necessary ID and cast your ballot." }
];

export const ElectionTimeline: React.FC = () => {
  return (
    <div className="glass-card">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>General Election Process</h2>
      <div className="timeline">
        {defaultTimeline.map((step, index) => (
          <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="content">
              <h3>{index + 1}. {step.title}</h3>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
