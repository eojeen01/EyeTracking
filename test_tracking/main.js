$(document).ready(function() {
    const video = $('#webcam')[0];
    const overlay = $('#overlay')[0];
    const overlayCC = overlay.getContext('2d');

    const ctrack = new clm.tracker();
    ctrack.init();
    // Tracker 초기화

    function getEyesRectangle(positions) {
        const minX = positions[23][0] - 5;
        const maxX = positions[28][0] + 5;
        const minY = positions[24][1] - 5;
        const maxY = positions[26][1] + 5;
      
        const width = maxX - minX;
        const height = maxY - minY;
      
        return [minX, minY, width, height];
      }
    //   clmtrackr에서 얻은 x, y 구성요소

    function trackingLoop() {
        // Check if a face is detected, and if so, track it.
        requestAnimationFrame(trackingLoop);
        // canvas에 무언가 그리기 전에 현재 콘텐츠를 지움

      
        let currentPosition = ctrack.getCurrentPosition();
        overlayCC.clearRect(0, 0, 400, 300);
      
        if (currentPosition) {// Draw facial mask on overlay canvas:
            ctrack.draw(overlay);
          
            // Get the eyes rectangle and draw it in red:
            const eyesRect = getEyesRectangle(currentPosition);
            overlayCC.strokeStyle = 'red';
            overlayCC.strokeRect(eyesRect[0], eyesRect[1], eyesRect[2], eyesRect[3]);
          
            // The video might internally have a different size, so we need these
            // factors to rescale the eyes rectangle before cropping:
            const resizeFactorX = video.videoWidth / video.width;
            const resizeFactorY = video.videoHeight / video.height;
          
            // Crop the eyes from the video and paste them in the eyes canvas:
            const eyesCanvas = $('#eyes')[0];
            const eyesCC = eyesCanvas.getContext('2d');
          
            eyesCC.drawImage(
              video,
              eyesRect[0] * resizeFactorX, eyesRect[1] * resizeFactorY,
              eyesRect[2] * resizeFactorX, eyesRect[3] * resizeFactorY,
              0, 0, eyesCanvas.width, eyesCanvas.height
            );
        }
        // 눈 주위의 빨간 직사각형 표시, 해당 부분이 두 번째 canvas에서 잘림
        
      }
  
    function onStreaming(stream) {
        video.srcObject = stream;

        ctrack.start(video);
        // 추적기가 비디오 스트리밍에서 작동하도록 함
        
        trackingLoop();
    }
    
    navigator.mediaDevices.getUserMedia({ video: true }).then(onStreaming);
    // 브라우저에 권한 요청 후 얼굴 스트리밍
  });