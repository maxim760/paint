import React from "react";
import { useTranslation, Trans } from 'react-i18next';


export const Flags = () => {
  const { t, i18n } = useTranslation(['canvas', 'welcome']);
  const activeLanguage = i18n.language
  const changeToEnglish = () => {
    i18n.changeLanguage("en");
  };
  const changeToRussian = () => {
    i18n.changeLanguage("ru");
  };
  return (
    <div className="icons-svg">
      <button className="svg-button" onClick={changeToRussian}>
        <svg className={`icon-svg ${activeLanguage==="ru" ? "active" : ""}`}>
          <use xlinkHref="#ru" />
        </svg>
      </button>
      <button className="svg-button" onClick={changeToEnglish}>
        <svg className={`icon-svg ${activeLanguage==="en" ? "active" : ""}`}>
          <use xlinkHref="#en" className={"icon-use"} />
        </svg>
      </button>
    </div>
  );
};
