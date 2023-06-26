import { ITypeUserEnum } from "@/pages/api/oauth/register"

interface ICrudPermissions {
  view: boolean,
  create: boolean,
  update: boolean,
}
export interface IAlloweds {
  dashboardPage: ICrudPermissions
  clientsPage: ICrudPermissions
  ordersPage: ICrudPermissions & { approve: boolean }
  sellersPage: ICrudPermissions
  productsPage: ICrudPermissions
}

export const getPermissions = (type: string): IAlloweds => {

  return {
    dashboardPage: {
      view: true,
      create: type === ITypeUserEnum.ADMIN,
      update: type === ITypeUserEnum.ADMIN,
    },
    clientsPage: {
      view: type === ITypeUserEnum.ADMIN,
      create: type === ITypeUserEnum.ADMIN,
      update: type === ITypeUserEnum.ADMIN,
    },
    ordersPage: {
      view: true,
      create: true,
      update: true,
      approve: type === ITypeUserEnum.ADMIN,
    },
    sellersPage: {
      view: type === ITypeUserEnum.ADMIN,
      create: type === ITypeUserEnum.ADMIN,
      update: type === ITypeUserEnum.ADMIN,
    },
    productsPage: {
      view: true,
      create: type === ITypeUserEnum.ADMIN,
      update: type === ITypeUserEnum.ADMIN,
    },
  }
}