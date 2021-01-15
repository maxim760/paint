import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Flags } from "./Flags";
import canvasState from "../store/canvasState";
import { useTranslation, Trans } from 'react-i18next';



export const ModalPoint = () => {
  const { t, i18n } = useTranslation(['canvas', 'welcome']);
  const usernameRef = React.useRef(null)
  const [isVisibleModal, setIsVisibleModal] = React.useState(true)
  const connectionHandler = () => {
    if (usernameRef.current.value.trim()) {
      canvasState.setUsername(usernameRef.current.value);
      setIsVisibleModal(false);
    }
  };

  return (
    <Modal show={isVisibleModal} animation={false} onHide={() => {}}>
      <Modal.Header style={{ display: "flex", alignItems: "center" }}>
        <Modal.Title>{t("welcome:title")}</Modal.Title>
        <Flags />
      </Modal.Header>
      <Modal.Body>
        <input type="text" ref={usernameRef} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={connectionHandler}>
          Войти
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
