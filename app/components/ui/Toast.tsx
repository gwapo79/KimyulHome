'use client';

import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
}

export default function Toast({ message, type = 'info', isVisible, onClose }: ToastProps) {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        setShow(isVisible);
        if (isVisible) {
            const timer = setTimeout(() => {
                setShow(false);
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!show) return null;

    const bgColor =
        type === 'success' ? 'bg-green-600' :
            type === 'error' ? 'bg-red-600' : 'bg-gray-800';

    return (
        <div className={`fixed bottom-5 right-5 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center transition-opacity duration-300`}>
            <span>{message}</span>
            <button onClick={() => { setShow(false); onClose(); }} className="ml-4 text-white hover:text-gray-200">
                <i className="fas fa-times"></i>
            </button>
        </div>
    );
}
