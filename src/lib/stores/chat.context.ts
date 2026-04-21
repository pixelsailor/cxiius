import { createContext } from 'svelte';

import type { ChatState } from './chat.svelte';

export const [getChatContext, setChatContext] = createContext<ChatState>();
