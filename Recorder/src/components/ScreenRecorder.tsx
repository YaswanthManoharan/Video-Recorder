import React, { useState, useRef, useEffect } from 'react';
import { FaDesktop, FaVideo } from 'react-icons/fa';

const ScreenRecorder: React.FC = () => {
  const [isScreenRecording, setIsScreenRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoOverlayRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const screenChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const startScreenRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        screenStreamRef.current = stream;

        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = stream;
        }

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        screenChunksRef.current = [];
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            screenChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(screenChunksRef.current, { type: 'video/webm' });
          setVideoURL(URL.createObjectURL(blob));
        };

        mediaRecorder.start();
      } catch (error) {
        console.error('Error accessing screen:', error);
      }
    };

    if (isScreenRecording) {
      startScreenRecording();
    } else {
      // Stop the screen recording
      mediaRecorderRef.current?.stop();
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }

    return () => {
      mediaRecorderRef.current?.stop();
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [isScreenRecording]);

  useEffect(() => {
    const setupVideoFeed = async () => {
      if (isVideoEnabled) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          videoStreamRef.current = stream;

          if (videoOverlayRef.current) {
            videoOverlayRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      } else {
        // Stop the video feed when disabled
        videoStreamRef.current?.getTracks().forEach((track) => track.stop());
        videoStreamRef.current = null;
      }
    };

    if (isVideoEnabled) {
      setupVideoFeed();
    }

    return () => {
      videoStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [isVideoEnabled]);

  const toggleScreenRecording = () => {
    setIsScreenRecording((prev) => !prev);
  };

  const toggleVideoFeed = () => {
    setIsVideoEnabled((prev) => !prev);
  };

  const downloadRecording = () => {
    if (videoURL) {
      const a = document.createElement('a');
      a.href = videoURL;
      a.download = 'screen-recording.webm';
      a.click();
    }
  };

  const resetPreview = () => {
    setVideoURL(null);
    screenChunksRef.current = [];
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="w-full max-w-4xl">
        {!isScreenRecording ? (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center border rounded-lg">
            <FaDesktop size={48} className="text-gray-400" />
            <span className="text-red-500 font-medium ml-4">Screen recording is off</span>
          </div>
        ) : (
          <div className="relative w-full h-96">
            <video
              ref={screenVideoRef}
              autoPlay
              muted
              className="w-full h-full object-contain border rounded-lg"
            />
            {isVideoEnabled && (
              <div className="absolute bottom-4 right-4 w-32 h-24 border rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoOverlayRef}
                  autoPlay
                  muted
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Video Toggle Switch positioned in top-left */}
            <label htmlFor="video-toggle" className="absolute top-4 left-4 cursor-pointer">
              <input
                type="checkbox"
                id="video-toggle"
                className="opacity-0 w-0 h-0 absolute"
                checked={isVideoEnabled}
                onChange={toggleVideoFeed}
              />
              <span
                className={`slider round w-16 h-8 bg-gray-300 rounded-full inline-block relative transition-all duration-300 ${
                  isVideoEnabled ? 'bg-green-500' : ''
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                    isVideoEnabled ? 'right-1' : 'left-1'
                  }`}
                >
                  {isVideoEnabled && (
                    <FaVideo className="absolute top-1 left-1 text-green-600" size={12} />
                  )}
                {!isVideoEnabled && (
                    <FaVideo className="absolute top-1 left-1 text-gray-600" size={12} />
                  )}
                </div>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Start/Stop Recording Button */}
      <div className="flex space-x-4">
        <button
          className={`bg-${isScreenRecording ? 'red' : 'green'}-500 text-white px-6 py-3 rounded-lg`}
          onClick={toggleScreenRecording}
        >
          {isScreenRecording ? 'Stop Screen Recording' : 'Start Screen Recording'}
        </button>
      </div>

      {videoURL && (
        <div className="w-full max-w-4xl flex flex-col items-center space-y-4 mt-6">
          <video controls className="border rounded-lg w-full" src={videoURL} />
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg"
              onClick={downloadRecording}
            >
              Download Recording
            </button>
            <button
              className="bg-gray-500 text-white px-6 py-3 rounded-lg"
              onClick={resetPreview}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
