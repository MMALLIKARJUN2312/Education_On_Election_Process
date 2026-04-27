import React from 'react';
import { ElectionTimeline } from './components/ElectionTimeline';
import { QnAAssistant } from './components/QnAAssistant';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header>
        <h1>CivicEd</h1>
        <p className="subtitle">Your neutral, factual guide to understanding the election process.</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <section aria-labelledby="timeline-heading">
          <h2 id="timeline-heading" className="sr-only" style={{ display: 'none' }}>Election Timeline</h2>
          <ElectionTimeline />
        </section>

        <section aria-labelledby="qna-heading">
          <h2 id="qna-heading" className="sr-only" style={{ display: 'none' }}>Interactive Q&A</h2>
          <QnAAssistant />
        </section>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
        <p>© {new Date().getFullYear()} CivicEd. Providing neutral, fact-based civic education.</p>
      </footer>
    </div>
  );
};

export default App;
