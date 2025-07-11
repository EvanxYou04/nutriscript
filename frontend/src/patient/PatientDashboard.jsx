import { useState, useEffect } from 'react';
import './PatientDashboard.css';

export default function PatientDashboard({ dietData }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state for a smooth transition
        if (dietData) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [dietData]);

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

    if (isLoading) {
        return (
            <div className="dashboard">
                <div className="welcome-section">
                    <h1>Your Personalized Nutrition Plan</h1>
                    <p>Loading your personalized recommendations...</p>
                </div>
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Finalizing your nutrition plan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="welcome-section">
                <h1>Your Personalized Nutrition Plan</h1>
                <p>These recommendations were prepared for you by your healthcare provider</p>
            </div>

            {/* Diet Overview */}
            <div className="diet-overview-card">
                <h2>— Diet Overview —</h2>
                <p className="diet-description">{dietData.summary}</p>
                <div className="tags">
                    {dietData.tags?.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                    ))}
                </div>
            </div>

            {/* Foods Section */}
            <div className="foods-section">
                <div className="foods-grid">
                    {/* Recommended Foods */}
                    <div className="food-section-card">
                        <h3>Recommended Foods</h3>
                        <div className="food-list">
                            {dietData.preferred_foods?.map((food, index) => (
                                <div key={index} className="food-card preferred">
                                    <span className="food-emoji">🥗</span>
                                    <span className="food-name">{food}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Foods to Avoid */}
                    <div className="food-section-card">
                        <h3>Foods to Avoid</h3>
                        <div className="food-list">
                            {dietData.excluded_foods?.map((food, index) => (
                                <div key={index} className="food-card avoided">
                                    <span className="food-emoji">⚠️</span>
                                    <span className="food-name">{food}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipe Recommendations */}
            {dietData.recipes && dietData.recipes.length > 0 && (
                <div className="foods-section">
                    <h3>— Recommended Meals —</h3>
                    <div className="recipes-grid">
                        {dietData.recipes.map((recipe, index) => (
                            <div key={index} className="recipe-card">
                                <div className="recipe-header">
                                    <h4 className="recipe-title">{recipe.title}</h4>
                                    <span className="recipe-time">⏱️ {recipe.readyInMinutes} min</span>
                                </div>
                                {recipe.image && (
                                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                                )}
                                <p className="recipe-summary">{recipe.summary}</p>
                                {recipe.url && (
                                    <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="recipe-link">
                                        View Recipe →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Source indicator */}
            <div className="source-info">
                <small>Generated using {dietData.source || 'AI'} analysis</small>
            </div>
        </div>
    );
}