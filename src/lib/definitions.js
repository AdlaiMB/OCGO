import { z } from "zod";

// create a seperate schema for ids to validate they are numeric strings
const userSchema = z.strictObject({
  username: z.string().min(1).max(15).trim(),
  password: z
    .string()
    .min(10)
    .max(16)
    .regex(/[a-z]/, { error: "Contain at least one lowercase letter." })
    .regex(/[A-Z]/, { error: "Contain at least one uppercase letter." })
    .regex(/[0-9]/, { error: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .trim(),
  bio: z.string().trim(),
});

export const commentSchema = z.strictObject({
  comment: z.string().min(1).trim(),
});

const locationSchema = z.strictObject({
  name: z.string().min(1).trim(),
  city: z.enum([
    "aliso viejo",
    "anaheim",
    "brea",
    "buena park",
    "costa mesa",
    "cypress",
    "dana point",
    "fountain valley",
    "fullerton",
    "garden grove",
    "huntington beach",
    "irvine",
    "la habra",
    "la palma",
    "laguna beach",
    "laguna hills",
    "laguna niguel",
    "laguna woods",
    "lake forest",
    "los alamitos",
    "mission viejo",
    "newport beach",
    "orange",
    "placentia",
    "rancho santa margarita",
    "san clemente",
    "san juan capistrano",
    "santa ana",
    "seal beach",
    "stanton",
    "tustin",
    "villa park",
    "westminster",
    "yorba linda",
  ]),
  category: z.enum([
    "fast food",
    "restaurant",
    "aquarium",
    "zoo",
    "museum",
    "mall",
    "library",
    "park",
    "public",
    "government",
  ]),
  address: z.string().trim(),
  url: z.url(),
  description: z.string().trim(),
});

export const hourSchema = z.strictObject({
  day: z.enum([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]),
  open: z.iso.time(),
  close: z.iso.time(),
});

export const voteSchema = z.strictObject({
  vote: z.enum(["upvote", "downvote"]),
});

export const signUpUserFormSchema = userSchema.partial({ bio: true });
export const updateUserFormSchema = userSchema.partial({ password: true });

export const updateLocationFormSchema = locationSchema.partial({
  description: true,
  url: true,
});

export const signInFormSchema = z.strictObject({
  username: z.string().trim(),
  password: z.string().trim(),
});

export const IDSchema = z.strictObject({
  id: z.string().regex(/^[0-9]+$/),
});
