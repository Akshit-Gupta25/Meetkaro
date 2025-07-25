// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import {
//   CallControls,
//   CallParticipantsList,
//   CallStatsButton,
//   CallingState,
//   PaginatedGridLayout,
//   SpeakerLayout,
//   useCallStateHooks,
//   useCall,
//   ReactionsButton,
//   ScreenShareButton,
//   SpeakingWhileMutedNotification,
//   RecordCallButton,
// } from '@stream-io/video-react-sdk';
// import { useRouter, useSearchParams, useParams } from 'next/navigation';
// import { Users, LayoutList, Copy, MessageCircle } from 'lucide-react';

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from './ui/dropdown-menu';
// import Loader from './Loader';
// import EndCallButton from './EndCallButton';
// import ChatSidebar from './ChatSidebar';
// import LeaveConfirmationModal from './LeaveConfirmationModal';
// import { cn } from '@/lib/utils';
// import { useUser } from '@clerk/nextjs';
// import { Dialog, DialogContent } from './ui/dialog';
// import { Button } from './ui/button';
// import { useToast } from './ui/use-toast';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

// const MeetingRoom = () => {
//   const searchParams = useSearchParams();
//   const isPersonalRoom = !!searchParams.get('personal');
//   const router = useRouter();
//   const call = useCall();
//   const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
//   const [showParticipants, setShowParticipants] = useState(false);
//   const [showMeetingInfo, setShowMeetingInfo] = useState(true);
//   const [showChat, setShowChat] = useState(false);
//   const [showLeaveConfirmation, setShowLeaveConfirmation] = useState(false);
//   const { useCallCallingState, useParticipants } = useCallStateHooks();
//   const { id } = useParams();
//   const { user } = useUser();
//   const { toast } = useToast();
//   // Simplified - no complex participant tracking for now

//   // Cleanup on component unmount - ONLY when component is actually unmounting
//   useEffect(() => {
//     return () => {
//       // Only cleanup when the component is actually being unmounted
//       // Don't cleanup on every call change
//     };
//   }, []);

//   const callingState = useCallCallingState();

//   // Debug: Log the calling state
//   useEffect(() => {
//     console.log('Current calling state:', callingState);
//   }, [callingState]);

//   // Handle different calling states
//   if (callingState === CallingState.JOINING) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center text-white">
//         <div className="text-center">
//           <Loader />
//           <p className="mt-4 text-lg">Joining meeting...</p>
//         </div>
//       </div>
//     );
//   }

//   if (callingState === CallingState.RECONNECTING) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center text-white">
//         <div className="text-center">
//           <Loader />
//           <p className="mt-4 text-lg">Reconnecting...</p>
//         </div>
//       </div>
//     );
//   }

//   if (callingState !== CallingState.JOINED) {
//     return (
//       <div className="flex h-screen w-full items-center justify-center text-white">
//         <div className="text-center">
//           <Loader />
//           <p className="mt-4 text-lg">Connecting to meeting...</p>
//           <p className="mt-2 text-sm opacity-70">State: {callingState}</p>
//         </div>
//       </div>
//     );
//   }

//   const CallLayout = () => {
//     switch (layout) {
//       case 'grid':
//         return <PaginatedGridLayout />;
//       case 'speaker-right':
//         return <SpeakerLayout participantsBarPosition="left" />;
//       default:
//         return <SpeakerLayout participantsBarPosition="right" />;
//     }
//   };

//   const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/meeting/${id}`;

//   const handleLeaveCall = async () => {
//     try {
//       if (call) {
//         await call.camera.disable();
//         await call.microphone.disable();
//         await call.leave();
//       }
//       router.push('/');
//     } catch (error) {
//       console.error('Error leaving call:', error);
//       router.push('/');
//     } finally {
//       setShowLeaveConfirmation(false);
//     }
//   };

//   return (
//     <section className="relative h-screen w-full overflow-hidden pt-4 bg-background text-foreground">
//       <Dialog open={showMeetingInfo} onOpenChange={setShowMeetingInfo}>
//         <DialogContent className="flex w-full max-w-sm flex-col gap-4 rounded-lg p-6 shadow-lg bg-background text-foreground">
//           <div className="flex flex-col gap-4">
//             <h1 className="text-2xl font-bold">Your meeting&apos;s ready</h1>
//             <Button className="w-full rounded">
//               <Users className="mr-2" size={20} /> Add others
//             </Button>
//             <p className="text-sm text-muted-foreground">
//               Or share this meeting link with others
//             </p>
//             <div className="relative flex items-center">
//               <input
//                 className="w-full rounded-lg border border-border bg-muted p-2 pr-10 text-sm"
//                 value={meetingLink}
//                 readOnly
//               />
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <button
//                       className="absolute right-2"
//                       onClick={() => {
//                         navigator.clipboard.writeText(meetingLink);
//                         toast({ title: 'Link Copied' });
//                       }}
//                     >
//                       <Copy size={20} />
//                     </button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Copied</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </div>
//             <span className="text-xs text-muted-foreground">
//               People who use this link must get your permission to join.
//             </span>
//             {user && (
//               <p className="text-xs text-muted-foreground">
//                 Joined as {user.emailAddresses[0].emailAddress}
//               </p>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       <div className={cn(
//         "relative flex size-full items-center justify-center transition-all duration-300",
//         // Desktop: reduce width when chat is open
//         showChat ? "lg:mr-80 xl:mr-80" : "",
//         // Mobile: full width always, chat will overlay
//         "w-full"
//       )}>
//         <div className={cn(
//           "flex size-full items-center",
//           // Responsive max widths
//           "max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[900px] xl:max-w-[1200px]",
//           // Padding adjustments
//           "px-2 sm:px-4 md:px-6"
//         )}>
//           <CallLayout />
//         </div>

//         {/* Participants Panel */}
//         {showParticipants && (
//           <div className={cn(
//             "animate-in fade-in duration-300",
//             // Mobile: overlay panel
//             "absolute right-2 top-2 z-40 md:relative md:right-0 md:top-0",
//             // Desktop: sidebar panel
//             "md:ml-2 h-[calc(100vh-86px)] block",
//             // Width adjustments
//             "w-80 max-w-[90vw] md:w-auto"
//           )}>
//             <CallParticipantsList onClose={() => setShowParticipants(false)} />
//           </div>
//         )}
//       </div>

//       {/* Chat Sidebar */}
//       <ChatSidebar 
//         isOpen={showChat} 
//         onClose={() => setShowChat(false)} 
//         meetingId={id} 
//       />

//       {/* Bottom Call Controls */}
//       <div className={cn(
//         "fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 rounded-2xl bg-muted/70 shadow-lg backdrop-blur",
//         // Responsive padding and spacing
//         "px-3 py-2 sm:px-6 sm:py-3",
//         // Responsive width
//         "w-auto max-w-[90vw] overflow-x-auto scrollbar-hide"
//       )}>
//         <CallControls onLeave={() => setShowLeaveConfirmation(true)} />

//         <DropdownMenu>
//           <DropdownMenuTrigger className="rounded-xl p-2 hover:bg-accent">
//             <LayoutList size={20} />
//           </DropdownMenuTrigger>
//           <DropdownMenuContent className="bg-background border-border">
//             {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
//               <div key={index}>
//                 <DropdownMenuItem
//                   onClick={() =>
//                     setLayout(item.toLowerCase() as CallLayoutType)
//                   }
//                 >
//                   {item}
//                 </DropdownMenuItem>
//                 {index < 2 && <DropdownMenuSeparator />}
//               </div>
//             ))}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         <CallStatsButton />

//         <button onClick={() => setShowParticipants((prev) => !prev)}>
//           <div className="rounded-xl p-2 hover:bg-accent">
//             <Users size={20} />
//           </div>
//         </button>

//         <button
//           onClick={() => setShowChat((prev) => !prev)}
//           className="rounded-xl p-2 hover:bg-accent"
//         >
//           <MessageCircle size={20} />
//         </button>

//         {!isPersonalRoom && <EndCallButton />}
//       </div>

//       {/* Leave Confirmation Modal */}
//       <LeaveConfirmationModal
//         isOpen={showLeaveConfirmation}
//         onClose={() => setShowLeaveConfirmation(false)}
//         onConfirm={handleLeaveCall}
//         isEndingForAll={false}
//       />
//     </section>
//   );
// };

// export default MeetingRoom;

'use client';
import { useState } from 'react';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, LayoutList } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import Loader from './Loader';
import EndCallButton from './EndCallButton';
import { cn } from '@/lib/utils';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const router = useRouter();
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  // for more detail about types of CallingState see: https://getstream.io/video/docs/react/ui-cookbook/ringing-call/#incoming-call-panel
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <Loader />;

  const CallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />;
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'show-block': showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push(/)} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
