"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";

import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-prediction";
// import {renderPredictions} from "@/utils/render-predictions";

let detectInterval;

const ObjectDetection = () => {
  const [isLoading, setIsLoading] = useState(true);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  const runCoco = async () => {
    setIsLoading(true);
    console.log("Loading coco SSD model...");
    const net = await cocoSSDLoad();
    console.log("Coco SSD model loaded successfully");
    setIsLoading(false);

    detectInterval = setInterval(() => {
      runObjectDetection(net); // will build this next
    }, 10);
  };

  async function runObjectDetection(net) {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      // find detected objects
      const detectedObjects = await net.detect(
        webcamRef.current.video,
        undefined,
        0.6
      );

        // console.log(detectedObjects);

        const context = canvasRef.current.getContext("2d");      renderPredictions(detectedObjects, context);
    }
  }


  const showmyVideo = () => {
    if (
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      const myVideoWidth = webcamRef.current.video.videoWidth;
      const myVideoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = myVideoWidth;
      webcamRef.current.video.height = myVideoHeight;
    }
    // console.log(webcamRef.current.video.srcObject);
  };

  useEffect(() => {
    runCoco();
    showmyVideo();
  }, []);
  return (
    <div className="mt-8">
      { isLoading?(
        <div className="text-5xl">Loading AI Model</div>
      ):
        <div className="relative flex justify-center items-center  p-1.5 rounded-md">
          {/* {WebCame} */}

          <Webcam
            ref={webcamRef}
            className="rounded-md w-full lg:h-[720px]"
            muted
          ></Webcam>
          {/* {Canvas} */}

          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />
        </div>
      }
    </div>
  );
};

export default ObjectDetection;
