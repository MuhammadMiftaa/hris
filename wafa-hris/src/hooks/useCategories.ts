import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDemo } from "@/contexts/DemoContext";
import { fetchUserTransactions } from "@/lib/dashboard-api";
import { fetchCategories } from "@/lib/wallet-transaction-api";
import { getDummyCategoryBreakdown } from "@/lib/dummy-data";
import type { CategoryBreakdownItem, DateRange } from "@/types/dashboard";
import type { CategoryGroup } from "@/types/transaction";

// ── Generic async state ──

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// ── Global filter state ──

export interface CategoriesFilter {
  walletID: string; // "" = all wallets
  range?: DateRange;
}

// ── Categories Hook ──
// Fetches all transaction categories and computes percentage for each category
// based on the total amount within the selected category type (income/expense).
// Also fetches category metadata from /categories endpoint to get group_name.

export function useCategories(
  filter: CategoriesFilter,
  categoryType: "expense" | "income",
) {
  const { token } = useAuth();
  const { isDemo } = useDemo();
  const [state, setState] = useState<AsyncState<CategoryBreakdownItem[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchRef = useRef(0);

  const refetch = useCallback(() => {
    // Demo mode: use dummy data
    if (isDemo) {
      setState({
        data: getDummyCategoryBreakdown(categoryType),
        loading: false,
        error: null,
      });
      return;
    }

    // Live mode: fetch from API
    if (!token) return;

    const id = ++fetchRef.current;
    setState((s) => ({ ...s, loading: true, error: null }));

    const dateOption = filter.range
      ? { range: filter.range }
      : ({} as { range?: DateRange });

    // Fetch both transaction data and category metadata in parallel
    Promise.all([
      fetchUserTransactions(token, {
        walletID: filter.walletID || undefined,
        dateOption,
      }),
      fetchCategories(token),
    ])
      .then(([transactionsRes, categoriesRes]) => {
        if (id !== fetchRef.current) return;

        // Build a map of category_id -> group_name from categories endpoint
        // API returns CategoryGroup[] structure
        const categoryGroupMap = new Map<string, string>();
        const groups = categoriesRes.data as unknown as CategoryGroup[];
        if (Array.isArray(groups)) {
          for (const group of groups) {
            if (!group.categories) continue;
            for (const cat of group.categories) {
              categoryGroupMap.set(cat.id, group.group_name);
            }
          }
        }

        // Client-side filter by category type (exclude fund_transfer)
        const filtered = (transactionsRes.data ?? []).filter(
          (t) => t.category_type === categoryType,
        );

        // Calculate total amount for percentage computation
        const totalAmount = filtered.reduce(
          (sum, t) => sum + t.total_amount,
          0,
        );

        // Map to CategoryBreakdownItem with percentage and merged group_name
        const categories: CategoryBreakdownItem[] = filtered.map((t) => ({
          category_id: t.category_id,
          category_name: t.category_name,
          category_type: categoryType,
          group_name: categoryGroupMap.get(t.category_id) ?? "",
          total_amount: t.total_amount,
          total_transactions: t.total_transactions,
          percentage:
            totalAmount > 0 ? (t.total_amount / totalAmount) * 100 : 0,
        }));

        setState({ data: categories, loading: false, error: null });
      })
      .catch((err) => {
        if (id === fetchRef.current)
          setState({ data: null, loading: false, error: err.message });
      });
  }, [token, filter.walletID, filter.range, categoryType, isDemo]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
