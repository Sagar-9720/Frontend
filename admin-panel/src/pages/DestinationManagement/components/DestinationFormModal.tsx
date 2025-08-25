import React from "react";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { ImageUpload } from "../../../components/common/ImageUpload";
import { Destination } from "../../../models/entity/Destination";
import { Button } from "../../../components/common/Button";

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
  // Safe form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (onSubmit && formData) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting destination form:', error);
    }
  };

  // Safe input change handler
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (setFormData && e?.target?.value !== undefined) {
        setFormData((prev) => ({ ...prev, name: e.target.value }));
      }
    } catch (error) {
      console.error('Error updating destination name:', error);
    }
  };

  // Safe textarea change handler
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      if (setFormData && e?.target?.value !== undefined) {
        setFormData((prev) => ({
          ...prev,
          description: e.target.value,
        }));
      }
    } catch (error) {
      console.error('Error updating destination description:', error);
    }
  };

  // Safe image upload handler
  const handleImageChange = (url: string) => {
    try {
      if (setFormData && url !== undefined) {
        setFormData((prev) => ({ ...prev, imageUrl: url }));
      }
    } catch (error) {
      console.error('Error updating destination image:', error);
    }
  };

  // Safe close handler
  const handleClose = () => {
    try {
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error closing destination modal:', error);
    }
  };

  try {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingDestination ? "Edit Destination" : "Add New Destination"}
        size="lg"
      >
        <form
          onSubmit={handleFormSubmit}
          className="space-y-4"
        >
          <Input
            label="Destination Name"
            value={formData?.name || ""}
            onChange={handleNameChange}
            required
          />
          {/* TODO: Replace with region/country select if needed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData?.description || ""}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <ImageUpload
            label="Destination Image"
            value={formData?.imageUrl || ""}
            onChange={handleImageChange}
            uploadProvider="server"
            maxSize={5 * 1024 * 1024}
            allowResize={true}
            required
          />

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {editingDestination ? "Update" : "Create"} Destination
            </Button>
          </div>
        </form>
      </Modal>
    );
  } catch (error) {
    console.error('Error rendering DestinationFormModal:', error);
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-2">Failed to load destination form</p>
        <Button onClick={handleClose} variant="outline" size="sm">
          Close
        </Button>
      </div>
    );
  }
};
