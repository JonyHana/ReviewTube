export type T_Review = {
  id: number;
  body: string;
  userId: number;
  user: {
    displayName: string;
    avatarURL: string;
  }
}

export type T_UserInfo = {
  displayName: string;
  id: number;
};

export type T_UserInfo_Prop = {
  user: T_UserInfo | null;
};

export type T_ReviewEditor_Prop = {
  uploadCallback: Function;
}
