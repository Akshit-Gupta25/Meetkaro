'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface LeaveConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isEndingForAll?: boolean;
}

const LeaveConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isEndingForAll = false,
}: LeaveConfirmationModalProps) => {
  const defaultTitle = isEndingForAll 
    ? "End meeting for everyone?" 
    : "Leave meeting?";
    
  const defaultDescription = isEndingForAll
    ? "This will end the meeting for all participants. This action cannot be undone."
    : "Are you sure you want to leave this meeting? You can rejoin anytime.";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {title || defaultTitle}
          </DialogTitle>
          <DialogDescription className="text-center">
            {description || defaultDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-center">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={isEndingForAll ? "bg-red-500 hover:bg-red-600" : ""}
          >
            {isEndingForAll ? "End for Everyone" : "Leave Meeting"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveConfirmationModal;
