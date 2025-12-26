'use client';

import DaumPostcode from 'react-daum-postcode';

interface AddressSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}

export default function AddressSearchModal({ isOpen, onClose, onComplete }: AddressSearchModalProps) {
    if (!isOpen) return null;

    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        onComplete({
            ...data,
            fullAddress // Custom field for convenience
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-xl overflow-hidden relative">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-medium text-gray-900">주소 검색</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="p-4 h-[500px]">
                    <DaumPostcode onComplete={handleComplete} style={{ height: '100%' }} />
                </div>
            </div>
        </div>
    );
}
