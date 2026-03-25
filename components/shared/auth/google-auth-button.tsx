type GoogleAuthButtonProps = {
  label: string;
  className?: string;
};

export function GoogleAuthButton({
  label,
  className = "",
}: GoogleAuthButtonProps) {
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-3 rounded-2xl border border-current/15 px-4 py-3 text-sm font-semibold transition-colors duration-200 hover:cursor-pointer hover:bg-foreground/6 ${className}`.trim()}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path
          fill="#4285F4"
          d="M21.35 11.1H12v2.98h5.36c-.23 1.51-1.73 4.43-5.36 4.43a5.97 5.97 0 0 1 0-11.94c2.07 0 3.45.88 4.24 1.63l2.9-2.8C17.3 3.69 14.92 2.5 12 2.5a9.5 9.5 0 1 0 0 19c5.48 0 9.12-3.85 9.12-9.28 0-.63-.07-.9-.15-1.12Z"
        />
        <path
          fill="#34A853"
          d="M12 21.5c2.6 0 4.79-.86 6.38-2.33l-3.05-2.36c-.82.56-1.88.95-3.33.95-2.56 0-4.73-1.73-5.5-4.06H3.35v2.54A9.5 9.5 0 0 0 12 21.5Z"
        />
        <path
          fill="#FBBC05"
          d="M6.5 13.7A5.72 5.72 0 0 1 6.2 12c0-.59.1-1.16.28-1.7V7.77H3.35a9.5 9.5 0 0 0 0 8.46L6.5 13.7Z"
        />
        <path
          fill="#EA4335"
          d="M12 6.24c1.45 0 2.75.5 3.78 1.5l2.84-2.76C16.78 3.3 14.6 2.5 12 2.5a9.5 9.5 0 0 0-8.65 5.27l3.13 2.53c.76-2.33 2.94-4.06 5.52-4.06Z"
        />
      </svg>
      {label}
    </button>
  );
}
