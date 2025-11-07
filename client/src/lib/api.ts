import API from "./axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllProjectPayloadType,
  AllProjectResponseType,
  AllTaskPayloadType,
  AllTaskResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateProjectPayloadType,
  CreateTaskPayloadType,
  EditTaskPayloadType,
  CreateWorkspaceResponseType,
  EditProjectPayloadType,
  ProjectByIdPayloadType,
  ProjectResponseType,
  CreateContractPayloadType,
  CreateContractResponseType,
  ListContractsResponseType,
  GetContractByIdPayloadType,
  GetContractResponseType,
  SignContractPayloadType,
  FinalizeContractPayloadType,
} from "../types/api.type";
import {
  AllWorkspaceResponseType,
  CreateWorkspaceType,
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  WorkspaceByIdResponseType,
  EditWorkspaceType,
} from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (data: registerType) =>
  await API.post("/auth/register", data);

export const logoutMutationFn = async () => await API.post("/auth/logout");

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };

//********* WORKSPACE ****************
//************* */

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(`/workspace/create/new`, data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: EditWorkspaceType) => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspaceResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<WorkspaceByIdResponseType> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: ChangeWorkspaceMemberRoleType) => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{
  message: string;
  currentWorkspace: string;
}> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};

//*******MEMBER ****************

export const invitedUserJoinWorkspaceMutationFn = async (
  iniviteCode: string
): Promise<{
  message: string;
  workspaceId: string;
}> => {
  const response = await API.post(`/member/workspace/${iniviteCode}/join`);
  return response.data;
};

//********* */
//********* PROJECTS
export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: CreateProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async ({
  projectId,
  workspaceId,
  data,
}: EditProjectPayloadType): Promise<ProjectResponseType> => {
  const response = await API.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data
  );
  return response.data;
};

export const getProjectsInWorkspaceQueryFn = async ({
  workspaceId,
  pageSize = 10,
  pageNumber = 1,
}: AllProjectPayloadType): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${workspaceId}/all?pageSize=${pageSize}&pageNumber=${pageNumber}`
  );
  return response.data;
};

export const getProjectByIdQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<ProjectResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<AnalyticsResponseType> => {
  const response = await API.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async ({
  workspaceId,
  projectId,
}: ProjectByIdPayloadType): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//*******TASKS ********************************
//************************* */

export const createTaskMutationFn = async ({
  workspaceId,
  projectId,
  data,
}: CreateTaskPayloadType) => {
  const response = await API.post(
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};


export const editTaskMutationFn = async ({
  taskId,
  projectId,
  workspaceId,
  data,
}: EditTaskPayloadType): Promise<{message: string;}> => {
  const response = await API.put(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update/`,
    data
  );
  return response.data;
};

export const getAllTasksQueryFn = async ({
  workspaceId,
  keyword,
  projectId,
  assignedTo,
  priority,
  status,
  dueDate,
  pageNumber,
  pageSize,
}: AllTaskPayloadType): Promise<AllTaskResponseType> => {
  const baseUrl = `/task/workspace/${workspaceId}/all`;

  const queryParams = new URLSearchParams();
  if (keyword) queryParams.append("keyword", keyword);
  if (projectId) queryParams.append("projectId", projectId);
  if (assignedTo) queryParams.append("assignedTo", assignedTo);
  if (priority) queryParams.append("priority", priority);
  if (status) queryParams.append("status", status);
  if (dueDate) queryParams.append("dueDate", dueDate);
  if (pageNumber) queryParams.append("pageNumber", pageNumber?.toString());
  if (pageSize) queryParams.append("pageSize", pageSize?.toString());

  const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
  const response = await API.get(url);
  return response.data;
};

export const deleteTaskMutationFn = async ({
  workspaceId,
  taskId,
}: {
  workspaceId: string;
  taskId: string;
}): Promise<{
  message: string;
}> => {
  const response = await API.delete(
    `task/${taskId}/workspace/${workspaceId}/delete`
  );
  return response.data;
};

//*******AI CHAT ********************************
//************************* */

export const chatWithAI = async (data: { message: string }): Promise<{ response: string }> => {
  const response = await API.post(`/ai/chat`, data);
  return response.data;
};

export const getChatHistory = async (): Promise<{
  chatHistory: Array<{
    _id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  }>;
}> => {
  const response = await API.get(`/ai/chat/history`);
  return response.data;
};

export const clearChatHistory = async (): Promise<{ message: string }> => {
  const response = await API.delete(`/ai/chat/history`);
  return response.data;
};

//*******WORKSPACE TEAM CHAT ************************
//***************************************************

export const getWorkspaceChatHistory = async ({
  workspaceId,
  limit,
  cursor,
}: {
  workspaceId: string;
  limit?: number;
  cursor?: string | null;
}): Promise<{
  messages: Array<{
    _id: string;
    content: string;
    createdAt: string;
    senderId: { _id: string; name?: string; email: string; profilePicture?: string | null };
  }>;
  nextCursor: string | null;
}> => {
  const params = new URLSearchParams();
  if (limit) params.append("limit", String(limit));
  if (cursor) params.append("cursor", cursor);
  const qs = params.toString();
  const response = await API.get(`/workspace-chat/${workspaceId}/messages${qs ? `?${qs}` : ""}`);
  return response.data;
};

export const sendWorkspaceChatMessage = async ({
  workspaceId,
  content,
}: {
  workspaceId: string;
  content: string;
}): Promise<{
  message: {
    _id: string;
    content: string;
    createdAt: string;
    senderId: { _id: string; name?: string; email: string; profilePicture?: string | null };
  };
}> => {
  const response = await API.post(`/workspace-chat/${workspaceId}/messages`, { content });
  return response.data;
};

//*******CONTRACTS ********************************
//************************* */

export const createContractMutationFn = async ({
  workspaceId,
  data,
}: CreateContractPayloadType): Promise<CreateContractResponseType> => {
  const response = await API.post(`/contract/workspace/${workspaceId}/create`, data);
  return response.data;
};

export const listContractsQueryFn = async (
  workspaceId: string
): Promise<ListContractsResponseType> => {
  const response = await API.get(`/contract/workspace/${workspaceId}`);
  return response.data;
};

export const getContractByIdQueryFn = async ({
  workspaceId,
  contractId,
}: GetContractByIdPayloadType): Promise<GetContractResponseType> => {
  const response = await API.get(`/contract/${contractId}/workspace/${workspaceId}`);
  return response.data;
};

export const signContractMutationFn = async ({
  workspaceId,
  contractId,
  data,
}: SignContractPayloadType): Promise<{ message: string }> => {
  const response = await API.post(`/contract/${contractId}/workspace/${workspaceId}/sign`, data);
  return response.data;
};

export const finalizeContractMutationFn = async ({
  workspaceId,
  contractId,
}: FinalizeContractPayloadType): Promise<{ message: string }> => {
  const response = await API.post(`/contract/${contractId}/workspace/${workspaceId}/finalize`, {});
  return response.data;
};

export const downloadContractFile = async ({
  workspaceId,
  contractId,
}: FinalizeContractPayloadType): Promise<Blob> => {
  const response = await API.get(`/contract/${contractId}/workspace/${workspaceId}/download`, {
    responseType: "blob",
  });
  return response.data;
};
