import OnboardingFlow from "./ui/OnboardingFlow";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen px-8 py-12 sm:px-20">
      <h1 className="text-2xl sm:text-3xl font-bold">Onboarding</h1>
      <p className="mt-2 text-black/70">Vamos configurar sua experiência inicial.</p>
      <div className="mt-8">
        <OnboardingFlow />
      </div>
    </div>
  );
}


