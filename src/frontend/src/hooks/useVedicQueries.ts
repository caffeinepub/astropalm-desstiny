import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CHARTS_KEY = "vedic_saved_charts";
const USERS_KEY = "vedic_admin_users";

export interface Chart {
  id: bigint;
  name: string;
  dob: string;
  basicNumber: bigint;
  destinyNumber: bigint;
  chartNumbers: bigint[];
}

function loadCharts(): Chart[] {
  try {
    const raw = localStorage.getItem(CHARTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<{
      id: string;
      name: string;
      dob: string;
      basicNumber: string;
      destinyNumber: string;
      chartNumbers: string[];
    }>;
    return parsed.map((c) => ({
      ...c,
      id: BigInt(c.id),
      basicNumber: BigInt(c.basicNumber),
      destinyNumber: BigInt(c.destinyNumber),
      chartNumbers: c.chartNumbers.map((n) => BigInt(n)),
    }));
  } catch {
    return [];
  }
}

function saveCharts(charts: Chart[]) {
  const serializable = charts.map((c) => ({
    ...c,
    id: c.id.toString(),
    basicNumber: c.basicNumber.toString(),
    destinyNumber: c.destinyNumber.toString(),
    chartNumbers: c.chartNumbers.map((n) => n.toString()),
  }));
  localStorage.setItem(CHARTS_KEY, JSON.stringify(serializable));
}

export function useGetAllCharts() {
  return useQuery<Chart[]>({
    queryKey: ["vedic_charts"],
    queryFn: () => loadCharts(),
  });
}

export function useCreateChart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      dob,
      basicNumber,
      destinyNumber,
      chartNumbers,
    }: {
      name: string;
      dob: string;
      basicNumber: number;
      destinyNumber: number;
      chartNumbers: number[];
    }) => {
      const charts = loadCharts();
      const newChart: Chart = {
        id: BigInt(Date.now()),
        name,
        dob,
        basicNumber: BigInt(basicNumber),
        destinyNumber: BigInt(destinyNumber),
        chartNumbers: chartNumbers.map((n) => BigInt(n)),
      };
      saveCharts([...charts, newChart]);
      return newChart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vedic_charts"] });
    },
  });
}

export function useDeleteChart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const charts = loadCharts().filter((c) => c.id !== id);
      saveCharts(charts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vedic_charts"] });
    },
  });
}

export interface NumerologyUser {
  username: string;
  passwordHash: string;
  sectionLevel: number;
}

function loadUsers(): NumerologyUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as NumerologyUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: NumerologyUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function useLoginUser() {
  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: { username: string; password: string }) => {
      const users = loadUsers();
      const user = users.find((u) => u.username === username);
      if (!user) throw new Error("User not found");
      if (user.passwordHash !== password) throw new Error("Incorrect password");
      return user.sectionLevel;
    },
  });
}

export function useListUsers() {
  return useQuery({
    queryKey: ["vedic_admin", "users"],
    queryFn: () => loadUsers(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      password,
      sectionLevel,
    }: { username: string; password: string; sectionLevel: number }) => {
      const users = loadUsers();
      if (users.find((u) => u.username === username)) {
        throw new Error("User already exists");
      }
      saveUsers([...users, { username, passwordHash: password, sectionLevel }]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vedic_admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (username: string) => {
      saveUsers(loadUsers().filter((u) => u.username !== username));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vedic_admin", "users"] });
    },
  });
}
