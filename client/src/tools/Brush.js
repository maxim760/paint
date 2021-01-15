import Tool from "./Tool";
import { WIDTH, HEIGHT } from "../constants";
import toolState from "../store/toolState";

export default class Brush extends Tool {
  name = "brush"
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
    if (toolState.lineWidth) {
      this.lineWidth = toolState.lineWidth;
    }
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  getPosition(e) {
    return [e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop];
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    const {lineWidth, strokeStyle, fillStyle} = this.ctx
    this.socket.send(
      JSON.stringify({
        method: "draw",
        ctxProps: {lineWidth, strokeStyle, fillStyle},
        id: this.id,
        figure: {
          type: "finish",
        },
      })
    );
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    this.ctx.moveTo(...this.getPosition(e));
  }

  mouseMoveHandler(e) {
    const [x, y] = this.getPosition(e);
    if (this.mouseDown) {
      if (x <= 0 || y <= 0 || x >= WIDTH || y >= HEIGHT) {
        this.ctx.beginPath();
        const {lineWidth, strokeStyle, fillStyle} = this.ctx
        this.socket.send(
          JSON.stringify({
            method: "draw",
            ctxProps: {lineWidth, strokeStyle, fillStyle},
            id: this.id,
            figure: {
              type: "finish",
            },
          })
        );
      }
      // this.draw(x, y)
      const { lineWidth, strokeStyle, fillStyle } = this.ctx
      this.socket.send(
        JSON.stringify({
          method: "draw",
          ctxProps: {lineWidth, strokeStyle, fillStyle},
          id: this.id,
          figure: {
            type: this.name,
            x,
            y,
          },
        })
      );
    }
  }

  static draw(ctx, x, y) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
