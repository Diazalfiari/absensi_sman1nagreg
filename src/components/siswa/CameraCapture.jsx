import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';

const CameraCapture = ({ onPhotoCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      setError('');

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setStream(null);
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const photoData = canvas.toDataURL('image/jpeg');
      setPhoto(photoData);
      stopCamera();
      
      if (onPhotoCapture) {
        onPhotoCapture(photoData);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/40 text-rose-200 px-4 py-3 rounded-xl">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Camera Preview or Captured Photo */}
      <div className="relative bg-black/40 rounded-2xl overflow-hidden border border-white/10">
        <div className="w-full aspect-[4/3] md:aspect-video">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              cameraActive && !photo ? 'opacity-100' : 'opacity-0 absolute inset-0'
            }`}
            style={{ transform: 'scaleX(1)' }}
          />

          {photo && (
            <img
              src={photo}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          {!cameraActive && !photo && (
            <div className="absolute inset-0 flex items-center justify-center text-white/70">
              <div className="text-center">
                <div className="text-6xl mb-4">📷</div>
                <p>Kamera belum diaktifkan</p>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {!cameraActive && !photo && (
          <Button
            onClick={startCamera}
            variant="primary"
            fullWidth
            icon="📷"
          >
            Aktifkan Kamera
          </Button>
        )}

        {cameraActive && !photo && (
          <Button
            onClick={capturePhoto}
            variant="success"
            fullWidth
            icon="📸"
          >
            Ambil Foto
          </Button>
        )}

        {photo && (
          <Button
            onClick={retakePhoto}
            variant="secondary"
            fullWidth
            icon="🔄"
          >
            Ulangi Foto
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
