declare global {
  namespace Express {
    interface User {
      displayName: string;
      email: string;
    }
  }
}

export {}
