export type T_Review = {
  id: number;
  body: string;
  userId: number;
  user: {
    displayName: string;
    avatarURL: string;
  }

  // Anything below this comment is not part of the schema but used for client interaction.
  isEditing: boolean;
}

export type T_UserInfo = {
  displayName: string;
  id: number;
};

export type T_UserInfo_Prop = {
  user: T_UserInfo | null;
};

export type T_ReviewEditor_Prop = {
  lockEditor: boolean;
  uploadCallback?: Function;
  uploadEditCallback?: Function;
  cancelEditCallback?: Function;
  review?: T_Review;
  index?: number;
}
