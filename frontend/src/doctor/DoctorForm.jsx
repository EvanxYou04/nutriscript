import { useState } from "react";
import './DoctorForm.css';

export default function DoctorForm({ onSubmit }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/diet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: input }),
        });
        const data = await response.json();
        onSubmit(data);
    };

    return (
        <div>
            <h1>🩺 Doctor's Dietary Recommendation Form</h1>
            <div className="info-section">
                <p>
                    Please enter the patient's key dietary needs and health concerns to help our AI generate a personalized nutrition and lifestyle plan.
                    Use this section to summarize the patient's unique situation and any important notes for the AI to consider.
                </p>
                <hr />

            </div>
            <form onSubmit={handleSubmit} className="doctor-form">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter dietary recommendation..." rows={4} />
                <div className="button-group">
                    <button>Upload Photo</button>
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                    >{loading ? 'Processing...' : 'Generate Dietary Plan'}
                    </button>
                </div>
            </form >
        </div >

    )
}