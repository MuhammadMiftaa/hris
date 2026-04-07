import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import type {
  OvertimeRequest,
  CreateOvertimePayload,
  UpdateOvertimeStatusPayload,
  OvertimeListParams,
} from "@/types/overtime";
import {
  fetchOvertimeRequests,
  createOvertimeRequest as createOvertimeApi,
  updateOvertimeStatus as updateStatusApi,
  deleteOvertimeRequest as deleteOvertimeApi,
} from "@/lib/overtime-api";
import { getDummyOvertimeRequests } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useOvertimeList — Fetch overtime requests
// ════════════════════════════════════════════

export function useOvertimeList(params?: OvertimeListParams) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<OvertimeRequest[]>>({
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
        data: getDummyOvertimeRequests(paramsRef.current),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchOvertimeRequests(token, paramsRef.current)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Gagal memuat data lembur";
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
  }, [params?.employee_id, params?.status]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useOvertimeMutations — CRUD operations
// ════════════════════════════════════════════

export function useOvertimeMutations(onSuccess?: () => void) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createOvertime = useCallback(
    async (payload: CreateOvertimePayload) => {
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
        const res = await createOvertimeApi(token, payload);
        toast.success("Pengajuan lembur berhasil dikirim");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal mengajukan lembur";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const approveOvertime = useCallback(
    async (id: number, notes?: string) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const payload: UpdateOvertimeStatusPayload = {
        status: "approved",
        approver_notes: notes,
      };

      setLoading(true);
      try {
        const res = await updateStatusApi(token, id, payload);
        toast.success("Lembur disetujui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menyetujui lembur";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const rejectOvertime = useCallback(
    async (id: number, notes?: string) => {
      if (isDemo) {
        toast("Demo mode — data is read-only", { icon: "🔒" });
        return null;
      }
      if (!token) {
        toast.error("Authentication required");
        return null;
      }

      const payload: UpdateOvertimeStatusPayload = {
        status: "rejected",
        approver_notes: notes,
      };

      setLoading(true);
      try {
        const res = await updateStatusApi(token, id, payload);
        toast.success("Lembur ditolak");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menolak lembur";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const deleteOvertime = useCallback(
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
        await deleteOvertimeApi(token, id);
        toast.success("Pengajuan lembur berhasil dihapus");
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
    createOvertime,
    approveOvertime,
    rejectOvertime,
    deleteOvertime,
  };
}
