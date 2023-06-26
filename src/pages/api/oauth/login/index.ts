import { IAlloweds, getPermissions } from './../../../../utils/allowed/index';
import { NextApiHandler } from "next";
import { parseBody } from "@/utils/parseBody";
import prismaClient from "@/lib/prisma";
import { middleware } from "@/utils/helper/middleware";
import { ISchemaLogin } from "@/app/schema";
import bcrypt from "bcryptjs";
import { jwtSystem } from "@/utils/jwt";
import { User } from "@prisma/client";
import { ITypeUserEnum } from '../register';

export const config = {
  api: {
    bodyParser: true,
  },
};

interface IDataRequest {
  email: string;
  password: string;
}


export interface IUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  createdAt: string
  type: ITypeUserEnum;
  updatedAt: string
  permissions: IAlloweds
}


const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    const requestBody = (await parseBody(req)) as any;
    console.log("🚀 ~ file: index.ts:41 ~ consthandler:NextApiHandler= ~ requestBody:", requestBody)

    const { email, password: pass } = requestBody.fields as IDataRequest;

    if (!email || !pass) {
      return res.status(400).json({ error: `Formulário incompleto.` });
    }
    
    const userFound = await prismaClient.user.findFirst({
      where: {
        email,
      },
    });

    if (!userFound) {
      res.status(400).json({ error: `Usuário ${email} não encontrado` });
    } else {

      const checkPassword = bcrypt.compareSync(pass, userFound.password)
      
      if (!checkPassword) {
        res.status(400).json({ error: 'Senha incorreta' });
      }
      
      const {password, ...restUser} = userFound
      const accessToken = await jwtSystem.signAccessToken(restUser)
      const permissions = getPermissions(restUser.type)

      res.json({ done: "ok", data: { ...restUser, accessToken, permissions } });
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
};

export default handler;
