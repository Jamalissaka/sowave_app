import * as z from "zod";

export const WaveValidation = z.object({
  wave: z.string().nonempty().min(3, { message: "Minimum 3 charaters" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  wave: z.string().nonempty().min(3, { message: "Minimum 3 charaters" }),
});
