'use client';

import { useState } from 'react';
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import LeaveConfirmationModal from './LeaveConfirmationModal';

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!call)
    throw new Error(
      'useStreamCall must be used within a StreamCall component.',
    );

  // https://getstream.io/video/docs/react/guides/call-and-participant-state/#participant-state-3
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const handleEndCall = () => {
    setShowConfirmation(true);
  };

  const confirmEndCall = async () => {
    try {
      await call.endCall();
      router.push('/');
    } catch (error) {
      console.error('Error ending call:', error);
      router.push('/');
    } finally {
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <Button onClick={handleEndCall} className="bg-red-500 hover:bg-red-600">
        End call for everyone
      </Button>
      <LeaveConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmEndCall}
        isEndingForAll={true}
      />
    </>
  );
};

export default EndCallButton;
