import React, { Suspense, lazy } from 'react';

// Efficiency: Lazy load components to reduce initial bundle size and improve TTI
const ElectionTimeline = lazy(() => import('./components/ElectionTimeline').then(m => ({ default: m.ElectionTimeline })));
const QnAAssistant = lazy(() => import('./components/QnAAssistant').then(m => ({ default: m.QnAAssistant })));

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header>
        <h1>CivicEd</h1>
        <p className="subtitle">Your neutral, factual guide to understanding the election process.</p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <Suspense fallback={<div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>Loading timeline...</div>}>
          <section aria-labelledby="timeline-heading">
            <h2 id="timeline-heading" className="sr-only">Election Timeline</h2>
            <ElectionTimeline />
          </section>
        </Suspense>

        <Suspense fallback={<div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>Loading assistant...</div>}>
          <section aria-labelledby="qna-heading">
            <h2 id="qna-heading" className="sr-only">Interactive Q&A</h2>
            <QnAAssistant />
          </section>
        </Suspense>
      </main>

      <footer style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-muted)' }}>
        <p>© {new Date().getFullYear()} CivicEd. Providing neutral, fact-based civic education.</p>
      </footer>
    </div>
  );
};

export default App;
