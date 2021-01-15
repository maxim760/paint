import Tool from "./Tool";

export default class Circle extends Tool {
  constructor(canvas, socket, id) {
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  getPosition(e) {
    return [e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop];
  }

  getSign(num) {
    if (num > 0) {
      return 1;
    } else if (num < 0) {
      return -1;
    } else {
      return 0;
    }
  }

  mouseUpHandler(e) {
    this.mouseDown = false;
    const { lineWidth, strokeStyle, fillStyle } = this.ctx;
    this.radius &&
      this.socket.send(
        JSON.stringify( {
          method: "draw",
          ctxProps: { lineWidth, strokeStyle, fillStyle },
          id: this.id,
          figure: {
            type: "circle",
            x: this.startX + this.radius * this.getSign(this.difX),
            y: this.startY + this.radius * this.getSign(this.difY),
            radius: this.radius,
          },
        })
      );
    this.radius = null;
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
      const [currentX, currentY] = this.getPosition(e);
      this.difX = currentX - this.startX;
      this.difY = currentY - this.startY;
      this.radius = Math.min(Math.abs(this.difX), Math.abs(this.difY)) / 2;
      this.draw(
        this.startX + this.radius * this.getSign(this.difX),
        this.startY + this.radius * this.getSign(this.difY),
        this.radius
      );
    }
  }

  draw(x, y, r) {
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.stroke();
    };
  }

  static staticDraw(ctx, x, y, r) {
    console.log("static")
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}
