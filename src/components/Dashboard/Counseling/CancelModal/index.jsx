import React from "react";
import Modal from "../../../Modal";
import ButtonPrimary from "../../../ButtonPrimary";
import ButtonOutline from "../../../ButtonOutline/index";
import { cancelTransaction } from "../../../../api/transaction";
import ModalConfirm from "../../../ModalConfirm";

const CancelModal = ({ modalState, closeModal, transactionId }) => {
  return (
    <ModalConfirm
      isConfirm={modalState}
      onClose={closeModal}
      messages={"Are you sure want to cancel this counseling’s appoinment?"}
      onSure={() => {
        cancelTransaction(transactionId);
        closeModal();
      }}
    />
  );
};

export default CancelModal;
