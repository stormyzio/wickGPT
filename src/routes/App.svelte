<script lang="ts">
    import Input from "../lib/components/Input.svelte";
    import ChatView from "./ChatView.svelte";

    let defaults = {
        question: "Can u help me in my homework?",
        response: "No, do it yourself :)"
    };

    function questionInputChanged(event: InputEvent) {
        question = (event.target as HTMLInputElement).value;
    }

    function responseInputChanged(event: InputEvent) {
        response = (event.target as HTMLInputElement).value;
    }

    const speed = 30;

    function fixWeirdSafariBug() {
        let safariAgent = window.navigator.userAgent.indexOf("Safari") > -1; // true if Safari or Chrome
        let chromeAgent = window.navigator.userAgent.indexOf("Chrome") > -1; // true if Chrome

        if ((chromeAgent) && (safariAgent)) safariAgent = false; // true if NOT CHROME and Safari

        if (safariAgent) {
            setTimeout(() => {
                responseAnimation = "     "
            }, 100)
        }
    }

    function play(frames: string[]) {
        let sentence = "";
        inAnimation = true;
        responseAnimation = " "
        fixWeirdSafariBug();
        setTimeout(() => {
            let interval = setInterval(() => {
                if (frames.length > 0) {
                    let word = frames.shift(); // returns the first element and removes it from the array
                    if (word) {
                        sentence += word + " ";
                        responseAnimation = sentence;
                    }
                }
            }, speed);

            setTimeout(() => {
                clearInterval(interval);
                inAnimation = false;
                responseAnimation = null;
                if (mustRecord) {
                    setTimeout(() => {
                        animateButtonAvailable = true;
                    }, 1000);
                } else {
                    animateButtonAvailable = true;
                }
            }, frames.length * speed + 300);
        }, 500)
    }

    function animate(_event: Event | null, record = false) {
        if (record) {
            mustRecord = true;
        } else {
            mustRecord = false;
        }

        animateButtonAvailable = false;
        let frames = [];
        response = response.trim();
        let words: any = response.split(" ").filter(w => w !== "");
        response = words.join(" ");
        console.log(response);
        for (let i = 0; i < words.length;) {    
            let delayRandomiser = Math.random();
            if (delayRandomiser < 0.5) {
                frames.push(words[i]);
                i++; // Si le if passe, incrémente
            } else {
                frames.push(null);
            }
        }

        play(frames)
    }

    type FormatString = "mp4" | "webm" | "mov" | "";

    function downloadClip(format: FormatString = "") {
        downloadOptions.classList.toggle("active");
        if (format) {
            finalFormat = format;
            animate(null, true);
        }
    }

    let downloadOptions: HTMLElement;

    $effect(() => {
        window.addEventListener("click", (event) => {
            if (downloadOptions && event.target !== downloadButton) {
                downloadOptions.classList.remove("active");
            }
        });
    })

    let finalFormat = $state("")
    let downloadButton: HTMLElement;
    let mustRecord = $state(false);
    let animateButtonAvailable = $state(true);
    let inAnimation = $state(false);
    let question = $state(defaults.question);
    let response = $state(defaults.response);
    let responseAnimation: boolean | string = $state(false);
</script>

<div class="app">
    <form class="input">
        <Input label="Question" placeholder={defaults.question} onchange={questionInputChanged} disabled={!animateButtonAvailable} />
        <Input label="Response" placeholder={defaults.response} onchange={responseInputChanged} disabled={!animateButtonAvailable}></Input>
        <div class="btns">
            <button class="btn" type="submit" onclick={animate} disabled={!animateButtonAvailable}>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m13.762 11.898l2.546-1.727q.354-.242.354-.671t-.354-.671l-2.546-1.727q-.404-.293-.833-.05q-.429.242-.429.727v3.442q0 .485.429.727q.429.243.833-.05m-7.581 8.92q-.672.086-1.2-.321t-.608-1.078L3.144 9.706q-.08-.672.333-1.216t1.084-.606l.977-.073v7.035q0 1.496 1.06 2.556t2.556 1.06h9.185q.003.35-.245.614t-.61.32zm2.973-4.356q-.69 0-1.153-.463t-.462-1.153V4.616q0-.691.462-1.153T9.154 3h10.23q.691 0 1.153.463T21 4.616v10.23q0 .69-.463 1.153t-1.153.463z"/></svg>
                Preview animation
            </button>
            <div class="download-button-container">
                <button class="btn" onclick={() => downloadClip()} disabled={!animateButtonAvailable} bind:this={downloadButton}>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="m12 16l-5-5l1.4-1.45l2.6 2.6V4h2v8.15l2.6-2.6L17 11zm-6 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg>
                    Download clip
                </button>
                <div class="download-options" bind:this={downloadOptions}>
                    <button onclick={() => downloadClip("mp4")}>mp4</button>
                    <button onclick={() => downloadClip("webm")}>webm</button>
                    <button onclick={() => downloadClip("mov")}>mov</button>
                </div>
            </div>
        </div>
    </form>
    <div class="output">
        <ChatView finalFormat={finalFormat} finalResponse={response} mustRecord={mustRecord} q={question || defaults.question} r={responseAnimation || response || defaults.response} inAnimation={inAnimation} />
    </div>
    <div class="download-options active none"></div>
</div>

<style>

    .none {
        display: none!important;
    }

    .app {
        display: flex;
        flex-direction: row;
        justify-content: center;
        width: 100%;
        height: 60%;
        margin-top: 30px;
    }

    .input {
        width: 30%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 60px;
    }

    .btns {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        width: 100%;
    }

    .download-button-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        width: 100%;
        position: relative;
    }
    .download-options {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 50px;
        background-color: #1e1e1e;
        border: 1px solid #ffffff20;
        border-radius: 6px;
        padding: 10px;
        gap: 10px;
        box-shadow: 2px 4px 12px #00000030;
        transform: scale(0);
        transition: all 0.1s;
    }
    .download-options button {
        border: none;
        background: none;
        color: #ffffffbb;
        cursor: pointer;
    }
    .download-options button:hover {
        color: #ffffff;
    }
    
    /* @css-unimportant */
    .download-options.active {
        transform: scale(1);
    }

    .input .btn {
        width: 40%;
        height: 40px;
        background-color: #1e1e1e;
        border: none;
        color: #ffffffbb;
        padding: 5px;
        border: 1px solid #ffffff20;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.1s;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }
    .input .btn:hover {
        background-color: #262626;
        color: #ffffffee;
    }
    .input .btn:disabled {
        background-color: #1e1e1e;
        color: #ffffff20;
        cursor: not-allowed;
    }

    .output {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    @media (max-width: 1200px) {
        .app {
            flex-direction: column;
            align-items: center;
            justify-content: start;
        }

        .input {
            width: 100%;
            height: auto;
            gap: 20px;
        }

        .output {
            width: 100%;
            margin-top: 20px;
        }
    }

</style>