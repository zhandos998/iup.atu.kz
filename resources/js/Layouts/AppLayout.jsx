import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const roles = auth.user ? auth.user.roles : [];

    const [menuOpen, setMenuOpen] = React.useState(false);

    const logout = (e) => {
        e.preventDefault();
        router.post("/logout");
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Шапка */}
            <header
                className="fixed top-0 left-0 w-full shadow z-50 text-white"
                style={{ backgroundColor: "#21397D" }}
            >
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                    </Link>

                    <nav className="flex space-x-4">
                        {(roles.includes("head") ||
                            roles.includes("dean") ||
                            roles.includes("admin")) && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="hover:text-gray-200"
                                >
                                    Главная
                                </Link>
                                <Link
                                    href="/plans"
                                    className="hover:text-gray-200"
                                >
                                    Планы
                                </Link>
                                <Link
                                    href="/user-permissions"
                                    className="hover:text-gray-200"
                                >
                                    Пользователи
                                </Link>
                            </>
                        )}

                        {roles.includes("admin") && (
                            <>
                                <Link
                                    href="/roles"
                                    className="hover:text-gray-200"
                                >
                                    Права
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Профильное выпадающее меню */}
                    {auth?.user && (
                        <div className="relative">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-sm font-medium hover:text-gray-200"
                            >
                                {auth.user.name} ▾
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md py-1 z-50">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Мой профиль
                                    </Link>

                                    {/* <Link
                                        href="/settings"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Настройки
                                    </Link> */}

                                    <form onSubmit={logout}>
                                        <button
                                            type="submit"
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Выйти
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Контент */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-6 pt-20 w-full">
                {children}
            </main>

            {/* Футер */}
            <footer
                className="bg-white border-t"
                style={{ backgroundColor: "#21397D" }}
            >
                <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-200">
                    © {new Date().getFullYear()} iup.atu.kz — Все права
                    защищены.
                </div>
            </footer>
        </div>
    );
}
