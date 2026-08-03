export default function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/80
        ${padding ? 'p-5' : ''}
        ${hover ? 'transition-shadow duration-200 hover:shadow-md dark:hover:shadow-slate-900/50' : 'shadow-sm'}
        ${className}`}
    >
      {children}
    </div>
  );
}
