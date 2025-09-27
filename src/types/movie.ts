import z from 'zod';

export const MovieSchema = z.object({
  id: z.string().uuid().optional(), // UUID, สร้างอัตโนมัติ
  category_id: z.string(),
  movie_name: z.string(),
  duration: z.string().optional(),
  rate: z.number().optional(),
  view: z.number().int().optional(),
  release_year: z.string().optional(),
  film_poster: z.string(), // ควรเป็น URL หรือ path
  tage: z.array(z.string()).default([]), // Array ของ tag
  preview: z.string().optional(),
  langMovie: z.string().optional(),
  status: z.string().optional().nullable(),
  video_url: z.string().optional(),
  video_type: z.string().optional(),
  isShow: z.boolean().optional().default(false),
});

export type Movie = z.infer<typeof MovieSchema>;
