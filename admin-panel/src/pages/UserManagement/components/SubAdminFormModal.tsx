import React from "react";
import { Modal } from "../../../components/common/Modal";
import { Input } from "../../../components/common/Input";
import { Button } from "../../../components/common/Button";
import { User } from "../../../models/entity/User";

interface SubAdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: { name: string; email: string; role: string }) => void;
  initialData?: User | null;
}

const SubAdminFormModal: React.FC<SubAdminFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  try {
    const [form, setForm] = React.useState({
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.roles || "Sub Admin"
    });

    // Safe useEffect with error handling
    React.useEffect(() => {
      try {
        setForm({
          name: initialData?.name || "",
          email: initialData?.email || "",
          role: initialData?.roles || "Sub Admin"
        });
      } catch (error) {
        console.error('Error updating form data:', error);
      }
    }, [initialData]);

    // Safe change handler
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      try {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
      } catch (error) {
        console.error('Error handling form change:', error);
      }
    };

    // Safe submit handler
    const handleSubmit = (e: React.FormEvent) => {
      try {
        e.preventDefault();
        
        // Basic validation
        if (!form.name.trim()) {
          alert('Name is required');
          return;
        }
        
        if (!form.email.trim()) {
          alert('Email is required');
          return;
        }
        
        if (!form.email.includes('@')) {
          alert('Please enter a valid email address');
          return;
        }
        
        onSubmit(form);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };

    return (
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          try {
            onClose();
          } catch (error) {
            console.error('Error closing modal:', error);
          }
        }} 
        title={initialData ? "Edit Sub Admin" : "Add Sub Admin"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Sub Admin">Sub Admin</option>
              <option value="Trip Manager">Trip Manager</option>
              <option value="Content Manager">Content Manager</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                try {
                  onClose();
                } catch (error) {
                  console.error('Error in cancel button:', error);
                }
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Create"} Sub Admin</Button>
          </div>
        </form>
      </Modal>
    );
  } catch (error) {
    console.error('Error in SubAdminFormModal component:', error);
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Error">
        <div className="text-red-500 p-4">
          Something went wrong while loading the form
        </div>
      </Modal>
    );
  }
};

export default SubAdminFormModal;
