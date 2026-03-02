export const LayoutSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <aside className="w-64 border-r bg-card flex-shrink-0 flex flex-col items-start px-4 py-8 h-full z-10 hidden md:flex">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 mb-8 pl-4">
          PortKey
        </h1>
        <nav className="flex flex-col gap-2 w-full text-sm">
          <a
            href="/dashboard"
            className="px-4 py-3 rounded-md hover:bg-secondary hover:text-foreground text-muted-foreground transition-all duration-200 w-full text-left font-medium"
          >
            Overview
          </a>
          <a
            href="/dashboard/shipments"
            className="px-4 py-3 rounded-md hover:bg-secondary hover:text-foreground text-muted-foreground transition-all duration-200 shadow-sm w-full text-left font-medium"
          >
            Shipments
          </a>
          <a
            href="/dashboard/documents"
            className="px-4 py-3 rounded-md hover:bg-secondary hover:text-foreground text-muted-foreground transition-all duration-200 w-full text-left font-medium"
          >
            Documents Vault
          </a>
          <a
            href="/dashboard/settings"
            className="px-4 py-3 rounded-md hover:bg-secondary hover:text-foreground text-muted-foreground transition-all duration-200 w-full text-left font-medium mt-8 border-t border-border pt-4"
          >
            Settings
          </a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-background relative overflow-y-auto">
        <header className="h-16 w-full max-w-7xl mx-auto flex items-center justify-between px-8 z-10">
          <div className="flex-1 md:hidden">
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              PortKey
            </h1>
          </div>
          {children}
        </header>
      </main>
    </div>
  );
};
