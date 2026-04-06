import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import type {
  Holiday,
  CreateHolidayPayload,
  UpdateHolidayPayload,
  HolidayListParams,
} from "@/types/holiday";
import {
  fetchHolidays,
  createHoliday as createHolidayApi,
  updateHoliday as updateHolidayApi,
  deleteHoliday as deleteHolidayApi,
} from "@/lib/holiday-api";
import { getDummyHolidays } from "@/lib/dummy";
import toast from "react-hot-toast";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ════════════════════════════════════════════
// useHolidayList — Fetch all holidays
// ════════════════════════════════════════════

export function useHolidayList(params?: HolidayListParams) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Holiday[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({ data: getDummyHolidays(params), loading: false, error: null });
      return;
    }

    // Live mode: fetch from API
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchHolidays(token, params)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err: unknown) => {
        if (id === fetchRef.current) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch holidays";
          setState({ data: null, loading: false, error: message });
        }
      });
  }, [token, isDemo, params?.year, params?.type, params?.branch_id]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

// ════════════════════════════════════════════
// useHolidayMutations — CRUD operations
// ════════════════════════════════════════════

export function useHolidayMutations(onSuccess?: () => void) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [loading, setLoading] = useState(false);

  const createHoliday = useCallback(
    async (payload: CreateHolidayPayload) => {
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
        const res = await createHolidayApi(token, payload);
        toast.success("Hari libur berhasil ditambahkan");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menambahkan hari libur";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const updateHoliday = useCallback(
    async (id: number, payload: UpdateHolidayPayload) => {
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
        const res = await updateHolidayApi(token, id, payload);
        toast.success("Hari libur berhasil diperbarui");
        onSuccess?.();
        return res.data;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal memperbarui hari libur";
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  const deleteHoliday = useCallback(
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
        await deleteHolidayApi(token, id);
        toast.success("Hari libur berhasil dihapus");
        onSuccess?.();
        return true;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Gagal menghapus hari libur";
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, isDemo, onSuccess],
  );

  return { loading, createHoliday, updateHoliday, deleteHoliday };
}
