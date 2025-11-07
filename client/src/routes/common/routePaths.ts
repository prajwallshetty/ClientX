export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  SIGN_IN: "/",
  SIGN_UP: "/sign-up",
  GOOGLE_OAUTH_CALLBACK: "/google/oauth/callback",
};

export const PROTECTED_ROUTES = {
  WORKSPACE: "/workspace/:workspaceId",
  TASKS: "/workspace/:workspaceId/tasks",
  AI_CHAT: "/workspace/:workspaceId/ai-chat",
  MEMBERS: "/workspace/:workspaceId/members",
  SETTINGS: "/workspace/:workspaceId/settings",
  PROJECT_DETAILS: "/workspace/:workspaceId/project/:projectId",
  INVOICE_CREATE: "/workspace/:workspaceId/invoices/create",
  CONTRACTS: "/workspace/:workspaceId/contracts",
  CONTRACT_CREATE: "/workspace/:workspaceId/contracts/create",
  CONTRACT_DETAILS: "/workspace/:workspaceId/contracts/:contractId",
};

export const BASE_ROUTE = {
  INVITE_URL: "/invite/workspace/:inviteCode/join",
};
