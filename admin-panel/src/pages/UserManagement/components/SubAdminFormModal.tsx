import React from "react";
import {Modal} from "../../../components/common/Modal";
import Form, {FormField} from "../../../components/common/Form";
import {User} from "../../../models/entity/User";

interface SubAdminFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (form: { name: string; email: string; role: string }) => void;
    initialData?: User | null;
}

const SubAdminFormModal: React.FC<SubAdminFormModalProps> = ({isOpen, onClose, onSubmit, initialData}) => {
    const [form, setForm] = React.useState({
        name: initialData?.name || "",
        email: initialData?.email || "",
        role: initialData?.roles || "Sub Admin"
    });

    React.useEffect(() => {
        setForm({
            name: initialData?.name || "",
            email: initialData?.email || "",
            role: initialData?.roles || "Sub Admin"
        });
    }, [initialData]);

    const fields: FormField[] = [
        {name: 'name', label: 'Full Name', type: 'text', required: true},
        {name: 'email', label: 'Email Address', type: 'email', required: true},
        {
            name: 'role', label: 'Role', type: 'select', options: [
                {value: 'Sub Admin', label: 'Sub Admin'},
                {value: 'Trip Manager', label: 'Trip Manager'},
                {value: 'Content Manager', label: 'Content Manager'}
            ]
        }
    ];

    const handleClose = () => {
        try {
            onClose?.();
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (val: typeof form) => {
        // Basic validation can be extended
        if (!val.name.trim()) {
            alert('Name is required');
            return;
        }
        if (!val.email.trim() || !val.email.includes('@')) {
            alert('Valid email required');
            return;
        }
        onSubmit(val);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={initialData ? "Edit Sub Admin" : "Add Sub Admin"}
        >
            <Form
                fields={fields}
                value={form}
                onChange={setForm}
                onSubmit={handleSubmit}
                onCancel={handleClose}
                submitLabel={initialData ? 'Update Sub Admin' : 'Create Sub Admin'}
            />
        </Modal>
    );
};

export default SubAdminFormModal;
