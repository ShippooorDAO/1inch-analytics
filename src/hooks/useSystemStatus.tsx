import { useState } from 'react';

import { useOneInchAnalyticsAPIContext } from '@/contexts/OneInchAnalyticsAPI/OneInchAnalyticsAPIProvider';

const DISMISSED_MESSAGES_LOCAL_STORAGE_KEY = 'dismissedMessages';

function getPreviouslyDismissedMessages(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const value = localStorage.getItem(DISMISSED_MESSAGES_LOCAL_STORAGE_KEY);
  if (value) {
    return JSON.parse(value);
  }
  return [];
}

function storeDismissedMessage(messages: string[]): void {
  localStorage.setItem(
    DISMISSED_MESSAGES_LOCAL_STORAGE_KEY,
    JSON.stringify(messages)
  );
}

export function useSystemStatus() {
  const { systemStatus } = useOneInchAnalyticsAPIContext();

  const [dismissedMessages, setDismissedMessages] = useState(
    getPreviouslyDismissedMessages()
  );

  const message =
    systemStatus && !dismissedMessages.includes(systemStatus.id)
      ? systemStatus.message
      : undefined;

  const dismissMessage = () => {
    if (!systemStatus) {
      return;
    }
    setDismissedMessages([...dismissedMessages, systemStatus.id]);
    storeDismissedMessage([...dismissedMessages, systemStatus.id]);
  };

  return {
    dismissMessage,
    message,
  };
}
