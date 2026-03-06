import { Header } from '../components/Header';
import { AppShell } from '../components/AppShell';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      <Header />
      <main className="pb-12">
        <AppShell />
      </main>
    </div>
  );
}
