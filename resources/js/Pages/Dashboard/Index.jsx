import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

export default function Dashboard({ categories }) {
    const { auth } = usePage().props;
    const can = (perm) => auth.user.permissions.includes(perm);
    const { data, setData, post, processing } = useForm({});

    const handleSave = (indicatorId) => {
        post(`/indicators/${indicatorId}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Панель преподавателя" />

            {categories.map((cat) => (
                <div
                    key={cat.id}
                    className="mb-10 bg-white shadow rounded-lg p-4"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-3">
                        {cat.name}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Код</th>
                                    <th className="border p-2">Наименование</th>
                                    <th className="border p-2">Ед. изм.</th>
                                    <th className="border p-2">План</th>
                                    <th className="border p-2">Факт</th>
                                    <th className="border p-2">Файлы</th>
                                    <th className="border p-2">Действие</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cat.indicators.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center p-4 text-gray-500"
                                        >
                                            Нет данных
                                        </td>
                                    </tr>
                                )}

                                {cat.indicators.map((ind) => {
                                    const value = ind.values?.[0] || {};
                                    const files = Array.isArray(value.files)
                                        ? value.files
                                        : [];
                                    const perms = ind.permissions || {};

                                    return !ind.unit ? (
                                        <tr key={ind.id}>
                                            <td className="border p-2">
                                                {ind.code}
                                            </td>
                                            <td
                                                className="border p-2"
                                                colSpan="6"
                                            >
                                                {ind.title}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={ind.id}>
                                            <td className="border p-2">
                                                {ind.code}
                                            </td>
                                            <td className="border p-2">
                                                {ind.title}
                                            </td>
                                            <td className="border p-2">
                                                {ind.unit}
                                            </td>

                                            {/* План */}
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    disabled={
                                                        !perms.can_edit_plan
                                                    }
                                                    className={`border rounded px-2 py-1 w-full ${
                                                        !perms.can_edit_plan
                                                            ? "bg-gray-100 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    value={
                                                        data[
                                                            `plan_${ind.id}`
                                                        ] ??
                                                        value.plan ??
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            `plan_${ind.id}`,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>

                                            {/* Факт */}
                                            <td className="border p-2">
                                                <input
                                                    type="text"
                                                    disabled={
                                                        !perms.can_edit_fact
                                                    }
                                                    className={`border rounded px-2 py-1 w-full ${
                                                        !perms.can_edit_fact
                                                            ? "bg-gray-100 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                    value={
                                                        data[
                                                            `fact_${ind.id}`
                                                        ] ??
                                                        value.fact ??
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            `fact_${ind.id}`,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </td>

                                            {/* Файлы */}
                                            <td className="border p-2">
                                                {perms.can_add_files && (
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={(e) =>
                                                            setData(
                                                                `files_${ind.id}`,
                                                                e.target.files
                                                            )
                                                        }
                                                    />
                                                )}

                                                {files.length > 0 && (
                                                    <ul className="mt-2 text-sm text-blue-600 space-y-1">
                                                        {files.map((file) => (
                                                            <li
                                                                key={file.id}
                                                                className="flex justify-between items-center"
                                                            >
                                                                <a
                                                                    href={`/storage/${file.path}`}
                                                                    target="_blank"
                                                                    className="underline hover:text-blue-800"
                                                                >
                                                                    📎{" "}
                                                                    {
                                                                        file.original_name
                                                                    }
                                                                </a>

                                                                {perms.can_delete_files && (
                                                                    <button
                                                                        onClick={() =>
                                                                            router.delete(
                                                                                `/indicator-files/${file.id}`,
                                                                                {
                                                                                    preserveScroll: true,
                                                                                }
                                                                            )
                                                                        }
                                                                        className="text-red-500 hover:text-red-700 ml-2"
                                                                        title="Удалить"
                                                                    >
                                                                        🗑
                                                                    </button>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </td>

                                            {/* Кнопка */}
                                            <td className="border p-2 text-center">
                                                {(perms.can_edit_plan ||
                                                    perms.can_edit_fact ||
                                                    perms.can_add_files) && (
                                                    <button
                                                        onClick={() =>
                                                            handleSave(ind.id)
                                                        }
                                                        disabled={processing}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        Сохранить
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </AppLayout>
    );
}
