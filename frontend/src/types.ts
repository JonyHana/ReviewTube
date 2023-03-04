export type T_Review = {
  body: string;
  user: { displayName: string; }
}

export type T_UserInfo = {
  email: string;
  name: string;
};

export type T_UserInfo_Prop = {
  user: T_UserInfo | null;
};
