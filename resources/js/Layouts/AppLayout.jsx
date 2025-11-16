import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const roles = auth.user.roles;
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Шапка */}
            <header className="fixed top-0 left-0 w-full bg-white shadow z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-600">
                        Индивидуальный учебный план
                    </h1>

                    <nav className="flex space-x-4">
                        <Link
                            href="/dashboard"
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Главная
                        </Link>

                        {(roles.includes("head") ||
                            roles.includes("dean") ||
                            roles.includes("admin")) && (
                            <Link
                                href="/plans"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Планы
                            </Link>
                        )}

                        {/* Управление правами (только для admin) */}
                        {roles.includes("admin") && (
                            <>
                                <Link
                                    href="/roles"
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    Права
                                </Link>
                                <Link
                                    href="/user-permissions"
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    Пользователи
                                </Link>
                            </>
                        )}

                        <Link
                            href="/profile"
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Профиль
                        </Link>
                    </nav>

                    {auth?.user && (
                        <div className="text-sm text-gray-600">
                            {auth.user.name}
                        </div>
                    )}
                </div>
            </header>

            {/* Контент (растягивается) */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-6 pt-20 w-full">
                {children}
            </main>

            {/* Футер — всегда внизу */}
            <footer className="bg-white border-t">
                <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} iup.atu.kz — Все права
                    защищены.
                </div>
            </footer>
        </div>
    );
}
