import { ReactElement } from "react";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface SidebarLinkProps {
  text: string;
  Icon: ReactElement;
  to: string;
}
