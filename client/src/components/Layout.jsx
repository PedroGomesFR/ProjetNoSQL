import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Gamepad2, BarChart2, Github } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-background selection:bg-primary/30">

            {/* Navbar flurtante (Glassmorphism) */}
            <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
                <div className="absolute inset-0 bg-surface/70 backdrop-blur-2xl border-b border-white/5"></div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-blue-600 group-hover:shadow-glow transition-all duration-300">
                                <Gamepad2 size={20} className="text-white" />
                            </div>
                            <span className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">GameVault</span>
                        </Link>

                        {/* Navigation Pills */}
                        <div className="hidden md:flex items-center gap-1 bg-surface-highlight/30 p-1 rounded-full backdrop-blur-md border border-white/5">
                            <Link
                                to="/"
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/')
                                        ? 'bg-surface shadow-sm text-white'
                                        : 'text-text-muted hover:text-text'
                                    }`}
                            >
                                Bibliothèque
                            </Link>
                            <Link
                                to="/stats"
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive('/stats')
                                        ? 'bg-surface shadow-sm text-white'
                                        : 'text-text-muted hover:text-text'
                                    }`}
                            >
                                Analyses
                            </Link>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <a href="#" className="hidden sm:flex items-center gap-2 text-xs text-text-muted hover:text-text transition-colors opacity-70 hover:opacity-100">
                                <Github size={14} />
                                <span>GitHub</span>
                            </a>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent shadow-inner opacity-90 hover:opacity-100 transition-opacity cursor-pointer"></div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 animate-fade-in relative z-10">
                {children}
            </main>

            {/* Footer minimaliste */}
            <footer className="border-t border-white/5 py-12 mt-auto">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <p className="text-sm text-text-muted mb-2">Designed with passion.</p>
                    <p className="text-xs text-text-muted/50">© 2024 GameVault Collection</p>
                </div>
            </footer>

            {/* Background ambient glow */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none -z-0 opacity-50"></div>
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[128px] pointer-events-none -z-0 opacity-40"></div>
        </div>
    );
};

export default Layout;
