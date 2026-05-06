export type SessionUser = {
  id: number;
  phone: string;
  sessionId: string;
};

export type AppEnv = {
  Variables: {
    user: SessionUser;
  };
};
