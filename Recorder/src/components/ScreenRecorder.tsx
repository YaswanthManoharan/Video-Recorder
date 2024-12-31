import React, { useState, useRef, useEffect } from 'react';

const ScreenRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false); // For external mic audio
  const [isVideoEnabled, setIsVideoEnabled] = useState(false); // For camera video
  const [videoURL, setVideoURL] = useState<string | null>(null);

  const screenStreamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioTracksRef = useRef<MediaStreamTrack[] | null>(null); // For external mic audio

  useEffect(() => {
    return () => {
      // Clean up all streams and tracks on component unmount
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      videoStreamRef.current?.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current?.stop();
    };
  }, []);

  const startRecording = async () => {
    try {
      // Capture the screen video and audio
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true, // Screen audio is enabled based on External audio
      });
      screenStreamRef.current = screenStream;

      let videoStream: MediaStream | null = null;
      let audioTracks: MediaStreamTrack[] = [];

      // Enable external microphone audio if needed
      if (isAudioEnabled) {
        videoStream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: true, // Enable external microphone audio when checkbox is checked
        });
        videoStreamRef.current = videoStream;

        // Extract the audio tracks from the external mic stream if audio is enabled
        audioTracks = videoStream.getAudioTracks();
        audioTracksRef.current = audioTracks;
      }

      // Combine screen video and audio into a single stream
      const combinedStream = new MediaStream();
      screenStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));

      // Mix audio tracks using AudioContext
      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();
  
      // Add screen audio to the mix
      screenStream.getAudioTracks().forEach((track) => {
        const source = audioContext.createMediaStreamSource(new MediaStream([track]));
        source.connect(destination);
      });

      if (isAudioEnabled && audioTracks.length > 0) {
          audioTracks.forEach((track) => {
          const source = audioContext.createMediaStreamSource(new MediaStream([track]));
          source.connect(destination);
        });
      }

      // Add the mixed audio track to the combined stream
      destination.stream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 1920;
      canvas.height = 1080;

      const screenVideo = document.createElement('video');
      screenVideo.srcObject = screenStream;
      screenVideo.muted = true;
      screenVideo.play();

      let cameraVideo: HTMLVideoElement | null = null;
      if (videoStream && isVideoEnabled) {
        cameraVideo = document.createElement('video');
        cameraVideo.srcObject = videoStream;
        cameraVideo.muted = true;
        cameraVideo.play();
      }

      const drawFrame = () => {
        if (ctx && screenVideo) {
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
          if (cameraVideo) {
            const overlayWidth = 320;
            const overlayHeight = 180;
            ctx.drawImage(
              cameraVideo,
              canvas.width - overlayWidth - 20,
              canvas.height - overlayHeight - 20,
              overlayWidth,
              overlayHeight
            );
          }
          requestAnimationFrame(drawFrame);
        }
      };

      drawFrame();

      const canvasStream = canvas.captureStream();
      const mediaRecorder = new MediaRecorder(combinedStream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoURL(URL.createObjectURL(blob));
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    videoStreamRef.current?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const downloadRecording = () => {
    if (videoURL) {
      const a = document.createElement('a');
      a.href = videoURL;
      a.download = 'recording.webm';
      a.click();
    }
  };

  const resetPreview = () => {
    setVideoURL(null);
    chunksRef.current = [];
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <canvas
        ref={canvasRef}
        className="w-full max-w-4xl h-full bg-black border rounded-lg"
      />

      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isAudioEnabled}
            onChange={() => setIsAudioEnabled((prev) => !prev)}
            disabled={isRecording}
          />
          <span>Enable External Mic Audio</span>
        </div>
        {isAudioEnabled && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isVideoEnabled}
              onChange={() => setIsVideoEnabled((prev) => !prev)}
              disabled={isRecording}
            />
            <span>Enable Camera Video</span>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          className={`px-6 py-3 rounded-lg text-white ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {videoURL && (
        <div className="flex flex-col items-center space-y-4">
          <video
            controls
            className="w-full max-w-4xl border rounded-lg"
            src={videoURL}
          />
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
