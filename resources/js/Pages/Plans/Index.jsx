import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, usePage } from "@inertiajs/react";

export default function PlansIndex() {
    const { faculties } = usePage().props;
    const [openFaculty, setOpenFaculty] = useState(null);
    const [openDept, setOpenDept] = useState(null);
    const { auth } = usePage().props;
    const roles = auth.user.roles;

    return (
        <AppLayout>
            <Head title="Планы преподавателей" />
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                    Планы преподавателей
                </h1>
                {roles.includes("admin") && (
                    <Link
                        href="/plans/summary"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150 mb-3"
                    >
                        📊 Итог
                    </Link>
                )}
                {faculties.map((faculty) => (
                    <div key={faculty.id} className="mb-4 border rounded-lg">
                        <button
                            onClick={() =>
                                setOpenFaculty(
                                    openFaculty === faculty.id
                                        ? null
                                        : faculty.id
                                )
                            }
                            className="w-full text-left px-4 py-2 bg-gray-100 font-semibold"
                        >
                            🎓 {faculty.name}
                        </button>

                        {openFaculty === faculty.id && (
                            <div className="p-4 space-y-3">
                                {faculty.departments.map((dept) => (
                                    <div
                                        key={dept.id}
                                        className="border rounded"
                                    >
                                        <button
                                            onClick={() =>
                                                setOpenDept(
                                                    openDept === dept.id
                                                        ? null
                                                        : dept.id
                                                )
                                            }
                                            className="w-full text-left px-3 py-2 bg-gray-50"
                                        >
                                            🏛 {dept.name}
                                        </button>

                                        {openDept === dept.id && (
                                            <div className="p-3">
                                                {dept.users.length === 0 ? (
                                                    <p className="text-gray-500 text-sm">
                                                        Нет преподавателей
                                                    </p>
                                                ) : (
                                                    <table className="w-full text-sm border mt-2">
                                                        <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="p-2 text-left">
                                                                    Имя
                                                                </th>
                                                                <th className="p-2 text-left">
                                                                    Email
                                                                </th>
                                                                <th className="p-2 text-left">
                                                                    Роль
                                                                </th>
                                                                <th className="p-2 text-center">
                                                                    Действие
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {dept.users.map(
                                                                (u) => (
                                                                    <tr
                                                                        key={
                                                                            u.id
                                                                        }
                                                                        className="border-t"
                                                                    >
                                                                        <td className="p-2">
                                                                            {
                                                                                u.name
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {
                                                                                u.email
                                                                            }
                                                                        </td>
                                                                        <td className="p-2">
                                                                            {u.roles
                                                                                .map(
                                                                                    (
                                                                                        r
                                                                                    ) =>
                                                                                        r.name
                                                                                )
                                                                                .join(
                                                                                    ", "
                                                                                )}
                                                                        </td>
                                                                        <td className="p-2 text-center">
                                                                            <Link
                                                                                href={`/plans/${u.id}`}
                                                                                className="text-blue-600 hover:text-blue-800 underline"
                                                                            >
                                                                                Смотреть
                                                                                план
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        (window.location.href = `/departments/${dept.id}/export`)
                                                    }
                                                    className="ml-2 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                >
                                                    ⬇️ Скачать отчёт
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
