const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('skeletonCanvas');
const skeletonCanvas = document.getElementById('skeletonCanvas');
const toggleButton = document.getElementById('toggleButton');
const durationDisplay = document.getElementById('duration');
const startStopButton = document.getElementById('startStopButton');
const handsUpButton = document.getElementById('handsUpButton');
const startHeadRaiseButton = document.getElementById('startHeadRaiseButton');
const keypointsList = document.getElementById('keypointsList');
const canvasCtx = canvasElement.getContext('2d');
const skeletonCtx = canvasElement.getContext('2d');
let showKeypoints = false;
let isRunning = false;
let armRaiseStartTime = null;
let armRaiseDuration = 0;
let animationFrameId;
let handsUpDetection = false;
let isDetectingHeadRaise = false;

const keypointColors = {
    'nose': 'red',
    'left_eye': 'orange',
    'right_eye': 'orange',
    'left_ear': 'yellow',
    'right_ear': 'yellow',
    'left_shoulder': 'green',
    'right_shoulder': 'green',
    'left_elbow': 'blue',
    'right_elbow': 'blue',
    'left_wrist': 'purple',
    'right_wrist': 'purple',
    'left_hip': 'pink',
    'right_hip': 'pink',
    'left_knee': 'cyan',
    'right_knee': 'cyan',
    'left_ankle': 'magenta',
    'right_ankle': 'magenta'
};

async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    });
    videoElement.srcObject = stream;
    return new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
            resolve(videoElement);
        };
    });
}

async function loadMoveNet() {
    const net = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING
    });
    return net;
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
    adjacentKeyPoints.forEach(([startIdx, endIdx]) => {
        const start = keypoints[startIdx];
        const end = keypoints[endIdx];
        if (start.score >= minConfidence && end.score >= minConfidence) {
            ctx.beginPath();
            ctx.moveTo(start.x * scale, start.y * scale);
            ctx.lineTo(end.x * scale, end.y * scale);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    keypoints.forEach((keypoint) => {
        if (keypoint.score >= minConfidence) {
            const { y, x, name } = keypoint;
            ctx.beginPath();
            ctx.arc(x * scale, y * scale, 5, 0, 2 * Math.PI);
            ctx.fillStyle = keypointColors[name] || 'aqua';
            ctx.fill();
        }
    });
}


function updateKeypointsList(keypoints) {
    keypointsList.innerHTML = keypoints
        .map(keypoint => {
            const { name, x, y, score } = keypoint;
            return `<div>${name}: (${x.toFixed(1)}, ${y.toFixed(1)}) - ${score.toFixed(2)}</div>`;
        })
        .join('');
}

function handsUp(keypoints) {
    const leftWrist = keypoints.find(keypoint => keypoint.name === 'left_wrist');
    const rightWrist = keypoints.find(keypoint => keypoint.name === 'right_wrist');
    const leftShoulder = keypoints.find(keypoint => keypoint.name === 'left_shoulder');
    const rightShoulder = keypoints.find(keypoint => keypoint.name === 'right_shoulder');

    return leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;
}

function isHeadRaised(keypoints) {
    const nose = keypoints.find(keypoint => keypoint.name === 'nose');
    const leftShoulder = keypoints.find(keypoint => keypoint.name === 'left_shoulder');
    const rightShoulder = keypoints.find(keypoint => keypoint.name === 'right_shoulder');

    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const threshold = 150; // Increase this value to require a higher raise for detection
    return nose.y < (shoulderY - threshold);
}

async function detectPoseInRealTime(video, net) {
    const flipHorizontal = false;
    async function poseDetectionFrame() {
        if (!isRunning) return;

        const poses = await net.estimatePoses(video, { flipHorizontal });
        const pose = poses[0];

        canvasCtx.clearRect(0, 0, video.width, video.height);
        skeletonCtx.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);

        drawSkeleton(pose.keypoints, 0.5, skeletonCtx);
        if (showKeypoints) {
            drawKeypoints(pose.keypoints, 0.5, canvasCtx);
            updateKeypointsList(pose.keypoints);
        } else {
            keypointsList.innerHTML = '';
        }

        if (handsUpDetection) {
            if (handsUp(pose.keypoints)) {
                videoContainer.classList.add('hands-up');
                if (armRaiseStartTime === null) {
                    armRaiseStartTime = Date.now();
                }
                armRaiseDuration = (Date.now() - armRaiseStartTime) / 1000;
            } else {
                videoContainer.classList.remove('hands-up');
                armRaiseStartTime = null;
            }
            durationDisplay.textContent = armRaiseDuration.toFixed(2);
        }

        if (isDetectingHeadRaise) {
            if (isHeadRaised(pose.keypoints)) {
                videoContainer.classList.add('hands-up');
                if (armRaiseStartTime === null) {
                    armRaiseStartTime = Date.now();
                }
                armRaiseDuration = (Date.now() - armRaiseStartTime) / 1000;
            } else {
                videoContainer.classList.remove('hands-up');
                armRaiseStartTime = null;
            }
            durationDisplay.textContent = armRaiseDuration.toFixed(2);
        }
        animationFrameId = requestAnimationFrame(poseDetectionFrame);
    }
    poseDetectionFrame();
}

toggleButton.addEventListener('click', () => {
    showKeypoints = !showKeypoints;
    toggleButton.textContent = showKeypoints ? 'Hide Keypoints' : 'Show Keypoints';
});

handsUpButton.addEventListener('click', () => {
    handsUpDetection = !handsUpDetection;
    handsUpButton.textContent = handsUpDetection ? 'Stop Arm Raise Detection' : 'Start Arm Raise Detection';
    if (!handsUpDetection) {
        armRaiseStartTime = null;
        armRaiseDuration = 0;
        durationDisplay.textContent = '0';
    }
});

startHeadRaiseButton.addEventListener('click', () => {
    isDetectingHeadRaise = !isDetectingHeadRaise;
    startHeadRaiseButton.textContent = isDetectingHeadRaise ? 'Stop Head Raise Detection' : 'Start Head Raise Detection';
    if (!isDetectingHeadRaise) {
        armRaiseStartTime = null;
        armRaiseDuration = 0;
        durationDisplay.textContent = '0';
    }
});

startStopButton.addEventListener('click', () => {
    if (isRunning) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
        startStopButton.textContent = 'Start';
    } else {
        isRunning = true;
        detectPoseInRealTime(videoElement, net);
        startStopButton.textContent = 'Stop';
    }
});

let net;

async function main() {
    await setupCamera();
    videoElement.play();
    net = await loadMoveNet();
}

main();