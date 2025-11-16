import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";

export default function Dashboard({ categories, permissions }) {
    // const can = (perm) => auth.user.permissions.includes(perm);
    const { data, setData, post, processing } = useForm({});
    const [openRows, setOpenRows] = React.useState([]); // массив открытых индикаторов
    const handleSave = (indicatorId) => {
        post(`/indicators/${indicatorId}`, {
            preserveScroll: true,
        });
    };
    const toggleSubs = (id) => {
        setOpenRows(
            (prev) =>
                prev.includes(id)
                    ? prev.filter((x) => x !== id) // закрываем
                    : [...prev, id] // открываем
        );
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
                                    <th className="border p-2 text-center">
                                        Действие
                                    </th>
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
                                    const perms = permissions || {};

                                    // Заголовок (категория)
                                    if (!ind.unit) {
                                        return (
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
                                        );
                                    }

                                    // Индикатор и его подиндикаторы
                                    return (
                                        <React.Fragment key={ind.id}>
                                            {/* Основная строка */}
                                            <tr>
                                                <td className="border p-2">
                                                    {ind.code}
                                                </td>
                                                <td className="border p-2">
                                                    {ind.title}
                                                    <br />
                                                    {/* Показываем кнопку только если индикатор начинается с 1.1 */}
                                                    {ind.code?.startsWith(
                                                        "1.1"
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                toggleSubs(
                                                                    ind.id
                                                                )
                                                            }
                                                            className="text-xs text-blue-600 hover:text-blue-800"
                                                        >
                                                            {openRows.includes(
                                                                ind.id
                                                            )
                                                                ? "▲ Скрыть"
                                                                : "▼ Показать"}
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="border p-2">
                                                    {ind.unit}
                                                </td>

                                                {/* План */}
                                                <td className="border p-2">
                                                    <input
                                                        type="number"
                                                        disabled={
                                                            !perms.can_edit_plan ||
                                                            ind.code?.startsWith(
                                                                "1.1"
                                                            )
                                                        }
                                                        className={`border rounded px-2 py-1 w-full ${
                                                            !perms.can_edit_plan ||
                                                            ind.code?.startsWith(
                                                                "1.1"
                                                            )
                                                                ? "bg-gray-100 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        value={
                                                            perms.can_view
                                                                ? data[
                                                                      `plan_${ind.id}`
                                                                  ] ??
                                                                  value.plan ??
                                                                  ""
                                                                : ""
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
                                                        type="number"
                                                        disabled={
                                                            !perms.can_edit_fact ||
                                                            ind.code?.startsWith(
                                                                "1.1"
                                                            )
                                                        }
                                                        className={`border rounded px-2 py-1 w-full ${
                                                            !perms.can_edit_fact ||
                                                            ind.code?.startsWith(
                                                                "1.1"
                                                            )
                                                                ? "bg-gray-100 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        value={
                                                            perms.can_view
                                                                ? data[
                                                                      `fact_${ind.id}`
                                                                  ] ??
                                                                  value.fact ??
                                                                  ""
                                                                : ""
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
                                                    {(perms.can_view &&
                                                        perms.can_add_files) ||
                                                        (ind.code?.startsWith(
                                                            "1.1"
                                                        ) && (
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) =>
                                                                    setData(
                                                                        `files_${ind.id}`,
                                                                        e.target
                                                                            .files
                                                                    )
                                                                }
                                                            />
                                                        ))}

                                                    {((perms.can_view &&
                                                        files.length > 0) ||
                                                        ind.code?.startsWith(
                                                            "1.1"
                                                        )) && (
                                                        <ul className="mt-2 text-sm text-blue-600 space-y-1">
                                                            {files.map(
                                                                (file) => (
                                                                    <li
                                                                        key={
                                                                            file.id
                                                                        }
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

                                                                        {perms.can_delete_files &&
                                                                            !ind.code?.startsWith(
                                                                                "1.1"
                                                                            ) && (
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
                                                                )
                                                            )}
                                                        </ul>
                                                    )}
                                                </td>

                                                {/* Кнопка */}
                                                <td className="border p-2 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        {perms.can_view &&
                                                            (perms.can_edit_plan ||
                                                                perms.can_edit_fact ||
                                                                perms.can_add_files) &&
                                                            !ind.code?.startsWith(
                                                                "1.1"
                                                            ) && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleSave(
                                                                            ind.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        processing ||
                                                                        ind.code?.startsWith(
                                                                            "1.1"
                                                                        )
                                                                    }
                                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                                                                >
                                                                    💾 Сохранить
                                                                </button>
                                                            )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* Подиндикаторы (всегда видны) */}
                                            {ind.code?.startsWith("1.1") &&
                                                openRows.includes(ind.id) && (
                                                    <tr className="bg-gray-50">
                                                        <td
                                                            colSpan="7"
                                                            className="p-4"
                                                        >
                                                            <h4 className="font-semibold mb-2">
                                                                Подиндикаторы
                                                            </h4>

                                                            {ind.subs?.length >
                                                            0 ? (
                                                                <table className="w-full border text-sm mb-4">
                                                                    <thead className="bg-gray-100">
                                                                        <tr>
                                                                            <th className="border p-2">
                                                                                Код
                                                                            </th>
                                                                            <th className="border p-2">
                                                                                Наименование
                                                                            </th>
                                                                            <th className="border p-2">
                                                                                Ед.
                                                                                изм.
                                                                            </th>
                                                                            <th className="border p-2">
                                                                                План
                                                                            </th>
                                                                            <th className="border p-2">
                                                                                Факт
                                                                            </th>
                                                                            <th className="border p-2">
                                                                                Файлы
                                                                            </th>
                                                                            <th className="border p-2">
                                                                                Действие
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {ind.subs.map(
                                                                            (
                                                                                sub
                                                                            ) => (
                                                                                <tr
                                                                                    key={`sub-${sub.id}`}
                                                                                    className="bg-gray-50"
                                                                                >
                                                                                    <td className="border p-2 pl-8 text-gray-600">
                                                                                        {
                                                                                            sub.code
                                                                                        }
                                                                                    </td>

                                                                                    {/* Название подиндикатора */}
                                                                                    <td className="border p-2 text-gray-700">
                                                                                        <input
                                                                                            type="text"
                                                                                            disabled={
                                                                                                !permissions.can_edit_plan
                                                                                            }
                                                                                            className={`border rounded px-2 py-1 w-full ${
                                                                                                !permissions.can_edit_plan
                                                                                                    ? "bg-gray-100 cursor-not-allowed"
                                                                                                    : ""
                                                                                            }`}
                                                                                            defaultValue={
                                                                                                sub.title ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                (sub.title =
                                                                                                    e.target.value)
                                                                                            }
                                                                                        />
                                                                                    </td>

                                                                                    {/* Название подиндикатора */}
                                                                                    <td className="border p-2 text-gray-700">
                                                                                        {
                                                                                            ind.unit
                                                                                        }
                                                                                    </td>

                                                                                    {/* План */}
                                                                                    <td className="border p-2 text-center">
                                                                                        <input
                                                                                            type="number"
                                                                                            disabled={
                                                                                                !permissions.can_edit_plan
                                                                                            }
                                                                                            className={`border rounded px-2 py-1 w-full text-center ${
                                                                                                !permissions.can_edit_plan
                                                                                                    ? "bg-gray-100 cursor-not-allowed"
                                                                                                    : ""
                                                                                            }`}
                                                                                            defaultValue={
                                                                                                sub.plan ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                (sub.plan =
                                                                                                    e.target.value)
                                                                                            }
                                                                                        />
                                                                                    </td>

                                                                                    {/* Факт */}
                                                                                    <td className="border p-2 text-center">
                                                                                        <input
                                                                                            type="number"
                                                                                            disabled={
                                                                                                !permissions.can_edit_fact
                                                                                            }
                                                                                            className={`border rounded px-2 py-1 w-full text-center ${
                                                                                                !permissions.can_edit_fact
                                                                                                    ? "bg-gray-100 cursor-not-allowed"
                                                                                                    : ""
                                                                                            }`}
                                                                                            defaultValue={
                                                                                                sub.fact ??
                                                                                                ""
                                                                                            }
                                                                                            onChange={(
                                                                                                e
                                                                                            ) =>
                                                                                                (sub.fact =
                                                                                                    e.target.value)
                                                                                            }
                                                                                        />
                                                                                    </td>

                                                                                    {/* Файлы */}
                                                                                    <td className="border p-2 text-center">
                                                                                        {permissions.can_add_files && (
                                                                                            <input
                                                                                                type="file"
                                                                                                multiple
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) => {
                                                                                                    const fd =
                                                                                                        new FormData();
                                                                                                    fd.append(
                                                                                                        "title",
                                                                                                        sub.title ??
                                                                                                            ""
                                                                                                    );
                                                                                                    fd.append(
                                                                                                        "plan",
                                                                                                        sub.plan ??
                                                                                                            ""
                                                                                                    );
                                                                                                    fd.append(
                                                                                                        "fact",
                                                                                                        sub.fact ??
                                                                                                            ""
                                                                                                    );
                                                                                                    for (const file of e
                                                                                                        .target
                                                                                                        .files) {
                                                                                                        fd.append(
                                                                                                            "files[]",
                                                                                                            file
                                                                                                        );
                                                                                                    }
                                                                                                    router.post(
                                                                                                        `/indicator-subs/${sub.id}`,
                                                                                                        fd,
                                                                                                        {
                                                                                                            preserveScroll: true,
                                                                                                        }
                                                                                                    );
                                                                                                }}
                                                                                            />
                                                                                        )}

                                                                                        {sub
                                                                                            .files
                                                                                            ?.length >
                                                                                            0 && (
                                                                                            <ul className="text-blue-600 text-sm space-y-1 mt-1">
                                                                                                {sub.files.map(
                                                                                                    (
                                                                                                        file
                                                                                                    ) => (
                                                                                                        <li
                                                                                                            key={
                                                                                                                file.id
                                                                                                            }
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

                                                                                                            {permissions.can_delete_files && (
                                                                                                                <button
                                                                                                                    onClick={() =>
                                                                                                                        router.delete(
                                                                                                                            `/indicator-sub-files/${file.id}`,
                                                                                                                            {
                                                                                                                                preserveScroll: true,
                                                                                                                            }
                                                                                                                        )
                                                                                                                    }
                                                                                                                    className="text-red-500 hover:text-red-700 ml-2"
                                                                                                                    title="Удалить файл"
                                                                                                                >
                                                                                                                    🗑
                                                                                                                </button>
                                                                                                            )}
                                                                                                        </li>
                                                                                                    )
                                                                                                )}
                                                                                            </ul>
                                                                                        )}
                                                                                    </td>

                                                                                    {/* Действие */}
                                                                                    <td className="border p-2 text-center">
                                                                                        <div className="flex justify-center gap-2">
                                                                                            {(permissions.can_edit_plan ||
                                                                                                permissions.can_edit_fact ||
                                                                                                permissions.can_add_files) && (
                                                                                                <button
                                                                                                    onClick={() => {
                                                                                                        const fd =
                                                                                                            new FormData();
                                                                                                        fd.append(
                                                                                                            "plan",
                                                                                                            sub.plan ??
                                                                                                                ""
                                                                                                        );
                                                                                                        fd.append(
                                                                                                            "fact",
                                                                                                            sub.fact ??
                                                                                                                ""
                                                                                                        );
                                                                                                        fd.append(
                                                                                                            "title",
                                                                                                            sub.title ??
                                                                                                                ""
                                                                                                        );
                                                                                                        router.post(
                                                                                                            `/indicator-subs/${sub.id}`,
                                                                                                            fd,
                                                                                                            {
                                                                                                                preserveScroll: true,
                                                                                                            }
                                                                                                        );
                                                                                                    }}
                                                                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                                                                >
                                                                                                    💾
                                                                                                    Сохранить
                                                                                                </button>
                                                                                            )}

                                                                                            {permissions.can_delete_files && (
                                                                                                <button
                                                                                                    onClick={() =>
                                                                                                        router.delete(
                                                                                                            `/indicator-subs/${sub.id}`,
                                                                                                            {
                                                                                                                preserveScroll: true,
                                                                                                            }
                                                                                                        )
                                                                                                    }
                                                                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                                                                >
                                                                                                    🗑
                                                                                                    Удалить
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            ) : (
                                                                <p className="text-gray-500 mb-3">
                                                                    Подиндикаторов
                                                                    пока нет
                                                                </p>
                                                            )}

                                                            {/* форма добавления новой строки */}
                                                            <form
                                                                onSubmit={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    router.post(
                                                                        `/indicators/${ind.id}/subs`,
                                                                        {}, // без данных — просто создаём пустой подиндикатор
                                                                        {
                                                                            preserveScroll: true,
                                                                        }
                                                                    );
                                                                }}
                                                                className="text-right mt-2"
                                                            >
                                                                <button
                                                                    type="submit"
                                                                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                                >
                                                                    ➕ Добавить
                                                                    подиндикатор
                                                                </button>
                                                            </form>
                                                        </td>
                                                    </tr>
                                                )}
                                        </React.Fragment>
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
