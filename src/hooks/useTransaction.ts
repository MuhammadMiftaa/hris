import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type {
  TransactionListResponse,
  TransactionListParams,
  Category,
  CategoryGroup,
} from "@/types/transaction";
import {
  fetchTransactions,
  fetchCategories,
} from "@/lib/wallet-transaction-api";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { getDummyTransactionList, DUMMY_CATEGORIES } from "@/lib/dummy-data";

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** Cursor info cached per page number */
interface CursorInfo {
  cursor: string;
  cursor_amount: number;
  cursor_date: string;
}

/**
 * Bridges page-number UI with cursor-based BFF API.
 *
 * `page` is the 1-based page number used by the UI.
 * Internally, cursor data is cached per-page so that navigating
 * forward/backward works without re-fetching intermediate pages.
 *
 * When filters, sort, search, or page_size change the cursor cache
 * is reset so the user starts from page 1 with a fresh cursor chain.
 */
export function useTransactionList(
  params: TransactionListParams & { page?: number },
) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const page = params.page ?? 1;

  const [state, setState] = useState<AsyncState<TransactionListResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  // Cache: pageNumber → cursor info for that page
  const cursorCacheRef = useRef<Map<number, CursorInfo>>(new Map());

  const fetchRef = useRef(0);
  const paramsRef = useRef(params);
  paramsRef.current = params;
  const pageRef = useRef(page);
  pageRef.current = page;

  // Reset cursor cache when anything other than page changes
  const filterKey = JSON.stringify({
    page_size: params.page_size,
    sort_by: params.sort_by,
    sort_order: params.sort_order,
    search: params.search,
    wallet_id: params.wallet_id,
    category_id: params.category_id,
    category_type: params.category_type,
    date_from: params.date_from,
    date_to: params.date_to,
  });

  const prevFilterKeyRef = useRef(filterKey);
  if (prevFilterKeyRef.current !== filterKey) {
    prevFilterKeyRef.current = filterKey;
    cursorCacheRef.current = new Map();
  }

  const refetch = useCallback(async () => {
    if (isDemo) {
      const data = getDummyTransactionList({
        page: pageRef.current,
        page_size: paramsRef.current.page_size,
        sort_by: paramsRef.current.sort_by,
        sort_order: paramsRef.current.sort_order,
        search: paramsRef.current.search,
      });
      setState({ data, loading: false, error: null });
      return;
    }
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    const currentPage = pageRef.current;
    const { page: _page, ...apiParams } = paramsRef.current;

    // Look up cached cursor for the requested page
    const cached = cursorCacheRef.current.get(currentPage);
    if (cached && currentPage > 1) {
      apiParams.cursor = cached.cursor;
      apiParams.cursor_amount = cached.cursor_amount;
      apiParams.cursor_date = cached.cursor_date;
    }

    try {
      const result = await fetchTransactions(token, apiParams);
      if (id === fetchRef.current) {
        const data = result.data as TransactionListResponse;

        // Cache cursor for the NEXT page
        if (data.has_next && data.next_cursor) {
          cursorCacheRef.current.set(currentPage + 1, {
            cursor: data.next_cursor,
            cursor_amount: data.next_cursor_amount,
            cursor_date: data.next_cursor_date,
          });
        }

        setState({ data, loading: false, error: null });
      }
    } catch (err: unknown) {
      if (id === fetchRef.current) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to fetch transactions";
        setState({ data: null, loading: false, error: message });
      }
    }
  }, [token]);

  useEffect(() => {
    refetch();
  }, [
    params.page,
    params.page_size,
    params.sort_by,
    params.sort_order,
    params.search,
    params.wallet_id,
    params.category_id,
    params.category_type,
    params.date_from,
    params.date_to,
    refetch,
  ]);

  // Highest page number we can navigate to (cursor is cached or it's page 1)
  const maxCachedPage = useMemo(() => {
    if (cursorCacheRef.current.size === 0) return 1;
    return Math.max(1, ...Array.from(cursorCacheRef.current.keys()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data]); // recompute whenever data changes (new cursors cached)

  return { ...state, refetch, maxCachedPage };
}

export function useCategories() {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<Category[]>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (isDemo) {
      setState({ data: DUMMY_CATEGORIES, loading: false, error: null });
      return;
    }
    if (!token) return;

    (async () => {
      try {
        const result = await fetchCategories(token);
        // API returns CategoryGroup[] — flatten into Category[]
        const groups = result.data as unknown as CategoryGroup[];
        const flat: Category[] = [];
        if (Array.isArray(groups)) {
          for (const g of groups) {
            if (!g.categories) continue;
            for (const c of g.categories) {
              flat.push({
                id: c.id,
                name: c.name,
                type: g.type as Category["type"],
                group_name: g.group_name,
              });
            }
          }
        }
        setState({ data: flat, loading: false, error: null });
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to fetch categories";
        setState({ data: null, loading: false, error: message });
      }
    })();
  }, [token, isDemo]);

  return state;
}
