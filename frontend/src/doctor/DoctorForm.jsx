import { useState } from "react";
import './DoctorForm.css';

export default function DoctorForm({ onSubmit }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/diet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note: input }),
            });
            const data = await response.json();
            onSubmit(data);
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error processing your request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="doctor-info">

            <div className="info-section">
                <h1>🩺 Doctor's Dietary Recommendation Form</h1>
                <p>
                    Please enter the patient's key dietary needs and health concerns to help our AI generate a personalized nutrition and lifestyle plan.
                    Use this section to summarize the patient's unique situation and any important notes for the AI to consider.
                </p>
                <hr />
                {/* <h3>What to include</h3>
                <ul>
                    <li> Medical Conditions</li>
                    <li>Dietary Goals</li>
                    <li>Allergies or restrictions</li>
                    <li>Doctor's notes:</li>
                    <li>Lifestyle factors</li>
                </ul> */}
            </div>
            <form onSubmit={handleSubmit} className="doctor-form">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter dietary recommendation..."
                    rows={4}
                    disabled={loading}
                />
                <div className="button-group">
                    <button type="button" disabled={loading}>
                        {loading ? 'Processing...' : 'Upload Photo'}
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className={loading ? 'loading' : ''}
                    >
                        {loading ? (
                            <span className="loading-content">
                                <span className="spinner"></span>
                                Processing...
                            </span>
                        ) : (
                            'Generate Dietary Plan'
                        )}
                    </button>
                </div>
            </form >
        </div >

    )
}