export type T_Review = {
  id: number;
  body: string;
  userId: number;
  user: {
    displayName: string;
    avatarURL: string;
  }
  createdOn: string;
  editedOn: string;

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
  lockEditor: number | null;
  uploadCallback?: Function;
  uploadEditCallback?: Function;
  cancelEditCallback?: Function;
  review?: T_Review;
  index?: number;
}

export type T_UploadReview_FuncParams = {
  body: string,
  id?: number,
  renderIndex?: number
}
