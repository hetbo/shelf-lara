import React, { useState, useEffect } from 'react';
import Icon from "../../icons/Icon";

export const ApiErrorHandler = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const handleApiError = (event: Event) => {
            const customEvent = event as CustomEvent<{ message: string }>;
            const message = customEvent.detail?.message || 'An unknown error occurred.';

            setIsExiting(false);
            setErrorMessage(message);
        };

        window.addEventListener('api-error', handleApiError);
        return () => window.removeEventListener('api-error', handleApiError);
    }, []);

    useEffect(() => {
        if (!errorMessage) return;

        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [errorMessage]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setErrorMessage(null);
        }, 300); // Animation duration
    };

    const animationStyle = `
        @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeOutRight {
            from { opacity: 1; transform: translateX(0); }
            to { opacity: 0; transform: translateX(20px); }
        }
        .animate-enter { animation: fadeInRight 0.3s ease-out forwards; }
        .animate-exit { animation: fadeOutRight 0.3s ease-in forwards; }
    `;

    if (!errorMessage) {
        return null;
    }

    return (
        <>
            <style>{animationStyle}</style>

            <div className="fixed top-4 right-4 z-50 w-80">
                <div
                    className={`
                        flex items-center bg-red-500 text-white p-3 rounded-lg shadow-lg
                        ${isExiting ? 'animate-exit' : 'animate-enter'}
                    `}
                >
                    <Icon name="alertCircle" className="w-5 h-5 mr-3" />
                    <span className="flex-grow text-sm">{errorMessage}</span>
                    <button
                        onClick={handleClose}
                        className="ml-4 p-1 rounded-full hover:bg-white/20"
                    >
                        <Icon name="close" className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    );
};
