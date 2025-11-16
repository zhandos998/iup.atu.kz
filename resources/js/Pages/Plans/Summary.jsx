import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link } from "@inertiajs/react";

export default function Summary({ users }) {
    return (
        <AppLayout>
            <Head title="Итог преподавателей" />
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        📊 Итог преподавателей
                    </h1>
                    <a
                        href="/plans/summary/export"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        ⬇️ Скачать Excel
                    </a>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">#</th>
                                <th className="border p-2 text-left">Имя</th>
                                <th className="border p-2 text-left">
                                    Факультет
                                </th>
                                <th className="border p-2 text-left">
                                    Кафедра
                                </th>
                                <th className="border p-2 text-center">План</th>
                                <th className="border p-2 text-center">Факт</th>
                                <th className="border p-2 text-center">
                                    План (баллы)
                                </th>
                                <th className="border p-2 text-center">
                                    Факт (баллы)
                                </th>
                                <th className="border p-2 text-center">
                                    Действие
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <tr
                                    key={u.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-2 text-gray-600">
                                        {i + 1}
                                    </td>
                                    <td className="p-2">{u.name}</td>
                                    <td className="p-2">{u.faculty}</td>
                                    <td className="p-2">{u.department}</td>
                                    <td className="p-2 text-center font-medium text-blue-700">
                                        {u.plan}
                                    </td>
                                    <td className="p-2 text-center font-medium text-green-700">
                                        {u.fact}
                                    </td>
                                    <td className="p-2 text-center text-blue-900">
                                        {u.plan_points}
                                    </td>
                                    <td className="p-2 text-center text-green-900">
                                        {u.fact_points}
                                    </td>
                                    <td className="p-2 text-center">
                                        <Link
                                            href={`/plans/${u.id}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            🔍 Посмотреть
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
