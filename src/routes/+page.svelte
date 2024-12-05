<script>
    import App from "./App.svelte";
    import WickGPT from "$lib/assets/wickgpt.svg";
</script>

<div class="container">
    <div class="top">
        <img src={WickGPT} alt="logo" width="60px" class="logo">
        <h1>WickGPT</h1>
        <a class="github-button" target="_blank" href="https://github.com/stormyzio/wickgpt" aria-label="github link">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>
        </a>
    </div>
    <h2>Online tool to generate fake clips of chatGPT responses!</h2>
    <span class="mark">This project is not officially associated with OpenAI.</span>
    <div class="sep"></div>
    <App />
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .top {
        margin-top: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
    }
    .github-button {
        cursor: pointer;
        color: #ffffffbb;
        transition: 0.2s;
        margin-top: 4px;
    }
    .github-button:hover {
        color: #ffffff;
    }

    h1 {
        color: #fff;
        font-size: 2.5em;
        margin-bottom: 0;
        margin-top: 0;
        letter-spacing: 1.5px;
    }

    h2 {
        color: #fff;
        font-size: 1.2em;
        opacity: 0.7;
        font-weight: 500;
        text-align: center;
    }

    .mark {
        color: #fff;
        font-size: 0.5em;
        opacity: 0.5;
        font-style: italic;
        margin-top: -10px;
    }

    .sep {
        margin: 20px 0;
        width: 100%;
        height: 1px;
        background-color: #ffffff20;
    }
</style>