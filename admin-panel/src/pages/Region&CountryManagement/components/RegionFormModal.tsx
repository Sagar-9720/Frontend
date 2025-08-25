import React from "react";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { Region } from "../../../models/entity/Region";
import { Country } from "../../../models/entity/Country";

interface RegionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  submitting: boolean;
  editingRegion: Region | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
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
  // Safe form submission handler
  const handleFormSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (onSubmit && formData) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting region form:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  // Safe input change handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (setFormData && e?.target?.value !== undefined) {
        setFormData({ ...formData, name: e.target.value });
      }
    } catch (error) {
      console.error('Error updating region name:', error);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      if (setFormData && e?.target?.value !== undefined) {
        setFormData({ ...formData, countryId: e.target.value });
      }
    } catch (error) {
      console.error('Error updating country selection:', error);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      if (setFormData && e?.target?.value !== undefined) {
        setFormData({ ...formData, description: e.target.value });
      }
    } catch (error) {
      console.error('Error updating region description:', error);
    }
  };

  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (setFormData && e?.target?.checked !== undefined) {
        setFormData({ ...formData, isActive: e.target.checked });
      }
    } catch (error) {
      console.error('Error updating region active status:', error);
    }
  };

  // Safe close handler
  const handleClose = () => {
    try {
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error closing region modal:', error);
    }
  };

  try {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={editingRegion ? "Edit Region" : "Add New Region"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            label="Region Name"
            value={formData?.name || ""}
            onChange={handleNameChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              value={formData?.countryId || ""}
              onChange={handleCountryChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a country</option>
              {Array.isArray(countries) && countries.map((country) => {
                try {
                  return (
                    <option key={country?.id || Math.random()} value={country?.id || ""}>
                      {country?.name || "Unknown Country"}
                    </option>
                  );
                } catch (error) {
                  console.error('Error rendering country option:', error);
                  return null;
                }
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData?.description || ""}
              onChange={handleDescriptionChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData?.isActive || false}
              onChange={handleActiveChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-900"
            >
              Active
            </label>
          </div>
          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1" disabled={submitting}>
              {editingRegion ? "Update" : "Create"} Region
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    );
  } catch (error) {
    console.error('Error rendering RegionFormModal:', error);
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Error">
        <div className="p-4 text-center">
          <p className="text-red-600 mb-2">Failed to load region form</p>
          <Button onClick={handleClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </Modal>
    );
  }
};
