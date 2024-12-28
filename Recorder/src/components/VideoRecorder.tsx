import React, { useState, useRef, useEffect } from 'react';

const VideoRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        videoStreamRef.current = stream;

        if (videoElementRef.current) {
          videoElementRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera and microphone:', error);
      }
    };

    setupCamera();

    return () => {
      videoStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecording = () => {
    if (videoStreamRef.current) {
      const mediaRecorder = new MediaRecorder(videoStreamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      videoChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        setVideoURL(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const resetPreview = () => {
    setVideoURL(null);
    setRecording(false);
  };

  const downloadVideo = () => {
    if (videoURL) {
      const a = document.createElement('a');
      a.href = videoURL;
      a.download = 'recording.webm';
      a.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
        <h1>Video Recorder</h1>
      <div className="w-full max-w-4xl">
        <video
          ref={videoElementRef}
          autoPlay
          muted={!recording}
          className="border rounded-lg w-full"
        />
      </div>

      <div className="flex space-x-4">
        {!recording ? (
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
            onClick={startRecording}
          >
            Start Recording
          </button>
        ) : (
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg"
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        )}
      </div>

      {videoURL && (
        <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
          <video
            controls
            className="border rounded-lg w-full"
            src={videoURL}
          />
          <div className="flex space-x-4">
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg"
              onClick={downloadVideo}
            >
              Download Video
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

export default VideoRecorder;