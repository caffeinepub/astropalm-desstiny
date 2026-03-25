import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post, Service, UserProfile } from "../backend";
import { ExternalBlob } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// Re-export Post as BlogPost for component compatibility
export type { Post as BlogPost } from "../backend";
export type { Inquiry } from "../backend";

// ── Services ──────────────────────────────────────────────────────────────────────

export function useGetServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}

// ── Blog Posts ───────────────────────────────────────────────────────────────────

export function useGetAllPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGetAllPostsAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Post[]>({
    queryKey: ["postsAdmin"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPostsAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 1000 * 60,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
      author,
    }: { title: string; content: string; author: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createPost(title, content, author);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["postsAdmin"] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
    }: { id: bigint; title: string; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updatePost(id, title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["postsAdmin"] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deletePost(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["postsAdmin"] });
    },
  });
}

export function usePublishPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      published,
    }: { id: bigint; published: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.publishPost(id, published);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["postsAdmin"] });
    },
  });
}

// ── Inquiries ────────────────────────────────────────────────────────────────────

export function useGetAllInquiries() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInquiries();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 1000 * 60,
  });
}

export function useSubmitInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serviceType,
      visitorName,
      dob,
      tob,
      question,
      pastLifeNotes,
      handPictureFile,
      palmPhotoFiles,
      onProgress,
      relationshipPerson2Name,
      relationshipPerson2Dob,
      relationshipPerson2Tob,
      birthState,
      birthCountry,
      birthCity,
      seedNumber,
    }: {
      serviceType: bigint;
      visitorName: string;
      dob: string;
      tob: string;
      question: string;
      pastLifeNotes: string;
      handPictureFile: File | null;
      palmPhotoFiles?: File[];
      onProgress?: (pct: number) => void;
      relationshipPerson2Name: string | null;
      relationshipPerson2Dob: string | null;
      relationshipPerson2Tob: string | null;
      birthState: string | null;
      birthCountry: string | null;
      birthCity: string | null;
      seedNumber?: bigint | null;
    }) => {
      if (!actor) throw new Error("Actor not available");

      let handBlob: ExternalBlob | null = null;
      if (handPictureFile) {
        const bytes = new Uint8Array(await handPictureFile.arrayBuffer());
        let blob = ExternalBlob.fromBytes(bytes);
        if (onProgress) {
          blob = blob.withUploadProgress(onProgress);
        }
        handBlob = blob;
      }

      const palmPhotoBlobs: Array<ExternalBlob | null> = [];
      if (palmPhotoFiles && palmPhotoFiles.length > 0) {
        const totalFiles = palmPhotoFiles.length;
        for (let i = 0; i < totalFiles; i++) {
          const file = palmPhotoFiles[i];
          const bytes = new Uint8Array(await file.arrayBuffer());
          let blob: ExternalBlob = ExternalBlob.fromBytes(bytes);
          if (onProgress) {
            const fileIndex = i;
            blob = blob.withUploadProgress((pct) => {
              const overall = Math.round(
                ((fileIndex + pct / 100) / totalFiles) * 100,
              );
              onProgress(overall);
            });
          }
          palmPhotoBlobs.push(blob);
        }
      }

      return actor.submitInquiry(
        serviceType,
        visitorName,
        dob,
        tob,
        question,
        pastLifeNotes,
        handBlob,
        palmPhotoBlobs,
        relationshipPerson2Name,
        relationshipPerson2Dob,
        relationshipPerson2Tob,
        birthCountry,
        birthCity,
        birthState,
        seedNumber ?? null,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

export function useDeleteInquiry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteInquiry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
  });
}

// ── Admin Check ────────────────────────────────────────────────────────────────────

export function useCheckAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<boolean>({
    queryKey: ["isAdmin", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 1000 * 60 * 5,
  });
}

// ── User Profile ───────────────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ── Visitor Queries ──────────────────────────────────────────────────────────────────

export function useSubmitVisitorQuery() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      contactInfo,
      message,
    }: { name: string; contactInfo: string; message: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return (actor as any).submitVisitorQuery(name, contactInfo, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitor_queries"] });
    },
  });
}

export function useGetVisitorQueries() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["visitor_queries"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getVisitorQueries?.() ?? [];
    },
    enabled: !!actor && !isFetching && !!identity,
    staleTime: 1000 * 60,
  });
}
