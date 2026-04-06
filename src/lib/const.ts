/**
 * Runtime environment configuration
 * Read from window.__ENV__ injected at container startup.
 * Falls back to localhost for local development.
 */
declare global {
  interface Window {
    __ENV__: {
      AUTH_URL: string;
      BFF_URL: string;
    };
  }
}

export {};

const env = typeof window !== "undefined" ? window.__ENV__ : undefined;

export const AUTH_BASE_URL: string =
  env?.AUTH_URL && env.AUTH_URL !== "$AUTH_URL"
    ? env.AUTH_URL
    : import.meta.env.AUTH_URL || "http://localhost:8080";

export const BFF_BASE_URL: string =
  env?.BFF_URL && env.BFF_URL !== "$BFF_URL"
    ? env.BFF_URL
    : import.meta.env.BFF_URL || "http://localhost:8083";
