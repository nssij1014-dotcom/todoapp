export default function LoginScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-canvas text-center px-4">
      <div className="flex flex-col items-center gap-3">
        <div className="m-stripe h-1 w-16" />
        <h1 className="text-3xl font-bold uppercase tracking-[-0.5px] text-ink">
          할일 + 계획 관리
        </h1>
        <p className="text-sm font-light text-body">
          단기 실행과 장기 목표를 하나로 연결합니다
        </p>
      </div>

      <a
        href="/auth/github"
        className="inline-flex items-center gap-2 border border-primary text-primary px-8 h-12 text-sm font-bold uppercase tracking-[1.5px] hover:bg-primary hover:text-on-primary transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        GitHub로 로그인
      </a>

      <p className="text-xs font-light text-muted max-w-sm">
        로그인하면 나만의 할 일 목록을 만들고 관리할 수 있습니다.
      </p>
    </div>
  );
}
