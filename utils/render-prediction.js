import { throttle } from "lodash";

export const renderPredictions = (predictions, ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const font = "18px Arial";
  ctx.font = font;

  ctx.textBaseLine = "top";
  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];

    const isPerson = prediction.class === "person";
    ctx.fillStyle = isPerson ? "#00FFFF" : "#FF0000";

    ctx.strokeStyle = isPerson ? "#FF0000" : "00FFFF";

    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    //fill the color
    ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`; // Set the fill color to red
    ctx.fillRect(x, y, width, height);

    // Draw the label background.
    ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);

    if(isPerson)
    {
        playAudio();
    }
  });
};

const playAudio = throttle(() => {
    const audio = new Audio("public_pols-aagyi-pols.mp3");
    audio.play().catch((error) => {
        console.error("Error playing audio:", error);
    });
},2000)
