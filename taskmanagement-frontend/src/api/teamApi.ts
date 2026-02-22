import axiosInstance from "./axiosInstance"; // ✅ use centralized axios instance
import { API_URL } from "../config/api";

const TEAM_API = `${API_URL}/api/teams`;
// const TEAM_API = "/api/teams";

export interface Team {
  id: number;
  name: string;
  createdBy: number;
}

export interface TeamMemberView extends TeamMember {
  openTasks?: number;
  inProgressTasks?: number;
  doneTasks?: number;
}

export interface TeamMember {
  id: number;
  email: string;
  role: "ADMIN" | "MEMBER";
  status: "INVITED" | "ACTIVE";
}

export interface TeamAuditLog {
  id: number;
  action: string;
  performedBy: number;
  targetUser?: number;
  createdAt: string;
}

export const getTeamAuditLogs = (teamId: number) =>
  axiosInstance.get<TeamAuditLog[]>(`${TEAM_API}/${teamId}/audit`);


export const getMyTeams = (userId: number) =>
  axiosInstance.get<Team[]>(`${TEAM_API}/my-teams`, {
    params: { userId },
  });

export const createTeam = (name: string, createdBy: number) =>
  axiosInstance.post<Team>(`${TEAM_API}/create`, null, {
    params: { name, createdBy },
  });

export const getTeamMembers = (teamId: number) =>
  axiosInstance.get<TeamMember[]>(`${TEAM_API}/${teamId}/members`);

export const inviteMember = (
  teamId: number,
  email: string,
  performedBy: number
) =>
  axiosInstance.put<TeamMember>(`${TEAM_API}/${teamId}/invite`, null, {
    params: { email, performedBy },
  });

export const acceptInvite = (teamId: number, userId: number) =>
  axiosInstance.put<TeamMember>(`${TEAM_API}/${teamId}/accept`, null, {
    params: { userId },
  });

export const removeMember = (
  teamId: number,
  userId: number,
  performedBy: number
) =>
  axiosInstance.delete(`${TEAM_API}/${teamId}/remove-member`, {
    params: { userId, performedBy },
  });

export const changeRole = (
  teamId: number,
  userId: number,
  role: string,
  performedBy: number
) =>
  axiosInstance.put<TeamMember>(`${TEAM_API}/${teamId}/change-role`, null, {
    params: { userId, role, performedBy },
  });
