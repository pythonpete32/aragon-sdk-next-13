import { ConnectButton } from "@/components/ConnectButton";
import DisplayProposals from "@/components/DisplayProposals";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ConnectButton />
      <DisplayProposals />
    </main>
  );
}
