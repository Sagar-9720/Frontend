import React from "react";
import {Edit, Trash2, User as UserIcon} from "lucide-react";
import {Table} from "../../../components/common/Table";
import {User} from "../../../models";
import {Button} from "../../../components/common/Button";

interface SubAdminTableProps {
    subAdmins: User[];
    loading: boolean;
    onEdit: (subAdmin: User) => void;
    onDelete: (subAdminId: number) => void;
}

const getSubAdminColumns = (
    onEdit: (subAdmin: User) => void,
    onDelete: (subAdminId: number) => void
) => {
    try {
        const columns: { key: string; label: string; sortable?: boolean; render?: (value: unknown, row: User) => React.ReactNode }[] = [
            {
                key: "name",
                label: "Name",
                sortable: true,
                render: (value: unknown) => {
                    try {
                        const name = (value as string) || 'N/A';
                        return (
                            <div className="flex items-center">
                                <UserIcon className="w-4 h-4 text-green-600 mr-2"/>
                                <span className="font-medium">{name}</span>
                            </div>
                        );
                    } catch (error) {
                        console.error('Error rendering sub-admin name:', error);
                        return <span className="text-red-500">Error</span>;
                    }
                },
            },
            {
                key: "email",
                label: "Email",
                sortable: true,
                render: (value: unknown) => {
                    try {
                        return <span>{(value as string) || 'N/A'}</span>;
                    } catch (error) {
                        console.error('Error rendering email:', error);
                        return <span className="text-red-500">Error</span>;
                    }
                },
            },
            {
                key: "roles",
                label: "Role",
                sortable: true,
                render: (value: unknown) => {
                    try {
                        return <span>{(value as string) || 'N/A'}</span>;
                    } catch (error) {
                        console.error('Error rendering role:', error);
                        return <span className="text-red-500">Error</span>;
                    }
                },
            },
            {
                key: "createdAt",
                label: "Created",
                sortable: true,
                render: (value: unknown) => {
                    try {
                        const v = value as string | undefined;
                        const label = v ? new Date(v).toLocaleDateString() : 'Unknown';
                        return (
                            <span className="text-gray-600 text-sm">{label}</span>
                        );
                    } catch (error) {
                        console.error('Error rendering created date:', error);
                        return <span className="text-red-500">Error</span>;
                    }
                },
            },
            {
                key: "actions",
                label: "Actions",
                render: (_: unknown, subAdmin: User) => {
                    try {
                        const id = subAdmin?.userId;
                        return (
                            <div className="flex space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        try { onEdit(subAdmin); } catch (error) { console.error('Error in edit handler:', error); }
                                    }}
                                >
                                    <Edit className="w-4 h-4"/>
                                </Button>
                                {id !== undefined && id !== null && (
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => {
                                            try { onDelete(id); } catch (error) { console.error('Error in delete handler:', error); }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </Button>
                                )}
                            </div>
                        );
                    } catch (error) {
                        console.error('Error rendering actions:', error);
                        return <div className="text-red-500">Error</div>;
                    }
                },
            },
        ];
        return columns;
    } catch (error) {
        console.error('Error creating sub-admin columns:', error);
        return [];
    }
};

const SubAdminTable: React.FC<SubAdminTableProps> = ({
    subAdmins,
    loading,
    onEdit,
    onDelete,
}) => {
    try {
        const columns = getSubAdminColumns(onEdit, onDelete);
        const safeSubAdmins = Array.isArray(subAdmins) ? subAdmins : [];

        return (
            <div>
                <Table columns={columns} data={safeSubAdmins} loading={loading} emptyMessage="No sub-admins found"/>
            </div>
        );
    } catch (error) {
        console.error('Error in SubAdminTable component:', error);
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-red-500">Error loading sub-admin table</div>
            </div>
        );
    }
};

export default SubAdminTable;
