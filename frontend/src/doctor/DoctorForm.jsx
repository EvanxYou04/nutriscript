import { useState } from "react";

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
        <form onSubmit={handleSubmit} className="doctor-form">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter dietary recommendation..." rows={4} />
            <button
                type="submit"
                disabled={loading || !input.trim()}
            //onClick={setLoading(loading)}>
            >{loading ? 'Processing...' : 'Generate Dietary Plan'}
            </button>
        </form >
    )
}