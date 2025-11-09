import React from 'react';
import { Modal } from '../../../components/common/Modal';
import { TravelJournalUI } from '../../../DataManagers/travelJournalDataManager';
import { BookOpen, User, Eye, Star } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  journal: TravelJournalUI | null;
}

const TravelJournalViewModal: React.FC<Props> = ({ isOpen, onClose, journal }) => {
  if (!journal) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Journal Details" size="lg">
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">{journal.title}</h3>
        </div>
        <div className="text-gray-700 whitespace-pre-wrap max-h-64 overflow-auto border p-3 rounded bg-gray-50">
          {journal.content || 'No content'}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>By {journal.userName || 'Unknown'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{journal.views || 0} views</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Rating: {journal.rating ?? 0}/5</span>
          </div>
          <div>
            Status: <span className="capitalize">{(journal.status || '').replace('_', ' ')}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TravelJournalViewModal;
