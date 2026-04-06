import type {
  Wallet,
  WalletType,
  WalletSummary,
  CreateWalletPayload,
  UpdateWalletPayload,
} from "@/types/wallet";
import type {
  Transaction,
  TransactionListResponse,
  TransactionListParams,
  Category,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  CreateTransferPayload,
  Attachment,
  CreateAttachmentPayload,
} from "@/types/transaction";
import type { ApiResponse, ApiError } from "./api";
import { BFF_BASE_URL } from "./const";

/** Fetch wrapper targeting the BFF */
async function bffCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(`${BFF_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === false) {
    const error: ApiError = {
      statusCode: data.statusCode || response.status,
      message: data.message || "Something went wrong",
    };
    throw error;
  }

  return data as ApiResponse<T>;
}

// ════════════════════════════════════════════
// WALLET API
// ════════════════════════════════════════════

/** GET /wallets — List all user wallets */
export async function fetchWallets(token: string) {
  return bffCall<Wallet[]>("/wallets", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /wallets/summary — Wallet summary (total wallets, balance, txns) */
export async function fetchWalletSummary(token: string) {
  return bffCall<WalletSummary>("/wallets/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /wallets/:id — Single wallet detail */
export async function fetchWalletById(token: string, id: string) {
  return bffCall<Wallet>(`/wallets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /wallets — Create new wallet */
export async function createWallet(
  token: string,
  payload: CreateWalletPayload,
) {
  return bffCall<Wallet>("/wallets", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** PUT /wallets/:id — Update wallet (except balance) */
export async function updateWallet(
  token: string,
  id: string,
  payload: UpdateWalletPayload,
) {
  return bffCall<Wallet>(`/wallets/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /wallets/:id — Delete wallet (balance must be 0) */
export async function deleteWallet(token: string, id: string) {
  return bffCall<{ message: string }>(`/wallets/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /wallet-types — List all wallet types */
export async function fetchWalletTypes(token: string) {
  return bffCall<WalletType[]>("/wallet-types", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// TRANSACTION API
// ════════════════════════════════════════════

/** GET /transactions — List transactions with cursor-based pagination, sorting, filtering */
export async function fetchTransactions(
  token: string,
  params: TransactionListParams,
) {
  const query = new URLSearchParams();
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.sort_order) query.set("sort_order", params.sort_order);
  if (params.search) query.set("search", params.search);
  if (params.wallet_id) query.set("wallet_id", params.wallet_id);
  if (params.category_id) query.set("category_id", params.category_id);
  if (params.category_type) query.set("category_type", params.category_type);
  if (params.date_from) query.set("date_from", params.date_from);
  if (params.date_to) query.set("date_to", params.date_to);
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.cursor_amount)
    query.set("cursor_amount", String(params.cursor_amount));
  if (params.cursor_date) query.set("cursor_date", params.cursor_date);

  return bffCall<TransactionListResponse>(`/transactions?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /transactions/:id — Single transaction detail */
export async function fetchTransactionById(token: string, id: string) {
  return bffCall<Transaction>(`/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** POST /transactions — Create income/expense transaction */
export async function createTransaction(
  token: string,
  payload: CreateTransactionPayload,
) {
  return bffCall<Transaction>("/transactions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** POST /transactions/transfer — Transfer between wallets */
export async function createTransfer(
  token: string,
  payload: CreateTransferPayload,
) {
  return bffCall<{
    from_transaction: Transaction;
    to_transaction: Transaction;
  }>("/transactions/transfer", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /transactions/:id — Delete a transaction */
export async function deleteTransaction(token: string, id: string) {
  return bffCall<{ message: string }>(`/transactions/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** PUT /transactions/:id — Update a transaction */
export async function updateTransaction(
  token: string,
  id: string,
  payload: UpdateTransactionPayload,
) {
  return bffCall<Transaction>(`/transactions/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

// ════════════════════════════════════════════
// CATEGORY API
// ════════════════════════════════════════════

/** GET /categories — List all categories */
export async function fetchCategories(token: string) {
  return bffCall<Category[]>("/categories", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /categories?type=income|expense|fund_transfer */
export async function fetchCategoriesByType(
  token: string,
  type: "income" | "expense" | "fund_transfer",
) {
  return bffCall<Category[]>(`/categories?type=${type}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ════════════════════════════════════════════
// ATTACHMENT API
// ════════════════════════════════════════════

/** POST /attachments — Upload attachment for a transaction */
export async function createAttachment(
  token: string,
  payload: CreateAttachmentPayload,
) {
  return bffCall<Attachment>("/attachments", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

/** DELETE /attachments/:id — Remove attachment */
export async function deleteAttachment(token: string, id: string) {
  return bffCall<{ message: string }>(`/attachments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** GET /attachments/transaction/:transactionId — List attachments for transaction */
export async function fetchAttachmentsByTransaction(
  token: string,
  transactionId: string,
) {
  return bffCall<Attachment[]>(`/attachments/transaction/${transactionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
