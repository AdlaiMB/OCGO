import { z } from "zod";

// create a seperate schema for ids to validate they are numeric strings
const userSchema = z.strictObject({
  username: z
    .string()
    .min(1)
    .max(15)
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+]*$/, { error: "Can not contain spaces" })
    .trim(),
  password: z
    .string()
    .min(10, { error: "Must be of a minimum 10 charcters long." })
    .max(16, { error: "Must be shorter than 16 characters." })
    .regex(/[a-z]/, { error: "Must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { error: "Must contain at least one uppercase letter." })
    .regex(/[0-9]/, { error: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      error: "Contain at least one special character.",
    })
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+]*$/, { error: "Can not contain spaces" })
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

export const signInFormSchema = userSchema.omit({ bio: true });

export const IDSchema = z.strictObject({
  id: z.string().regex(/^[0-9]+$/),
});

export const UsernameSchema = z.strictObject({
  name: z.string().min(1).max(15).trim(),
});

export const createErrorMessage = (errors) => {
  const e = new Set();
  let message = "Invalid data in the";

  for (const error of errors) {
    const path = error.path[0];

    if (e.has(path)) {
      continue;
    }

    e.add(path);
    message = message.concat(" ", `${path} field,`);
  }

  return message.concat(" ", "resolve the invalid fields.");
};
