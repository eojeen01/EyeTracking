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

    
  const mouse = {
    x: 0,
    y: 0,

    handleMouseMove: function(event) {
      mouse.x = (event.clientX / $(window).width()) * 2 - 1;
      mouse.y = (event.clientY / $(window).height()) * 2 - 1;
      // position [-1, 1]로 정규화
    },
  }

  document.onmousemove = mouse.handleMouseMove;
  // 창에서 마우스가 어디 위치해있는지 추적

  function getImage() {
    return tf.tidy(function() {
      const image = tf.browser.fromPixels($('#eyes')[0]);
      // tf.browser.fromPixels를 이용해 눈 캔버스에서 이미지를 저장하고 정규화
      const batchedImage = image.expandDims(0);
      // batch 크기 추가
      return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
      // 정규화 후 반환함
    });
  }

  const dataset = {
    train: {
      n: 0,
      x: null,
      y: null,
    },
    val: {
      n: 0,
      x: null,
      y: null,
    },
  }
  
  function captureExample() {
    tf.tidy(function() {
      const image = getImage();
      const mousePos = tf.tensor1d([mouse.x, mouse.y]).expandDims(0);
      const subset = dataset[Math.random() > 0.2 ? 'train' : 'val'];
      // training set(80%)에 추가할 것인지 유효성검사 set(20%)에 추가할 것인지 선택
      if (subset.x == null) {
        subset.x = tf.keep(image);
        subset.y = tf.keep(mousePos);
        // 새 tensor 생성
      } else {
        const oldX = subset.x;
        const oldY = subset.y;
  
        subset.x = tf.keep(oldX.concat(image, 0));
        subset.y = tf.keep(oldY.concat(mousePos, 0));
        // 기존 tensor와 연결
      }
  
      subset.n += 1;
      // counter 증가
    });
    // 모델이 암기적으로 학습하지 않도록 validation set에 몇가지 예를 저장해야함. 
    //    -> 모델이 보이지 않는 데이터에 대해 어떻게 작동하는지 확인 가능, 과적합 확인 가능
    // 따라서 20%를 분할하여 validation set로 이동

  }

  $('body').keyup(function(event) {
    // 스페이스바에 바인딩
    if (event.keyCode == 32) {
      captureExample();
  
      event.preventDefault();
      return false;
    }
  });
  //스페이스바를 누를 때마다 마우스의 위치의 이미지가 데이터셋 중 하나에 저장됨
  let currentModel;

function createModel() {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 20,
    strides: 1,
    activation: 'relu',
    inputShape: [$('#eyes').height(), $('#eyes').width(), 3],
  }));

  model.add(tf.layers.maxPooling2d({
    poolSize: [2, 2],
    strides: [2, 2],
  }));

  model.add(tf.layers.flatten());

  model.add(tf.layers.dropout(0.2));

  // Two output values x and y
  model.add(tf.layers.dense({
    units: 2,
    activation: 'tanh',
  }));

  // Use ADAM optimizer with learning rate of 0.0005 and MSE loss
  model.compile({
    optimizer: tf.train.adam(0.0005),
    loss: 'meanSquaredError',
  });

  return model;
  }
  // 네트워크에는 conv 계층 , max-pooling 및 두 개의 출력 값 (화면 좌표)이 있는 조밀한 계층이 있어야함
  // regularizer를 위해 dropout 추가, 2D-data를 1D로 변환하기 위해 flatten 추가
  // 훈련은 Adam 옵티마이저로 수행

  function fitModel() {
    let batchSize = Math.floor(dataset.train.n * 0.1);
    if (batchSize < 4) {
      batchSize = 4;
    } else if (batchSize > 64) {
      batchSize = 64;
    }
  
    if (currentModel == null) {
      currentModel = createModel();
    }
  
    currentModel.fit(dataset.train.x, dataset.train.y, {
      batchSize: batchSize,
      epochs: 20,
      shuffle: true,
      validationData: [dataset.val.x, dataset.val.y],
    });
    }
  // 네트워크를 훈련하기 전에 고정 Epoch 번호와 가변 배치 크기를 설정
  //    ->매우 직은 데이터셋을 다룰 수 있기 때문

  $('#train').click(function() {
    fitModel();
  });

  function moveTarget() {
    if (currentModel == null) {
      return;
    }
    tf.tidy(function() {
      const image = getImage();
      const prediction = currentModel.predict(image);
  
      // Convert normalized position back to screen position:
      const targetWidth = $('#target').outerWidth();
      const targetHeight = $('#target').outerHeight();
  
      // It's okay to run this async, since we don't have to wait for it.
      prediction.data().then(prediction => {
        const x = ((prediction[0] + 1) / 2) * ($(window).width() - targetWidth);
        const y = ((prediction[1] + 1) / 2) * ($(window).height() - targetHeight);
  
        // Move target there:
        const $target = $('#target');
        $target.css('left', x + 'px');
        $target.css('top', y + 'px');
      });
    });
    }
  
  setInterval(moveTarget, 100);
  // 간격을 100ms로 설정

  });