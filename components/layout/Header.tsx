import Image from "next/image";
import { getSessionUser } from "@/lib/session";

export default async function Header() {
  const user = await getSessionUser();

  return (
    <header className="h-14 shrink-0 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-6">
      <span className="text-sm text-black/60 dark:text-white/60">
        단기 실행과 장기 목표를 하나로 연결합니다
      </span>
      {user ? (
        <div className="flex items-center gap-3">
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="text-sm text-black/60 dark:text-white/60">{user.username}</span>
          <a
            href="/auth/logout"
            className="text-sm px-2 py-1 rounded border border-black/15 dark:border-white/15"
          >
            로그아웃
          </a>
        </div>
      ) : (
        <a
          href="/auth/github"
          className="text-sm px-2 py-1 rounded border border-black/15 dark:border-white/15"
        >
          GitHub로 로그인
        </a>
      )}
    </header>
  );
}
