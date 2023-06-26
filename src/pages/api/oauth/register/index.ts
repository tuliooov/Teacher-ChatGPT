import { NextApiHandler } from "next";
import { parseBody } from "@/utils/parseBody";
import prismaClient from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { jwtSystem } from "@/utils/jwt";
import { getPermissions } from "@/utils/allowed";

export const config = {
  api: {
    bodyParser: true,
  },
};

interface IDataRequest {
  email: string;
  name: string;
  password: string;
}

export enum ITypeUserEnum {
  "ADMIN" = "ADMIN",
  "SELLER" = "SELLER"
}

export const findUser = async (email: string, res: any) => {
  const userFound = await prismaClient.user.findFirst({
    where: {
      email,
    },
  });
  if (userFound) {
    console.log("🚀 ~ file: index.ts:32 ~ findUser ~ userFound:", userFound)
    return res.status(400).json({ error: `Usuãrio ${email} ja existe` });
  }
};

export const createUser = async (
  pass: string,
  name: string,
  email: string,
  type: ITypeUserEnum,
  res: any
) => {
  console.log(!email , !pass , !name , !type)
  if (!email || !pass || !name || !type) {
    return res.status(400).json({ error: `Formulário incompleto.` });
  }

  
  await findUser(email, res);

  const passwordCript = bcrypt.hashSync(pass, 8);

  const userCreated = await prismaClient.user.create({
    data: {
      email,
      password: passwordCript,
      name,
      type,
    },
  });
  console.log("🚀 ~ file: index.ts:61 ~ userCreated:", userCreated)
  const { password, ...restUser } = userCreated;

  const accessToken = await jwtSystem.signAccessToken(restUser);
  const permissions = getPermissions(restUser.type)

  return res.json({ done: "ok", data: { ...restUser, accessToken, permissions } });
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const requestBody = (await parseBody(req)) as any;
    console.log("🚀 ~ file: index.ts:73 ~ consthandler:NextApiHandler= ~ requestBody:", requestBody)

    const { email, password: pass, name } = requestBody.fields as IDataRequest;

    await createUser(pass, name, email, ITypeUserEnum.ADMIN, res);
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
};

export default handler;
