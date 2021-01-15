import React from "react";

import { useTranslation, Trans } from "react-i18next";

import { observer } from "mobx-react-lite";
import { RuFlag } from "../icons/ru";
import { EnFlag } from "../icons/en";
import { Flags } from "./Flags";
import toolState from "../store/toolState";

export const SettingsBar = observer(() => {
  const { t, i18n } = useTranslation(["canvas", "welcome"]);
  return (
    <>
      <div className={"settings-bar"}>
        <label style={{ marginLeft: 10 }} htmlFor="line-width">
          {t("canvas:content.line")}
        </label>
        <input
          onChange={(e) => toolState.setWidth(e.target.value)}
          style={{ margin: "0 10px", width: "75px" }}
          type="range"
          name="width"
          id={"line-width"}
          defaultValue={1}
          min={1}
          max={50}
          step={1}
        />
        <div className={"value-width"}>{toolState.lineWidth}</div>
        <label style={{ marginLeft: 10 }} htmlFor="stroke-color">
          {t("canvas:content.color")}
        </label>
        <input
          onChange={(e) => toolState.setStrokeColor(e.target.value)}
          style={{ margin: "0 10px" }}
          defaultValue="#000000"
          type="color"
          name="stroke"
          id={"stroke-color"}
          className="toolbar__colors"
        />
        <Flags />
      </div>
    </>
  );
});
