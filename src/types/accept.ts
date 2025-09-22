import z from 'zod';

const ReqAcceptSchama = z.object({
  username: z.string(),
  password: z.string(),
  role: z.enum(['User', 'Admin', 'Owner']).optional(),
});

export type ReqAccept = z.infer<typeof ReqAcceptSchama>;
