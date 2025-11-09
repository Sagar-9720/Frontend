import React from 'react';
import { Button } from '../../../components/common/Button';
import { Plus } from 'lucide-react';

interface TripActionsProps {
  onAdd: () => void;
}

export const TripActions: React.FC<TripActionsProps> = ({ onAdd }) => (
  <div className="flex space-x-3">
    <Button onClick={onAdd}>
      <Plus className="w-4 h-4 mr-2" />
      Add Trip
    </Button>
  </div>
);

