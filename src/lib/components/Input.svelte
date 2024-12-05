<script>
    const { label, placeholder, onchange, disabled } = $props();

    function autoResize(event) {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Réinitialise la hauteur
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajuste à la hauteur du contenu
    }
</script>

<div>
    <span>{label}</span>
    <textarea disabled={disabled} type="text" placeholder={placeholder} oninput={event => {
        autoResize(event);
        onchange(event);
    }}></textarea>
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 80%;
    }

    span {
        color: #fff;
        opacity: 0.7;
    }

    textarea {
        font-family: inherit;
        width: 100%;
        background-color: #1e1e1e;
        color: #fff;
        padding: 7px 10px 10px 10px;
        border: none;
        outline: 1px solid #ffffff20;
        border-radius: 6px;
        transition: all 0.1s;
        resize: none;
        overflow: hidden;
        line-height: normal;
        max-height: 200px;
        overflow-y: auto;
    }

    textarea:focus {
        outline: 1px solid #ffffff80;
    }
</style>