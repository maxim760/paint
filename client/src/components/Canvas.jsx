import React from "react";
import canvasState from "../store/canvasState";
import { observer } from "mobx-react-lite";
import toolState from "../store/toolState";
import Brush from "../tools/Brush";
import { WIDTH, HEIGHT } from "../constants";

import { useParams } from "react-router-dom";
import Rect from "../tools/Rect";

import axios from "axios";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import { ModalPoint } from "./ModalPoint";

export const Canvas = observer(() => {
  const params = useParams();
  const canvasRef = React.useRef(null);
  const [pressedKeys, setPressedKeys] = React.useState({
    z: false,
    Z: false,
    Control: false,
  });

  const drawHandler = (msg) => {
    const figure = msg.figure;
    const ctx = canvasRef.current.getContext("2d");
    const {
      lineWidth: lineWidthInitial,
      strokeStyle: strokeStyleInitial,
      fillStyle: fillStyleInitial,
      lineCap: lineCapInitial,
      lineJoin: lineJoinInitial,
    } = ctx;
    const { lineWidth, strokeStyle, fillStyle } = msg.ctxProps;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;

    switch (figure.type) {
      case "brush":
        Brush.draw(ctx, figure.x, figure.y);
        break;
      case "rect":
        ctx.lineJoin = "miter";
        Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height);
        break;
      case "circle":
        Circle.staticDraw(ctx, figure.x, figure.y, figure.radius);
        break;
      case "eraser":
        Eraser.draw(ctx, figure.x, figure.y);
        break;
      case "line":
        ctx.lineCap = "square";
        Line.staticDraw(ctx, figure.x,figure.y,figure.startX, figure.startY)
        break;
      case "finish":
        ctx.beginPath();
        break;

      default:
        break;
    }
    ctx.lineWidth = lineWidthInitial;
    ctx.strokeStyle = strokeStyleInitial;
    ctx.fillStyle = fillStyleInitial;
    ctx.lineCap = lineCapInitial;
    ctx.lineJoin = lineJoinInitial;
  };

  React.useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
    axios
      .get(`http://localhost:5000/image?id=${params.id}`)
      .then((response) => {
        const ctx = canvasRef.current.getContext("2d");
        const img = new Image();
        img.src = response.data;
        img.onload = () => {
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        };
      });
  }, []);

  React.useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(`ws://localhost:5000/`);
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);
      toolState.setTool(new Brush(canvasRef.current, socket, params.id));
      socket.onopen = () => {
        console.log("Подключение");
        socket.send(
          JSON.stringify({
            id: params.id,
            username: canvasState.username,
            method: "connection",
          })
        );
      };
      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
          case "connection":
            console.log(`Пользователь ${msg.username} был подключен`);
            break;
          case "draw":
            drawHandler(msg);
            break;
        }
      };
    }
  }, [canvasState.username]);

  React.useEffect(() => {
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseDown = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  };

  const handleMouseUp = () => {
    axios
      .post(`http://localhost:5000/image?id=${params.id}`, {
        img: canvasRef.current.toDataURL(),
      })
      .then((response) => console.log(response.data));
  };

  const handleKeyDown = (e) => {
    const key = e.key;
    e.key.toLowerCase() === "z" && pressedKeys["Control"]  && e.preventDefault();
    e.key.toLowerCase() === "control" && (pressedKeys["Z"] || pressedKeys["z"] )  && e.preventDefault();
    if (["Z", "z", "Control", "Shift"].includes(key)) {
      setPressedKeys((prev) => {
        prev[key] = true;
        return prev;
      });
    }
    if ((pressedKeys["z"] || pressedKeys["Z"]) && pressedKeys["Control"]) {
      pressedKeys["Shift"] && canvasState.redo();
      !pressedKeys["Shift"] && canvasState.undo();
    }
  };
  const handleKeyUp = (e) => {
    if (["Z", "z", "Control", "Shift"].includes(e.key)) {
      setPressedKeys((prev) => {
        prev[e.key] = false;
        return prev;
      });
    }
  };

  return (
    <div className={"canvas"}>
      <ModalPoint />
      <canvas
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
      />
    </div>
  );
});
