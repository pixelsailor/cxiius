import { z } from 'zod';

import { AiRequestSchema } from './ai.schemas';

export type AiRequest = z.infer<typeof AiRequestSchema>;
