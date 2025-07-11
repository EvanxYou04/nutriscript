import { useState } from 'react';
import DoctorForm from './doctor/DoctorForm';
import PatientDashboard from './patient/PatientDashboard';
import './App.css';

function App() {
  const [dietData, setDietData] = useState(null);
  const [currentView, setCurrentView] = useState('doctor');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDietSubmit = (data) => {
    setIsProcessing(true);
    setDietData(data);

    // Small delay to show processing state
    setTimeout(() => {
      setCurrentView('patient');
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="app">
      <nav className="nav-bar">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-icon"><img src="public/nutrivise-logo.png" alt="nutrivise logo" srcset="" /></span>
            <span className="logo-text">Nutrivise</span>
          </div>
        </div>

        <div className="nav-right">
          <button
            className={currentView === 'doctor' ? 'active' : ''}
            onClick={() => setCurrentView('doctor')}
          >
            Doctor Form
          </button>
          <button
            className={currentView === 'patient' ? 'active' : ''}
            onClick={() => setCurrentView('patient')}
          >
            Patient Dashboard
          </button>
        </div>
      </nav>

      {currentView === 'doctor' && !isProcessing && (
        <div className="doctor-section">
          <DoctorForm onSubmit={handleDietSubmit} />
        </div>
      )}

      {isProcessing && (
        <div className="processing-section">
          <div className="processing-card">
            <div className="processing-spinner"></div>
            <h2>Generating Your Personalized Nutrition Plan</h2>
            <p>Our AI is analyzing the dietary requirements and finding the best recipes for you...</p>
            <div className="processing-steps">
              <div className="step active">Parsing dietary requirements</div>
              <div className="step active">Finding suitable recipes</div>
              <div className="step active">Creating personalized plan</div>
            </div>
          </div>
        </div>
      )}

      {currentView === 'patient' && !isProcessing && (
        <PatientDashboard dietData={dietData} />
      )}
    </div>
  );
}

export default App;
