import Tool from "./Tool";

export default class Rect extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
    this.ctx.lineJoin = "miter";
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
    this.width && this.height && this.socket.send(
      JSON.stringify({
        method: "draw",
        ctxProps: { lineWidth, strokeStyle, fillStyle },
        id: this.id,
        figure: {
          type: "rect",
          x: this.startX,
          y: this.startY,
          width: this.width,
          height: this.height,
        },
      })
    );
    this.width = null;
    this.height = null;
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
      let [currentX, currentY] = this.getPosition(e);
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;
      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }

  draw(x, y, w, h) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //все очищаю
      // изначально во время первого раза метод дров имадж возвращает пустоту так как сохраненный урл - пустота, потом то что нарсовано
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height); // наношу на канвас все что созранено уже!!!
      this.ctx.beginPath(); // начинаю рисовать заново , т.е заново для текущего this.saved, который при текущем клике создался
      this.ctx.rect(x, y, w, h);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }
  static staticDraw(ctx, x, y, w, h) {
    ctx.beginPath(); // начинаю рисовать заново , т.е заново для текущего this.saved, который при текущем клике создался
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
  }
}
