import React, { useState, useRef, useEffect } from 'react';
import CameraOffIcon from '../assets/CameraOffIcon';

const VideoRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [cameraState, setCameraState] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0); // Track elapsed time in seconds
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null); // Use number instead of NodeJS.Timeout
  const audioTrackRef = useRef<MediaStreamTrack | null>(null); // Store the audio track separately

  useEffect(() => {
    const setupCamera = async () => {
      if (cameraState) {
        try {
          // Get both video and audio streams
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          videoStreamRef.current = stream;

          // Separate the video and audio tracks
          const videoTrack = stream.getVideoTracks()[0];
          const audioTrack = stream.getAudioTracks()[0];

          // Remove audio from the video feed by muting it
          if (videoElementRef.current) {
            videoElementRef.current.srcObject = new MediaStream([videoTrack]);
          }

          // Store the audio track for recording, but not for playback
          audioTrackRef.current = audioTrack;

        } catch (error) {
          console.error('Error accessing camera and microphone:', error);
        }
      }
    };

    if (cameraState) {
      setupCamera();
    } else {
      // Stop the video and audio streams when the camera is off
      videoStreamRef.current?.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
      if (audioTrackRef.current) {
        audioTrackRef.current.stop(); // Stop the audio track
      }
    }

    // Cleanup on unmount or when cameraState changes
    return () => {
      videoStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioTrackRef.current) {
        audioTrackRef.current.stop();
      }
    };
  }, [cameraState]);

  const startRecording = () => {
    if (videoStreamRef.current && audioTrackRef.current) {
      const mediaRecorder = new MediaRecorder(new MediaStream([audioTrackRef.current, videoStreamRef.current.getVideoTracks()[0]]));
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

      // Start the recording timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current); // Stop the timer when recording stops
    }
  };

  const onCamera = () => {
    setCameraState(true);
  };
  const offCamera = () => {
    setCameraState(false);
  };

  const resetPreview = () => {
    setVideoURL(null);
    setRecording(false);
    setRecordingTime(0);
    if (timerRef.current !== null) {
      clearInterval(timerRef.current); // Reset the timer
    }
  };

  const downloadVideo = () => {
    if (videoURL) {
      const a = document.createElement('a');
      a.href = videoURL;
      a.download = 'recording.webm';
      a.click();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <div className="w-full max-w-4xl relative">
        {/* Display recording indication and time when recording */}
        {recording && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-lg">
            <span className="font-medium">Recording</span> - {formatTime(recordingTime)}
          </div>
        )}
        
        {!cameraState ? (
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center border rounded-lg">
            <CameraOffIcon />
            <span className="text-red-500 font-medium">Camera is off</span>
          </div>
        ) : (
          <video
            ref={videoElementRef}
            autoPlay
            muted={false} // Video is not muted, but it's not including audio playback
            className="w-full h-96 object-contain border rounded-lg" // Changed from object-cover to object-contain
          />
        )}
      </div>

      <div className="flex space-x-4">
        {!cameraState ? (
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg"
            onClick={onCamera}
          >
            On Camera
          </button>
        ) : (
          <button
            className="bg-red-500 text-white px-6 py-3 rounded-lg"
            onClick={offCamera}
          >
            Off Camera
          </button>
        )}
        {cameraState ? (
          !recording ? (
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
          )
        ) : null}
      </div>

      {videoURL && (
        <div className="w-full max-w-4xl flex flex-col items-center space-y-4">
          <video
            controls
            className="border rounded-lg w-full object-contain" // Ensure preview uses object-contain as well
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
