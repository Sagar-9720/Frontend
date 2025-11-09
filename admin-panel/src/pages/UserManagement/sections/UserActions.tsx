import React from 'react';
import { ExportCSVButton } from '../../../components/common/ExportCSVButton';

interface UserActionsProps {
  csvData: Array<Record<string, unknown>>;
}

export const UserActions: React.FC<UserActionsProps> = ({ csvData }) => (
  <div className="flex gap-2">
    <ExportCSVButton data={csvData} filename="users.csv" />
  </div>
);

