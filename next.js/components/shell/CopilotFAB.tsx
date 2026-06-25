'use client';
import { useHrmsStore } from '../../stores/hrmsStore';
import { Sparkles, X } from 'lucide-react';

export function CopilotFAB() {
  const { toggleCopilot, copilotOpen } = useHrmsStore();

  return (
    <button
      className="copilot-fab"
      onClick={toggleCopilot}
      aria-label={copilotOpen ? 'Close HR Copilot' : 'Open HR Copilot'}
      title="HR Copilot — Ask me anything"
    >
      {copilotOpen ? (
        <X size={22} color="white" strokeWidth={2.5} />
      ) : (
        <Sparkles size={22} color="white" strokeWidth={2} />
      )}
    </button>
  );
}
