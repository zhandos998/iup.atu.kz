import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";

export default function PermissionsIndex({ permissions }) {
    const { data, setData, post, processing, reset } = useForm({
        key: "",
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/permissions", {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm("Удалить это разрешение?")) {
            router.delete(`/permissions/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Разрешения" />

            <div className="max-w-5xl mx-auto py-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Управление разрешениями
                </h1>

                {/* Добавление нового */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-4 shadow rounded-lg mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Ключ (key)
                        </label>
                        <input
                            type="text"
                            value={data.key}
                            onChange={(e) => setData("key", e.target.value)}
                            placeholder="edit_plan"
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">
                            Название (name)
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Редактирование плана"
                            className="border rounded w-full p-2"
                            required
                        />
                    </div>
                    <div className="flex items-end justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="text-white px-4 py-2 rounded"
                            style={{ backgroundColor: "#21397D" }}
                        >
                            ➕ Добавить
                        </button>
                    </div>
                </form>

                {/* Таблица разрешений */}
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Ключ</th>
                                <th className="border p-2">Название</th>
                                <th className="border p-2 text-center">
                                    Действие
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center text-gray-500 p-4"
                                    >
                                        Разрешения не найдены
                                    </td>
                                </tr>
                            ) : (
                                permissions.map((p) => (
                                    <tr key={p.id} className="border-b">
                                        <td className="border p-2">{p.id}</td>
                                        <td className="border p-2">{p.key}</td>
                                        <td className="border p-2">{p.name}</td>
                                        <td className="border p-2 text-center">
                                            <button
                                                onClick={() =>
                                                    handleDelete(p.id)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
