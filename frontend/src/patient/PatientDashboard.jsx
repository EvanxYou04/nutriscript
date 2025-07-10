import { useState, useEffect } from 'react';
import './PatientDashboard.css';

export default function PatientDashboard({ dietData }) {
    if (!dietData) {
        return (
            <div className="dashboard">
                <div className="welcome-section">
                    <h1>Your Personalized Nutrition Plan</h1>
                    <p>These recommendations were prepared for you by your healthcare provider.</p>
                    <p className="no-data">No dietary plan loaded yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="welcome-section">
                <h1>Your Personalized Nutrition Plan</h1>
                <p>These recommendations were prepared for you by your healthcare provider.</p>
            </div>

            {/* Diet Overview */}
            <div className="diet-overview-card">
                <h2>Your Diet Plan</h2>
                <p className="diet-description">{dietData.diet_type}</p>
                <div className="tags">
                    {dietData.tags?.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Preferred Foods */}
            <div className="foods-section">
                <h3>✅ Recommended Foods</h3>
                <div className="foods-grid">
                    {dietData.preferred_foods?.map((food, index) => (
                        <div key={index} className="food-card preferred">
                            <span className="food-emoji">🥗</span>
                            <span className="food-name">{food}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Foods to Avoid */}
            <div className="foods-section">
                <h3>🚫 Foods to Avoid</h3>
                <div className="foods-grid">
                    {dietData.excluded_foods?.map((food, index) => (
                        <div key={index} className="food-card avoided">
                            <span className="food-emoji">⚠️</span>
                            <span className="food-name">{food}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Source indicator */}
            <div className="source-info">
                <small>Generated using {dietData.source || 'AI'} analysis</small>
            </div>
        </div>
    );
}