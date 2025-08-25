import React from "react";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";

interface CountryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  submitting: boolean;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const CountryFormModal: React.FC<CountryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  formData,
  setFormData,
}) => {
  // Safe form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      
      // Validate form data
      if (!formData?.name?.trim()) {
        alert('Country name is required');
        return;
      }

      if (onSubmit && formData) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting country form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  // Safe input change handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (setFormData && e?.target?.value !== undefined) {
        setFormData({ ...formData, name: e.target.value });
      }
    } catch (error) {
      console.error('Error updating country name:', error);
    }
  };

  // Safe close handler
  const handleClose = () => {
    try {
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error closing country modal:', error);
    }
  };

  try {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Add New Country">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Country Name"
            value={formData?.name || ""}
            onChange={handleNameChange}
            required
          />
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1" disabled={submitting}>
              Create Country
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    );
  } catch (error) {
    console.error('Error rendering CountryFormModal:', error);
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Error">
        <div className="p-4 text-center">
          <p className="text-red-600 mb-2">Failed to load country form</p>
          <Button onClick={handleClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </Modal>
    );
  }
};
