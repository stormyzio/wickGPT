import { drawText, CanvasTextConfig, getTextHeight } from "canvas-txt";

const colors = {
    bg: "#212121",
    bubble: "#303030",
    text: "#ECECEC",
    svgBorder: "#424242"
}

function getTextInfos(ctx: CanvasRenderingContext2D, text: string) {
    let txtHeight = getTextHeight({
        text: text + "d", // add a character to avoid bug when there is only little characters, like a, e, i, o, u, m, n, etc.
        ctx: ctx,
        style: ctx.font,
    })
    let txtWidth = ctx.measureText(text).width;

    return {
        txtHeight: txtHeight,
        txtWidth: txtWidth,
    }
}

interface BubbleProperties {
    height: number;
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, color: string, stroke?: string) {
    ctx.fillStyle = color;
    let path = new Path2D();
    path.roundRect(x, y, width, height, radius);
    ctx.fill(path);
    if(stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 3;
        ctx.stroke(path);
    }
}

const VIEW_PADDING = { x: 200, top: 160 };

function renderBubble(ctx: CanvasRenderingContext2D, q: string) {

    let text = q.trim();

    let { txtHeight, txtWidth } = getTextInfos(ctx, text);

    const BUBBLE_PADDING = { x: 110, y: 80 };
    const MAX_WIDTH = 700;

    ctx.fillStyle = colors.text + "00"; // Transparent color
    let renderedText = drawText(ctx, text, { // dummy text (invisible) to get the height
        x: 0, // Horizontal position
        y: 0, // Vertical position
        fontStyle: ctx.font, // Font style
        width: MAX_WIDTH, // Text box width
        height: txtHeight, // Text box height
        align: "left", // Text alignment
    });

    let bubbleWidth = txtWidth + BUBBLE_PADDING.x

    if(text.includes("\n")) {
        let lines = text.split("\n");
        let maxLineWidth = 0;
        for(let line of lines) {
            let { txtWidth } = getTextInfos(ctx, line);
            maxLineWidth = Math.max(maxLineWidth, txtWidth);
        }
        bubbleWidth = maxLineWidth + BUBBLE_PADDING.x;
    }

    bubbleWidth = Math.min(bubbleWidth, MAX_WIDTH + BUBBLE_PADDING.x);
    let bubbleHeight = renderedText.height + BUBBLE_PADDING.y

    drawRoundedRect(
        ctx,
        ctx.canvas.width - (VIEW_PADDING.x + bubbleWidth),
        VIEW_PADDING.top,
        bubbleWidth,
        bubbleHeight,
        60, // Border radius
        colors.bubble // Background color
    );

    ctx.fillStyle = colors.text;
    let textX = VIEW_PADDING.x + BUBBLE_PADDING.x / 2
    drawText(ctx, text, {
        x: ctx.canvas.width - (textX + (bubbleWidth - BUBBLE_PADDING.x)), // Horizontal position
        y: VIEW_PADDING.top + txtHeight / 2 + BUBBLE_PADDING.y / 2 - 5, // Vertical position
        fontStyle: ctx.font, // Font style
        width: MAX_WIDTH, // Text box width
        height: renderedText.height, // Text box height
        align: "left", // Text alignment
    });

    return {
        height: bubbleHeight // arbitrary value
    }
}

const IMAGE_SIZE = 46;

function drawResponse(ctx: CanvasRenderingContext2D, r: string, bubble: BubbleProperties, animation: boolean) {
    ctx.fillStyle = colors.text;
    drawText(ctx, r + (animation ? "●" : ""), {
        x: VIEW_PADDING.x + (IMAGE_SIZE + 90), // Horizontal position
        y: bubble.height + VIEW_PADDING.top + 100, // Vertical position
        fontStyle: ctx.font, // Font style
        width: ctx.canvas.width - VIEW_PADDING.x - 300, // Text box width
        height: 100,
        align: "left", // Text alignment
        vAlign: "top"
    });
}

async function renderImage(ctx: CanvasRenderingContext2D, bubble: BubbleProperties) {
    return new Promise(res => {
        drawRoundedRect(
            ctx, 
            VIEW_PADDING.x - (IMAGE_SIZE / 2), 
            bubble.height + VIEW_PADDING.top + 97 - (IMAGE_SIZE / 2), 
            IMAGE_SIZE * 2, 
            IMAGE_SIZE * 2, 
            IMAGE_SIZE, 
            colors.bg,
            colors.svgBorder
        );
    
        let img = new Image()
        img.src = "/chatgpt.svg";
        img.onload = () => {
            ctx.drawImage(
                img, 
                VIEW_PADDING.x, 
                bubble.height + VIEW_PADDING.top + 97, 
                IMAGE_SIZE, 
                IMAGE_SIZE
            );
            res(true)
        }
    })
}

export function renderResponse(canvas: HTMLCanvasElement, q: string, r: string, animation: boolean) {
    let ctx = canvas.getContext('2d');
    let s = canvas.width;

    if (!ctx) throw new Error("Canvas context not found");

    ctx.fillStyle = colors.bg;
    ctx.fillRect(IMAGE_SIZE + VIEW_PADDING.x + 30, 0, canvas.width, canvas.height);
    ctx.font = `300 ${s/45}px ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol`;

    let bubble: BubbleProperties = renderBubble(ctx, q);
    drawResponse(ctx, r, bubble, animation);
}

export async function renderBubbleAndImage(canvas: HTMLCanvasElement, q: string, image: boolean=true) {
    return new Promise(async res => {
        let ctx = canvas.getContext('2d');
        let s = canvas.width;
    
        if (!ctx) throw new Error("Canvas context not found");
    
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `300 ${s/45}px ui-sans-serif,-apple-system,system-ui,Segoe UI,Helvetica,Apple Color Emoji,Arial,sans-serif,Segoe UI Emoji,Segoe UI Symbol`;
    
        let bubble: BubbleProperties = renderBubble(ctx, q);
        await renderImage(ctx, bubble);
        res(true)
    })
}

export async function testCanvasHeight(canvas: HTMLCanvasElement, q: string, r: string, inAnimation: boolean=false) {
    return new Promise(async res => {
        let ctx = canvas.getContext('2d');
    
        if (!ctx) throw new Error("Canvas context not found");
    
        ctx.fillStyle = colors.bg + "00";
        let txt1 = drawText(ctx, q, {
            x: 0, // Horizontal position
            y: 0,
            fontStyle: ctx.font, // Font style
            width: 700, // Text box width
            height: 100,
            align: "left", // Text alignment
            vAlign: "top"
        });
        let txt2 = drawText(ctx, r, {
            x: 0, // Horizontal position
            y: 0,
            fontStyle: ctx.font, // Font style
            width: ctx.canvas.width - VIEW_PADDING.x - 300, // Text box width
            height: 100,
            align: "left", // Text alignment
            vAlign: "top"
        });
        ctx.canvas.height = txt1.height + txt2.height + 700
    
        await renderBubbleAndImage(canvas, q, true);
        renderResponse(canvas, q, inAnimation ? "" : r, inAnimation);
        res(true)
    })
}