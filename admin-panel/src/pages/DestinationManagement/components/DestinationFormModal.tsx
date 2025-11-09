import React from "react";
import { Modal } from "../../../components/common/Modal";
import Form, { FormField } from "../../../components/common/Form";
import { Destination } from "../../../models/entity/Destination";

interface DestinationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<Destination>) => void;
  submitting: boolean;
  editingDestination: Destination | null;
  formData: Partial<Destination>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Destination>>>;
}

export const DestinationFormModal: React.FC<DestinationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  editingDestination,
  formData,
  setFormData,
}) => {
  const fields: FormField[] = [
    { name: 'name', label: 'Destination Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3, required: true },
    { name: 'imageUrl', label: 'Destination Image', type: 'image', required: true, uploadProvider: 'server', maxSize: 5 * 1024 * 1024, allowResize: true }
  ];

  const handleClose = () => { try { onClose?.(); } catch (e) { console.error(e); } };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingDestination ? "Edit Destination" : "Add New Destination"}
      size="lg"
    >
      <Form
        fields={fields}
        value={formData}
        onChange={setFormData}
        onSubmit={onSubmit}
        submitting={submitting}
        onCancel={handleClose}
        submitLabel={editingDestination ? 'Update Destination' : 'Create Destination'}
      />
    </Modal>
  );
};
