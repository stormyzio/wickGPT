<script lang="ts">

    import { renderBubbleAndImage, renderResponse, testCanvasHeight } from "../lib/canvas";

    const { q, r, inAnimation, mustRecord, finalResponse, finalFormat } = $props();

    let recorder: MediaRecorder;
    let stream: MediaStream;
    let frameRate = 30;  // FPS
    let interval: number;
    let canvas: HTMLCanvasElement;
    
    function startRecording() {
        console.log("Recording started");

        // Create a new canvas for capturing frames

        // Capture stream from the canvas
        stream = canvas.captureStream(frameRate);
        recorder = new MediaRecorder(stream);
        const chunks = [];

        recorder.ondataavailable = (event: BlobEvent) => {
            chunks.push(event.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/' + finalFormat });
            // Convertir en GIF
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'wickgpt-clip.' + finalFormat;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        // Start the recording process
        recorder.start();
    }

    function stopRecording() {
        if (recorder) {
            console.log("Stopping recording...");
            setTimeout(() => {
                clearInterval(interval);
                recorder.stop();
                recorder = null;
            }, 1000); // 1 second, to ensure the last frame is captured and to avoid abrupt endings
        }
    }

    $effect(() => {
        console.log("f rendering canvas...");
        renderBubbleAndImage(canvas, q);
    })

    $effect(() => {
        console.log("%c rendering canvas...", "color: #aaaaaa30;");
        if (!inAnimation) {
            if (!recorder) {
                testCanvasHeight(canvas, q, finalResponse); // if not in animation, and if not recorder, just render the final response, and calculate the height
            } else {
                renderResponse(canvas, q, finalResponse, false); // if in animation, but if recorder, render the response with no animation and no height calculation ( bc height calculation is already done and will cause a little flash bug)
            }
        } else {
            renderResponse(canvas, q, r, true); // if in animation, render the response with animation
        }

        if (inAnimation && r == " " && mustRecord) {
            testCanvasHeight(canvas, q, finalResponse, true).then(() => {
                startRecording();
            });
        } else {
            if (!inAnimation) {
                stopRecording();
            }
        }
    })
</script>

<div class="view">
    <canvas height="2000" width="2000" class="canvas" bind:this={canvas}></canvas>
</div>

<style>

    .view {
        width: 100%;
        overflow: hidden;
        padding-left: 65px; 
    }

    .canvas {
        width: 100%;
        max-width: 760px;
        border-radius: 10px;
    }

    @media (max-width: 1200px) {
        .view {
            margin-top: 30px;
            padding: 0 30px;
        }
    }

</style>