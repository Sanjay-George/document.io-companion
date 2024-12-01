export default function H2({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="my-4 text-4xl font-extrabold
             dark:text-white text-transparent bg-clip-text bg-gradient-to-r
              to-primary from-slate-600">
            {children}
        </h2>
    );
}