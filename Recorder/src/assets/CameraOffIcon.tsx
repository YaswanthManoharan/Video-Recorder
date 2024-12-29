import React from 'react';

const CameraOffIcon: React.FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M9.75 9.75L15 15m4-4v6a2 2 0 01-2 2H6a2 2 0 01-2-2V9m0 0a2 2 0 012-2h.1m6.4 0H17m3-3l-.879-.879a1.5 1.5 0 00-2.122 0L15.121 6H9m0 0L5.121 9.879a1.5 1.5 0 000 2.122L9 15"
      />
    </svg>
  );
};

export default CameraOffIcon;
