import React from 'react';
import { StadiumProvider } from './context/StadiumContext';
import { Dashboard } from './components/Dashboard';
import './index.css';

function App() {
  return (
    <StadiumProvider>
      <div className="min-h-screen bg-background text-text-primary">
        <Dashboard />
      </div>
    </StadiumProvider>
  );
}

export default App;