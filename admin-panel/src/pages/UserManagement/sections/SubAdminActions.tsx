import React from 'react';
import { Button } from '../../../components/common/Button.tsx';
import { Plus } from 'lucide-react';

interface SubAdminActionsProps {
  onAdd: () => void;
  disabled?: boolean;
}

export const SubAdminActions: React.FC<SubAdminActionsProps> = ({ onAdd, disabled }) => (
  <Button onClick={onAdd} disabled={disabled}>
    <Plus className="w-4 h-4 mr-2"/> Add Sub-Admin
  </Button>
);
