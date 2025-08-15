import CoachRealtime from "./ui/CoachRealtime";

export default function CoachPage() {
  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold">Coach de Conversação</h1>
      <p className="mt-2 text-black/70">Conversação em tempo real com STT + TTS.</p>

      <div className="mt-8">
        <CoachRealtime />
      </div>
    </div>
  );
}


