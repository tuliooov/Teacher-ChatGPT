import { IncomingHttpHeaders } from "http";

export enum IStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

export interface HeadersRequest extends IncomingHttpHeaders {
  userid: string;
  usertype: string;
  useremail: string;
  authorization: string;
}