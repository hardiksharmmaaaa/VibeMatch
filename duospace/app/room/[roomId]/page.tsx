import Chat from '@/components/Chat';
import MusicPlayer from '@/components/MusicPlayer';
import TicTacToe from '@/components/TicTacToe';
import RoomHeader from '@/components/RoomHeader';

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-indigo-950/20 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)]">
        <RoomHeader roomId={roomId} />
        
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          {/* Main Chat Area - 2 columns */}
          <div className="lg:col-span-2 h-full min-h-0">
            <Chat roomId={roomId} />
          </div>
          
          {/* Side Panel - 1 column */}
          <div className="flex flex-col gap-6 h-full min-h-0 overflow-y-auto pb-4">
            <div className="h-96 md:h-2/5 shrink-0">
              <MusicPlayer />
            </div>
            <div className="shrink-0">
              <TicTacToe roomId={roomId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
