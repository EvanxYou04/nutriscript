import { useState } from 'react';
import DoctorForm from './doctor/DoctorForm';
import PatientDashboard from './patient/PatientDashboard';
import './App.css';

function App() {
  const [dietData, setDietData] = useState(null);
  const [currentView, setCurrentView] = useState('doctor');

  const handleDietSubmit = (data) => {
    setDietData(data);
    setCurrentView('patient');
  };

  return (
    <div className="app">
      <nav className="nav-bar">
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
      </nav>

      {currentView === 'doctor' && (
        <div className="doctor-section">
          <DoctorForm onSubmit={handleDietSubmit} />
        </div>
      )}

      {currentView === 'patient' && (
        <PatientDashboard dietData={dietData} />
      )}
    </div>
  );
}

export default App;
