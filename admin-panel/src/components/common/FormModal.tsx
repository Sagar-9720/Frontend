import React from 'react';
import {Modal} from './Modal';
import {Form} from './Form';

interface FormField {
    name: string;
    label: string;
    type: string;
    required?: boolean;
    rows?: number;
    min?: number;
    componentProps?: Record<string, unknown>;
}

interface FormModalProps<T extends Record<string, unknown>> {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    fields: FormField[];
    value: T;
    onChange: (next: T) => void;
    onSubmit: () => Promise<void> | void;
    submitLabel: string;
    cancelLabel?: string;
    renderExtra?: React.ReactNode; // Custom extra content below fields
}

export function FormModal<T extends Record<string, unknown>>({
                                                                 isOpen,
                                                                 title,
                                                                 onClose,
                                                                 fields,
                                                                 value,
                                                                 onChange,
                                                                 onSubmit,
                                                                 submitLabel,
                                                                 renderExtra,
                                                             }: FormModalProps<T>) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <Form
                fields={fields}
                value={value}
                onChange={onChange}
                onSubmit={async () => {
                    await onSubmit();
                }}
                onCancel={onClose}
                submitLabel={submitLabel}
            />
            {renderExtra && <div className="mt-4">{renderExtra}</div>}
        </Modal>
    );
}

import {useMemo} from 'react';

/** Generic search filter hook
 * @param data Full data array
 * @param searchTerm Raw search string
 * @param keys Keys of the object to search within (string fields only)
 */
export function useSearchFilter<T extends Record<string, unknown>>(data: T[] | undefined, searchTerm: string, keys: (keyof T)[]) {
    return useMemo(() => {
        try {
            if (!Array.isArray(data)) return [] as T[];
            const term = searchTerm.trim().toLowerCase();
            if (!term) return data;
            return data.filter(item => {
                try {
                    return keys.some(k => {
                        const val = item[k];
                        return typeof val === 'string' && val.toLowerCase().includes(term);
                    });
                } catch {
                    return false;
                }
            });
        } catch {
            return [] as T[];
        }
    }, [data, searchTerm, keys]);
}

