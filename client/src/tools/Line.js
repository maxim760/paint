import Tool from "./Tool";
import toolState from "../store/toolState";

export default class Line extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
    if (toolState.lineWidth) {
      this.lineWidth = toolState.lineWidth;
    }
    this.ctx.lineCap = "square";
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
    const { lineWidth, strokeStyle, fillStyle } = this.ctx;
    this.x &&
      this.y &&
      this.socket.send(
        JSON.stringify({
          method: "draw",
          ctxProps: { lineWidth, strokeStyle, fillStyle },
          id: this.id,
          figure: {
            type: "line",
            x: this.x,
            y: this.y,
            startX: this.startX,
            startY: this.startY,
          },
        })
      );
    this.x = null;
    this.y = null;
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    this.ctx.beginPath();
    const pos = this.getPosition(e);
    this.startX = pos[0];
    this.startY = pos[1];
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e) {
    if (this.mouseDown) {
      const coords = this.getPosition(e);
      this.x = coords[0];
      this.y = coords[1];
      this.draw(this.x, this.y);
    }
  }

  draw(x, y) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //все очищаю
      // изначально во время первого раза метод дров имадж возвращает пустоту так как сохраненный урл - пустота, потом то что нарсовано
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // наношу на канвас все что созранено уже!!!
      this.ctx.beginPath(); // начинаю рисовать заново , т.е заново для текущего this.saved, который при текущем клике создался
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
    };
  }
  static staticDraw(ctx, x, y, startX, startY) {
    ctx.beginPath(); // начинаю рисовать заново , т.е заново для текущего this.saved, который при текущем клике создался
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
