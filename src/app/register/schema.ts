import { z } from "zod";

export const schemaRegister = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email().nonempty("o email é obrigatório"),
  password: z.string().nonempty("A senha é obrigatória"),
});

export type ISchemaRegisterUser = z.infer<typeof schemaRegister>;
