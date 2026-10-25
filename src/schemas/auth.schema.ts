import * as zod from "zod";






 export const RegisterSchema = zod
  .object({
  name: zod.string()
  .min(3, "Minimum length should be 3")
  .max(15, "Maximum length should be 15"),

    email: zod
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),

    dateOfBirth: zod
      .string()
      .min(1, { message: "Date of birth is required" })
      .refine(
        (dateOfBirthValue) => {
          const userDate = new Date(dateOfBirthValue).getFullYear();
          const nowDate = new Date().getFullYear();

          return nowDate - userDate > 10;
        },
        { message: "User must be at least 10 years old" }
      ),

    gender: zod.enum(["male", "female"], {
      message: "Please select your gender",
    }),

    password: zod
  .string()
  .nonempty({ message: "Password is required" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
  }),

rePassword: zod
  .string()
  .nonempty({ message: "Please confirm your password" }),
  })
.refine((data) => data.password === data.rePassword, {
  message: "Passwords do not match",
  path: ["rePassword"],
});

export type RegisterSchemaType = zod.infer<typeof RegisterSchema>;

////////////////////////////////////////////////////////




 export const LoginSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: zod
    .string()
    .nonempty({ message: "Password is required" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    }),
});

export type LoginSchemaType = zod.infer<typeof LoginSchema>;