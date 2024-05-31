document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('videoElement');
    const canvasElement = document.getElementById('canvasElement');
    const skeletonCanvas = document.getElementById('canvasElement');
    const toggleKeypointsButton = document.getElementById('toggleKeypoints');
    const toggleSkeletonButton = document.getElementById('toggleSkeleton');
    const startStopButton = document.getElementById('startStop');
    const keypointsList = document.getElementById('keypointsList');
    const canvasCtx = canvasElement.getContext('2d');
    const skeletonCtx = skeletonCanvas.getContext('2d');
    let showKeypoints = false;
    let showSkeleton = false;
    let isRunning = false;
    let animationFrameId;
    let net;

    async function setupCamera() {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });
        videoElement.srcObject = stream;
        return new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                resolve(videoElement);
            };
        });
    }

    async function loadBodyPix() {
        net = await bodyPix.load();
        return net;
    }

    function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
        const adjacentKeyPoints = getAdjacentKeyPoints(keypoints, minConfidence);
        adjacentKeyPoints.forEach(([start, end]) => {
            drawSegment(toTuple(start.position), toTuple(end.position), 'Red', scale, ctx);
        });
    }

    function getAdjacentKeyPoints(keypoints, minConfidence) {
        const adjacentKeyPoints = [
            [keypoints[5], keypoints[6]], // left shoulder to right shoulder
            [keypoints[5], keypoints[7]], // left shoulder to left elbow
            [keypoints[7], keypoints[9]], // left elbow to left wrist
            [keypoints[6], keypoints[8]], // right shoulder to right elbow
            [keypoints[8], keypoints[10]], // right elbow to right wrist
            [keypoints[11], keypoints[12]], // left hip to right hip
            [keypoints[5], keypoints[11]], // left shoulder to left hip
            [keypoints[6], keypoints[12]], // right shoulder to right hip
            [keypoints[11], keypoints[13]], // left hip to left knee
            [keypoints[13], keypoints[15]], // left knee to left ankle
            [keypoints[12], keypoints[14]], // right hip to right knee
            [keypoints[14], keypoints[16]] // right knee to right ankle
        ];

        return adjacentKeyPoints.filter(([start, end]) => start.score >= minConfidence && end.score >= minConfidence);
    }

    function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
        keypoints.forEach((keypoint) => {
            if (keypoint.score >= minConfidence) {
                const { y, x } = keypoint.position;
                ctx.beginPath();
                ctx.arc(x * scale, y * scale, 5, 0, 2 * Math.PI);
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

            const segmentation = await net.segmentPersonParts(video, {
                flipHorizontal,
                internalResolution: 'medium',
                segmentationThreshold: 0.7
            });

            canvasCtx.clearRect(0, 0, video.width, video.height);
            skeletonCtx.clearRect(0, 0, skeletonCanvas.width, skeletonCanvas.height);

            const rainbow = [
                [110, 64, 170], [106, 72, 183], [100, 81, 196], [92, 91, 206],
                [84, 101, 214], [75, 113, 221], [66, 125, 224], [56, 138, 226],
                [48, 150, 224], [40, 163, 220], [33, 176, 214], [29, 188, 205],
                [26, 199, 194], [26, 210, 182], [28, 219, 169], [33, 227, 155],
                [41, 234, 141], [51, 240, 128], [64, 243, 116], [79, 246, 105],
                [96, 247, 97],  [115, 246, 91], [134, 245, 88], [155, 243, 88]
            ];

            const coloredPartImage = bodyPix.toColoredPartMask(segmentation, rainbow);
            bodyPix.drawMask(canvasElement, video, coloredPartImage, 0.7, 0, false);

            segmentation.allPoses.forEach(pose => {
                if (showSkeleton) {
                    drawSkeleton(pose.keypoints, 0.5, skeletonCtx);
                }
                if (showKeypoints) {
                    drawKeypoints(pose.keypoints, 0.5, canvasCtx);
                    updateKeypointsList(pose.keypoints);
                } else {
                    keypointsList.innerHTML = '';
                }
            });

            animationFrameId = requestAnimationFrame(poseDetectionFrame);
        }

        poseDetectionFrame();
    }

    toggleKeypointsButton.addEventListener('click', () => {
        showKeypoints = !showKeypoints;
        toggleKeypointsButton.textContent = showKeypoints ? 'Hide Keypoints' : 'Show Keypoints';
    });

    toggleSkeletonButton.addEventListener('click', () => {
        showSkeleton = !showSkeleton;
        toggleSkeletonButton.textContent = showSkeleton ? 'Hide Skeleton' : 'Show Skeleton';
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

    async function main() {
        await setupCamera();
        videoElement.play();
        canvasElement.width = videoElement.width;
        canvasElement.height = videoElement.height;
        skeletonCanvas.width = videoElement.width;
        skeletonCanvas.height = videoElement.height;
        net = await loadBodyPix();
    }

    main();

    function toTuple({ y, x }) {
        return [y, x];
    }

    function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
        ctx.beginPath();
        ctx.moveTo(ax * scale, ay * scale);
        ctx.lineTo(bx * scale, by * scale);
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
});
