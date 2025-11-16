import React from "react";
import { Link, usePage, router } from "@inertiajs/react";

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
            <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">
                        Индивидуальный план
                    </h1>

                    <nav className="flex space-x-4">
                        {(roles.includes("head") ||
                            roles.includes("dean") ||
                            roles.includes("admin")) && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    Главная
                                </Link>
                                <Link
                                    href="/plans"
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    Планы
                                </Link>
                                <Link
                                    href="/user-permissions"
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    Пользователи
                                </Link>
                            </>
                        )}

                        {roles.includes("admin") && (
                            <>
                                <Link
                                    href="/roles"
                                    className="text-gray-700 hover:text-blue-600"
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
                                className="text-sm text-gray-700 font-medium hover:text-blue-600"
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
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} iup.atu.kz — Все права защищены.
                </div>
            </footer>
        </div>
    );
}
