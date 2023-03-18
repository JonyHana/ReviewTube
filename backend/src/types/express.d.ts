declare global {
  namespace Express {
    interface User {
      displayName: string;
      email: string;
      id: number;
    }
  }
}

export {}
