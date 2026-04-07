import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import type {
  PermissionRequest,
  CreatePermissionPayload,
  UpdatePermissionStatusPayload,
  PermissionListParams,
} from "@/types/permission-request";
import {
  fetchPermissionRequests,
  createPermissionRequest as createRequestApi,
  updatePermissionStatus as updateStatusApi,
  deletePermissionRequest as deleteRequestApi,
} from "@/lib/permission-api";
import { getDummyPermissionRequests } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// usePermissionRequestList — Fetch permission requests
// ════════════════════════════════════════════

export function usePermissionRequestList(params?: PermissionListParams) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<PermissionRequest[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyPermissionRequests(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchPermissionRequests(token, paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat data izin";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [token, isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Refetch when params change
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.employee_id, params?.status, params?.permission_type]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// usePermissionRequestMutations — CRUD operations
// ════════════════════════════════════════════

export function usePermissionRequestMutations(onSuccess?: () => void) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createRequest = useCallback(
    async (payload: CreatePermissionPayload) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      setLoading(true);
      try {
        const res = await createRequestApi(token, payload);
        toast.success("Pengajuan izin berhasil dikirim");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal mengajukan izin";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const approveRequest = useCallback(
    async (id: number, notes?: string) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const payload: UpdatePermissionStatusPayload = {
        status: "approved",
        approver_notes: notes,
      };

      setLoading(true);
      try {
        const res = await updateStatusApi(token, id, payload);
        toast.success("Izin disetujui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menyetujui izin";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const rejectRequest = useCallback(
    async (id: number, notes?: string) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const payload: UpdatePermissionStatusPayload = {
        status: "rejected",
        approver_notes: notes,
      };

      setLoading(true);
      try {
        const res = await updateStatusApi(token, id, payload);
        toast.success("Izin ditolak");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menolak izin";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const deleteRequest = useCallback(
    async (id: number) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return false;
      }
      if (!token) {
        toast.error("Authentication required");
        return false;
      }

      setLoading(true);
      try {
        await deleteRequestApi(token, id);
        toast.success("Pengajuan izin berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus pengajuan";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  return {
    loading,
    createRequest,
    approveRequest,
    rejectRequest,
    deleteRequest,
  };
}
