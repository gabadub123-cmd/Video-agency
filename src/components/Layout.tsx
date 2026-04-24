import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, header }) => {
  return (
    <div className="min-h-screen bg-apple-offwhite">
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 pb-4">
        <nav className="glass rounded-full px-2 py-2 flex items-center gap-1 shadow-sm">
          {header}
        </nav>
      </header>
      
      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
