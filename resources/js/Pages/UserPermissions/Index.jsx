import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, router } from "@inertiajs/react";

export default function UserPermissionsIndex({
    users,
    roles,
    permissions,
    userPermissions,
    filters,
    faculties,
    departments,
}) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const { data, setData, post, reset, processing } = useForm({
        permission_id: "",
        starts_at: "",
        expires_at: "",
        user_ids: [],
    });

    const toggleUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleFilter = (e) => {
        const params = new URLSearchParams({
            role: e.target.role?.value || "",
            faculty_id: e.target.faculty_id?.value || "",
            department_id: e.target.department_id?.value || "",
            search: e.target.search?.value || "",
        });
        router.get(`/user-permissions?${params.toString()}`);
        e.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/user-permissions/bulk", {
            data: { ...data, user_ids: selectedUsers },
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedUsers([]);
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm("Удалить это разрешение?")) {
            router.delete(`/user-permissions/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout>
            <Head title="Права пользователей" />

            <div className="max-w-7xl mx-auto py-8 space-y-8">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Управление правами пользователей
                </h1>

                {/* 🔍 Фильтры */}
                <form
                    onSubmit={handleFilter}
                    className="bg-white shadow p-4 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-4"
                >
                    <select
                        name="role"
                        defaultValue={filters.role || ""}
                        className="border p-2 rounded"
                    >
                        <option value="">Все роли</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.name}>
                                {r.label}
                            </option>
                        ))}
                    </select>

                    <select
                        name="faculty_id"
                        defaultValue={filters.faculty_id || ""}
                        className="border p-2 rounded"
                    >
                        <option value="">Все факультеты</option>
                        {faculties.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>

                    <select
                        name="department_id"
                        defaultValue={filters.department_id || ""}
                        className="border p-2 rounded"
                    >
                        <option value="">Все кафедры</option>
                        {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                    <input
                        name="search"
                        placeholder="Поиск по имени/email"
                        defaultValue={filters.search || ""}
                        className="border p-2 rounded"
                    />
                    <button
                        type="submit"
                        className="text-white rounded px-4"
                        style={{ backgroundColor: "#21397D" }}
                    >
                        Фильтр
                    </button>
                </form>

                {/* 👥 Список пользователей */}
                <div className="bg-white shadow rounded-lg overflow-x-auto p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg text-gray-700">
                            Список пользователей ({users.length})
                        </h3>

                        {users.length > 0 && (
                            <button
                                onClick={() => {
                                    if (selectedUsers.length === users.length) {
                                        setSelectedUsers([]); // снять выделение
                                    } else {
                                        setSelectedUsers(
                                            users.map((u) => u.id)
                                        ); // выбрать всех
                                    }
                                }}
                                className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                            >
                                {selectedUsers.length === users.length
                                    ? "Снять выбор"
                                    : "Выбрать всех"}
                            </button>
                        )}
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-center w-10">
                                    ✓
                                </th>
                                <th className="border p-2">Имя</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Факультет</th>
                                <th className="border p-2">Кафедра</th>
                                <th className="border p-2">Роли</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center p-4 text-gray-500"
                                    >
                                        Пользователи не найдены
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u.id} className="border-b">
                                        <td className="text-center border p-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(
                                                    u.id
                                                )}
                                                onChange={() =>
                                                    toggleUser(u.id)
                                                }
                                            />
                                        </td>
                                        <td className="border p-2">{u.name}</td>
                                        <td className="border p-2">
                                            {u.email}
                                        </td>
                                        <td className="border p-2">
                                            {u.faculty?.name || "—"}
                                        </td>
                                        <td className="border p-2">
                                            {u.department?.name || "—"}
                                        </td>
                                        <td className="border p-2 text-gray-700">
                                            {u.roles
                                                ?.map((r) => r.label)
                                                .join(", ") || "—"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ⚙️ Выдача прав */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.target;
                        const fd = new FormData(form);

                        // добавляем всех выбранных пользователей
                        selectedUsers.forEach((id) =>
                            fd.append("user_ids[]", id)
                        );

                        router.post("/user-permissions/bulk", fd, {
                            preserveScroll: true,
                        });
                    }}
                    className="bg-white shadow p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
                >
                    {/* 🧩 Разрешения чекбоксами */}
                    <div className="col-span-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Разрешения:
                        </label>

                        <div className="flex flex-col gap-2">
                            {permissions.map((perm) => (
                                <label
                                    key={perm.id}
                                    className="flex items-center space-x-2 border p-2 rounded hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        name="permission_ids[]"
                                        value={perm.id}
                                        className="rounded text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {perm.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* ⏰ Время действия прав */}
                    <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Время действия:
                        </label>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Начало */}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Начало (Almaty time)
                                </label>
                                <input
                                    type="datetime-local"
                                    name="starts_at"
                                    defaultValue={new Date()
                                        .toISOString()
                                        .slice(0, 16)} // текущее время по UTC
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>

                            {/* Окончание */}
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    Окончание
                                </label>
                                <input
                                    type="datetime-local"
                                    name="expires_at"
                                    className="border rounded p-2 w-full"
                                    required
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Укажи время начала и окончания действия прав
                            (часовой пояс: UTC+5 Алматы)
                        </p>
                    </div>

                    {/* 🔘 Кнопка */}
                    <div className="text-right col-span-1">
                        <button
                            type="submit"
                            disabled={selectedUsers.length === 0}
                            className={`${
                                selectedUsers.length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            } text-white px-4 py-2 rounded w-full`}
                        >
                            Назначить права
                        </button>
                    </div>
                </form>

                {/* 🧾 Активные разрешения */}
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <h3 className="text-lg font-semibold p-4">
                        Активные временные права
                    </h3>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Пользователь</th>
                                <th className="border p-2">Разрешение</th>
                                <th className="border p-2">Начало</th>
                                <th className="border p-2">Конец</th>
                                <th className="border p-2 text-center">
                                    Удалить
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {userPermissions.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center text-gray-500 p-4"
                                    >
                                        Нет активных прав
                                    </td>
                                </tr>
                            ) : (
                                userPermissions.map((up) => (
                                    <tr key={up.id} className="border-b">
                                        <td className="border p-2">
                                            {up.user?.name ?? "—"}
                                        </td>
                                        <td className="border p-2">
                                            {up.permission?.name ?? "—"}
                                        </td>
                                        <td className="border p-2">
                                            {up.starts_at
                                                ? new Date(
                                                      up.starts_at
                                                  ).toLocaleString("ru-RU", {
                                                      timeZone: "Asia/Almaty",
                                                  })
                                                : "—"}
                                        </td>
                                        <td className="border p-2">
                                            {up.expires_at
                                                ? new Date(
                                                      up.expires_at
                                                  ).toLocaleString("ru-RU", {
                                                      timeZone: "Asia/Almaty",
                                                  })
                                                : "—"}
                                        </td>
                                        <td className="border p-2 text-center">
                                            <button
                                                onClick={() =>
                                                    handleDelete(up.id)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                🗑
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
