import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import type { Wallet, WalletType, WalletSummary } from "@/types/wallet";
import {
  fetchWallets,
  fetchWalletTypes,
  fetchWalletSummary,
} from "@/lib/wallet-transaction-api";
import {
  DUMMY_WALLETS,
  DUMMY_WALLET_TYPES,
  DUMMY_WALLET_SUMMARY,
} from "@/lib/dummy-data";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useWalletList() {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Wallet[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    if (isDemo) {
      setState({ data: DUMMY_WALLETS, loading: false, error: null });
      return;
    }
    if (!token) return;
    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWallets(token)
      .then((res) => {
        if (id === fetchRef.current) {
          setState({ data: res.data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (id === fetchRef.current) {
          setState({ data: null, loading: false, error: err.message });
        }
      });
  }, [token, isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}

export function useWalletTypes() {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<WalletType[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (isDemo) {
      setState({ data: DUMMY_WALLET_TYPES, loading: false, error: null });
      return;
    }
    if (!token) return;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWalletTypes(token)
      .then((res) => {
        setState({ data: res.data, loading: false, error: null });
      })
      .catch((err) => {
        setState({ data: null, loading: false, error: err.message });
      });
  }, [token, isDemo]);

  return state;
}

export function useWalletSummary() {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<WalletSummary>>({
    data: null,
    loading: true,
    error: null,
  });

  const refetch = useCallback(() => {
    if (isDemo) {
      setState({ data: DUMMY_WALLET_SUMMARY, loading: false, error: null });
      return;
    }
    if (!token) return;
    setState((s) => ({ ...s, loading: true, error: null }));

    fetchWalletSummary(token)
      .then((res) => {
        setState({ data: res.data, loading: false, error: null });
      })
      .catch((err) => {
        setState({ data: null, loading: false, error: err.message });
      });
  }, [token, isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
