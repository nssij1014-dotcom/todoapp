import Image from "next/image";
import { getSessionUser } from "@/lib/session";

export default async function Header() {
  const user = await getSessionUser();

  return (
    <header className="h-16 shrink-0 border-b border-hairline bg-canvas flex items-center justify-between px-6">
      <span className="text-sm font-light text-body">
        단기 실행과 장기 목표를 하나로 연결합니다
      </span>
      {user ? (
        <div className="flex items-center gap-3">
          <Image
            src={user.avatarUrl}
            alt={user.username}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm font-light text-body">{user.username}</span>
          <a
            href="/auth/logout"
            className="text-xs px-4 h-9 inline-flex items-center border border-primary text-primary font-bold uppercase tracking-[1.5px] hover:bg-primary hover:text-on-primary transition-colors"
          >
            로그아웃
          </a>
        </div>
      ) : (
        <a
          href="/auth/github"
          className="text-xs px-4 h-9 inline-flex items-center border border-primary text-primary font-bold uppercase tracking-[1.5px] hover:bg-primary hover:text-on-primary transition-colors"
        >
          GitHub로 로그인
        </a>
      )}
    </header>
  );
}
