import React, { useState } from 'react';
import { FaVideo, FaDesktop } from 'react-icons/fa';
import VideoRecorder from './VideoRecorder';
import ScreenRecorder from './screenRecorder';

const RecorderSwitcher: React.FC = () => {
  const [selectedRecorder, setSelectedRecorder] = useState<'video' | 'screen'>('video');

  return (
    <div className="flex flex-col items-center space-y-8 mt-8">
      {/* Icon Selector with Toggle Transition */}
      <div className="relative bg-white shadow-lg rounded-xl p-4 flex justify-around items-center w-full max-w-md">
        {/* Toggle Indicator */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-green-100 rounded-xl transition-transform duration-300 ease-in-out ${
            selectedRecorder === 'video' ? 'translate-x-0' : 'translate-x-full'
          }`}
        ></div>

        {/* Video Icon */}
        <div
          className={`flex flex-col items-center z-10 cursor-pointer ${
            selectedRecorder === 'video' ? 'text-green-500' : 'text-gray-400'
          }`}
          onClick={() => setSelectedRecorder('video')}
        >
          <FaVideo size={48} />
          <span
            className={`mt-2 text-sm ${
              selectedRecorder === 'video' ? 'font-semibold' : 'font-normal'
            }`}
          >
            Video Recording
          </span>
        </div>

        {/* Screen Icon */}
        <div
          className={`flex flex-col items-center z-10 cursor-pointer ${
            selectedRecorder === 'screen' ? 'text-green-500' : 'text-gray-400'
          }`}
          onClick={() => setSelectedRecorder('screen')}
        >
          <FaDesktop size={48} />
          <span
            className={`mt-2 text-sm ${
              selectedRecorder === 'screen' ? 'font-semibold' : 'font-normal'
            }`}
          >
            Screen Recording
          </span>
        </div>
      </div>

      {/* Recorder Display */}
      <div className="w-full max-w-4xl">
        {selectedRecorder === 'video' ? <VideoRecorder /> : <ScreenRecorder />}
      </div>
    </div>
  );
};

export default RecorderSwitcher;
