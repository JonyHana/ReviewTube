declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      FRONTEND_URL: string;
      SESSION_SECRET_KEY: string;
    }
  }
}

export {}
