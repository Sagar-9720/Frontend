import React from "react";
import { Modal } from "../../../components/common/Modal";
import Form, { FormField, FormOption } from "../../../components/common/Form";
import { Region } from "../../../models/entity/Region";
import { Country } from "../../../models/entity/Country";

interface RegionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Record<string, unknown>) => void;
  submitting: boolean;
  editingRegion: Region | null;
  formData: Record<string, unknown>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  countries: Country[];
}

export const RegionFormModal: React.FC<RegionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  editingRegion,
  formData,
  setFormData,
  countries = [],
}) => {
  const countryOptions: FormOption[] = (countries || [])
    .filter((c) => c && typeof c.id !== 'undefined')
    .map((c) => ({ value: c.id as number, label: c.name }));

  const fields: FormField[] = [
    { name: 'name', label: 'Region Name', type: 'text', required: true },
    { name: 'countryId', label: 'Country', type: 'select', required: true, options: countryOptions },
    { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
    { name: 'isActive', label: 'Active', type: 'checkbox' }
  ];

  const handleClose = () => { try { onClose?.(); } catch (e) { console.error(e); } };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingRegion ? "Edit Region" : "Add New Region"}
    >
      <Form
        fields={fields}
        value={formData}
        onChange={setFormData}
        onSubmit={onSubmit}
        submitting={submitting}
        onCancel={handleClose}
        submitLabel={editingRegion ? 'Update Region' : 'Create Region'}
      />
    </Modal>
  );
};
