const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('skeletonCanvas');
const skeletonCanvas = document.getElementById('skeletonCanvas');
const toggleButton = document.getElementById('toggleButton');
const startStopButton = document.getElementById('startStopButton');
const handsUpButton = document.getElementById('handsUpButton');
const keypointsList = document.getElementById('keypointsList');
const canvasCtx = canvasElement.getContext('2d');
const skeletonCtx = skeletonCanvas.getContext('2d');
let showKeypoints = false;
let isRunning = false;
let animationFrameId;
let handsUpDetection = false;

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

async function loadPosenet() {
    const net = await posenet.load();
    return net;
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints = [
        [keypoints[0], keypoints[1]], // nose to left eye
        [keypoints[0], keypoints[2]], // nose to right eye
        [keypoints[1], keypoints[3]], // left eye to left ear
        [keypoints[2], keypoints[4]], // right eye to right ear
        [keypoints[5], keypoints[6]], // left shoulder to right shoulder
        [keypoints[5], keypoints[7]], // left shoulder to left elbow
        [keypoints[7], keypoints[9]], // left elbow to left wrist
        [keypoints[6], keypoints[8]], // right shoulder to right elbow
        [keypoints[8], keypoints[10]],// right elbow to right wrist
        [keypoints[11], keypoints[12]],// left hip to right hip
        [keypoints[5], keypoints[11]], // left shoulder to left hip
        [keypoints[6], keypoints[12]], // right shoulder to right hip
        [keypoints[11], keypoints[13]],// left hip to left knee
        [keypoints[13], keypoints[15]],// left knee to left ankle
        [keypoints[12], keypoints[14]],// right hip to right knee
        [keypoints[14], keypoints[16]] // right knee to right ankle
    ];

    adjacentKeyPoints.forEach(([start, end]) => {
        if (start.score >= minConfidence && end.score >= minConfidence) {
            ctx.beginPath();
            ctx.moveTo(start.position.x * scale, start.position.y * scale);
            ctx.lineTo(end.position.x * scale, end.position.y * scale);
            ctx.stroke();
        }
    });
}

function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    keypoints.forEach((keypoint) => {
        if (keypoint.score >= minConfidence) {
            const { y, x } = keypoint.position;
            ctx.beginPath();
            ctx.arc(x * scale, y * scale, keypoint.part.includes('eye') || keypoint.part.includes('ear') || keypoint.part === 'nose' ? 5 : 3, 0, 2 * Math.PI);
            ctx.fillStyle = 'aqua';
            ctx.fill();
        }
    });
}


function updateKeypointsList(keypoints) {
    keypointsList.innerHTML = keypoints
        .map(keypoint => {
            const { part, position, score } = keypoint;
            return `<div>${part}: (${position.x.toFixed(1)}, ${position.y.toFixed(1)}) - ${score.toFixed(2)}</div>`;
        })
        .join('');
}

async function detectPoseInRealTime(video, net) {
    const flipHorizontal = false;
    async function poseDetectionFrame() {
        if (!isRunning) return;

        const pose = await net.estimateSinglePose(video, {
            flipHorizontal,
        });
        canvasCtx.clearRect(0, 0, video.width, video.height);
        skeletonCtx.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);
        drawSkeleton(pose.keypoints, 0.5, skeletonCtx);
        if (showKeypoints) {
            drawKeypoints(pose.keypoints, 0.5, canvasCtx);
            updateKeypointsList(pose.keypoints);
        } else {
            keypointsList.innerHTML = '';
        }

        if (handsUpDetection && handsUp(pose.keypoints)) {
            videoContainer.classList.add('hands-up');
        } else {
            videoContainer.classList.remove('hands-up');
        }

        animationFrameId = requestAnimationFrame(poseDetectionFrame);
    }
    poseDetectionFrame();
}

function handsUp(keypoints) {
    const leftWrist = keypoints.find(keypoint => keypoint.part === 'leftWrist');
    const rightWrist = keypoints.find(keypoint => keypoint.part === 'rightWrist');
    const leftShoulder = keypoints.find(keypoint => keypoint.part === 'leftShoulder');
    const rightShoulder = keypoints.find(keypoint => keypoint.part === 'rightShoulder');

     return leftWrist.position.y < leftShoulder.position.y && rightWrist.position.y < rightShoulder.position.y;

}


toggleButton.addEventListener('click', () => {
    showKeypoints = !showKeypoints;
    toggleButton.textContent = showKeypoints ? 'Hide Keypoints' : 'Show Keypoints';
});

handsUpButton.addEventListener('click', () => {
    handsUpDetection = !handsUpDetection;
    handsUpButton.textContent = handsUpDetection ? 'Disable Hands Up Detection' : 'Enable Hands Up Detection';
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
    net = await loadPosenet();
}

main();
