import Tool from "./Tool"
import { WIDTH, HEIGHT } from "../constants"
import toolState from "../store/toolState"
import Brush from "./Brush"

export default class Eraser extends Brush {
  name = "eraser"
  constructor(canvas,socket,id) {
    super(canvas,socket,id)
  }


  static draw(ctx, x, y) {
    ctx.lineTo(x, y)
    ctx.strokeStyle = "#fff"
    ctx.stroke()
  }

}