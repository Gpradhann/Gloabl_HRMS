import { Header } from '../../components/shell/Header';
import { BottomNav } from '../../components/shell/BottomNav';
import { CopilotFAB } from '../../components/shell/CopilotFAB';
import { CopilotDrawer } from '../../components/copilot/CopilotDrawer';
import { PropsWithChildren } from 'react';

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content" id="main-content">
        {children}
      </main>
      <BottomNav />
      <CopilotFAB />
      <CopilotDrawer />
    </div>
  );
}
