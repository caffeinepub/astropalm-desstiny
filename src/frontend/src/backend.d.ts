import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
  __kind__: "Some";
  value: T;
}
export interface None {
  __kind__: "None";
}
export type Option<T> = Some<T> | None;
export declare class ExternalBlob {
  onProgress?: (percentage: number) => void;
  getBytes(): Promise<Uint8Array<ArrayBuffer>>;
  getDirectURL(): string;
  static fromURL(url: string): ExternalBlob;
  static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
  withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Post {
  id: bigint;
  title: string;
  content: string;
  published: boolean;
  createdAt: Time;
  author: string;
}
export interface Service {
  id: bigint;
  fee: bigint;
  name: string;
  description: string;
}
export interface Inquiry {
  id: bigint;
  relationshipPerson2Dob?: string;
  relationshipPerson2Tob?: string;
  dob: string;
  tob: string;
  palmPhotos: Array<ExternalBlob | null>;
  serviceType: bigint;
  birthState?: string;
  relationshipPerson2Name?: string;
  question: string;
  birthCity?: string;
  seedNumber?: bigint;
  submittedAt: Time;
  birthCountry?: string;
  handPictureBlob?: ExternalBlob;
  visitorName: string;
  pastLifeNotes: string;
}
export interface UserProfile {
  name: string;
  email: string;
}
export interface NumerologyUser {
  username: string;
  passwordHash: string;
  sectionLevel: bigint;
}
export declare enum UserRole {
  admin = "admin",
  user = "user",
  guest = "guest",
}
export interface backendInterface {
  assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
  checkAdmin(): Promise<boolean>;
  createPost(
    title: string,
    content: string,
    author: string,
  ): Promise<bigint>;
  deleteInquiry(id: bigint): Promise<void>;
  deletePost(id: bigint): Promise<void>;
  getAllInquiries(): Promise<Array<Inquiry>>;
  getAllPosts(): Promise<Array<Post>>;
  getAllPostsAdmin(): Promise<Array<Post>>;
  getCallerUserProfile(): Promise<UserProfile | null>;
  getCallerUserRole(): Promise<UserRole>;
  getServices(): Promise<Array<Service>>;
  getUserProfile(user: Principal): Promise<UserProfile | null>;
  isCallerAdmin(): Promise<boolean>;
  publishPost(id: bigint, published: boolean): Promise<void>;
  saveCallerUserProfile(profile: UserProfile): Promise<void>;
  submitInquiry(
    serviceType: bigint,
    visitorName: string,
    dob: string,
    tob: string,
    question: string,
    pastLifeNotes: string,
    handPictureBlob: ExternalBlob | null,
    palmPhotos: Array<ExternalBlob | null>,
    relationshipPerson2Name: string | null,
    relationshipPerson2Dob: string | null,
    relationshipPerson2Tob: string | null,
    birthCountry: string | null,
    birthCity: string | null,
    birthState: string | null,
    seedNumber: bigint | null,
  ): Promise<bigint>;
  updatePost(id: bigint, title: string, content: string): Promise<void>;
  // Vedic Numerology user management
  login(username: string, password: string): Promise<bigint>;
  createUser(adminUsername: string, adminPassword: string, username: string, password: string, sectionLevel: bigint): Promise<void>;
  listUsers(adminUsername: string, adminPassword: string): Promise<Array<NumerologyUser>>;
  deleteUser(adminUsername: string, adminPassword: string, username: string): Promise<void>;
}
export interface CreateActorOptions {
  agentOptions?: Record<string, unknown>;
}
export declare function createActor(
  canisterId: string,
  uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: CreateActorOptions,
): Promise<backendInterface>;
