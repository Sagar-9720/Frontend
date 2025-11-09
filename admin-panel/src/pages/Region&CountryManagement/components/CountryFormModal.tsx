import React from "react";
import { Modal } from "../../../components/common/Modal";
import Form, { FormField } from "../../../components/common/Form";

interface CountryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, unknown>) => void;
  submitting: boolean;
  formData: Record<string, unknown>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}

export const CountryFormModal: React.FC<CountryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  formData,
  setFormData,
}) => {
  const fields: FormField[] = [
    { name: 'name', label: 'Country Name', type: 'text', required: true }
  ];

  const handleClose = () => {
    try { onClose?.(); } catch (e) { console.error(e); }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Country">
      <Form
        fields={fields}
        value={formData}
        onChange={setFormData}
        onSubmit={onSubmit}
        submitting={submitting}
        onCancel={handleClose}
        submitLabel="Create Country"
      />
    </Modal>
  );
};
