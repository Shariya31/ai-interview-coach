export const useAudioRecorder = (socketRef) => {
  let mediaRecorder;
  let stream;

  const startRecording = async () => {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    mediaRecorder.ondataavailable = (event) => {
      if (
        event.data.size > 0 &&
        socketRef.current?.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(event.data);
      }
    };

    mediaRecorder.start(1000);
  };

  const stopRecording = () => {
    if (!mediaRecorder) return;

    // 1️⃣ Stop sending chunks immediately
    mediaRecorder.ondataavailable = null;

    // 2️⃣ Stop recorder (flushes final buffer)
    if (mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    // 3️⃣ Tell backend recording is complete
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "STOP" }));
    }

    // 4️⃣ Release mic
    stream?.getTracks().forEach((t) => t.stop());
  };


  return { startRecording, stopRecording };
};
