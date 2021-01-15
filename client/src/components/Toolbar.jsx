import React from "react";
import "../styles/app.css";
import toolState from "../store/toolState";
import canvasState from "../store/canvasState";
import Brush from "../tools/Brush";
import Rect from "../tools/Rect";
import Circle from "../tools/Circle";
import Eraser from "../tools/Eraser";
import Line from "../tools/Line";
import { observer } from "mobx-react-lite";

export const Toolbar = observer(() => {
  const activeTool = toolState.tool
  const changeColor = (e) => {
    toolState.setStrokeColor(e.target.value)
    toolState.setFillColor(e.target.value)
  }
  const download = () => {
    const dataUrl = canvasState.canvas.toDataURL()
    const a = document.createElement("a")
    a.download = `${canvasState.sessionId}.jpg`
    a.href = dataUrl
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  return (
    <div className={"toolbar"}>
      <button className={`toolbar__btn brush ${activeTool instanceof Brush && !(activeTool instanceof Eraser) ? "active" : ""}`} onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
      <button className={`toolbar__btn rect ${activeTool instanceof Rect ? "active" : ""}`} onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
      <button className={`toolbar__btn circle ${activeTool instanceof Circle ? "active" : ""}`} onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
      <button className={`toolbar__btn eraser ${activeTool instanceof Eraser ? "active" : ""}`} onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
      <button className={`toolbar__btn line ${activeTool instanceof Line ? "active" : ""}`} onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
      <input onChange={changeColor} type="color" name="color" className="toolbar__colors" />
      <button className="toolbar__btn undo" onClick={() => canvasState.undo()}  />
      <button className="toolbar__btn redo" onClick={() => canvasState.redo()}  />
      <button className="toolbar__btn save" onClick={download} />
    </div>
  );
});
