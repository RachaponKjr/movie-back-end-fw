import z from 'zod';

const ReqCMSSchema = z.object({
  seo_title: z.string().optional(),
  seo_disc: z.string().optional(),
  seo_keyword: z.array(z.string()).optional(),
  facebook: z.string().optional(),
  facebook_url: z.string().optional(),
  tiktok: z.string().optional(),
  tiktok_url: z.string().optional(),
  youtube: z.string().optional(),
  youtube_url: z.string().optional(),
  instagram: z.string().optional(),
  instagram_url: z.string().optional(),
  line: z.string().optional(),
  line_url: z.string().optional(),
  telegram: z.string().optional(),
  telegram_url: z.string().optional(),
  image_banner: z.string().optional(),
  banner_url: z.string().optional(),
  image_advert: z.string().optional(),
  advert_url: z.string().optional(),
});

export type ReqCMS = z.infer<typeof ReqCMSSchema>;
