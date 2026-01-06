/**
 * 세션/토큰 추상화
 */

const SESSION_KEY = "auth_token";

export interface Session {
  token: string;
  expiresAt?: number;
}

/**
 * 세션 저장
 */
export function setSession(session: Session): void {
  if (typeof window === "undefined") return;

  if (session.expiresAt) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
}

/**
 * 세션 가져오기
 */
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session: Session = JSON.parse(stored);
    
    // 만료 확인
    if (session.expiresAt && session.expiresAt < Date.now()) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/**
 * 세션 삭제
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * 토큰 가져오기
 */
export function getToken(): string | null {
  const session = getSession();
  return session?.token || null;
}

