import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, usePage, router } from "@inertiajs/react";

export default function Dashboard({ categories, permissions }) {
    const { data, setData, post, processing } = useForm({});
    const [openRows, setOpenRows] = React.useState([]);

    const toggleSubs = (id) => {
        setOpenRows((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleSave = (indicatorId) => {
        post(`/indicators/${indicatorId}`, {
            preserveScroll: true,
        });
    };

    // ---- Общий итог по странице ----
    let totalPlan = 0;
    let totalFact = 0;

    return (
        <AppLayout>
            <Head title="Панель преподавателя" />

            {categories.map((cat) => {
                // ---- Итоги по категории ----
                let categoryPlan = 0;
                let categoryFact = 0;

                // Считаем все индикаторы и подиндикаторы категории
                cat.indicators.forEach((ind) => {
                    const value = ind.values?.[0] || {};

                    if (ind.unit) {
                        categoryPlan += Number(value.plan || 0);
                        categoryFact += Number(value.fact || 0);
                    }

                    if (ind.subs?.length) {
                        ind.subs.forEach((sub) => {
                            categoryPlan += Number(sub.plan || 0);
                            categoryFact += Number(sub.fact || 0);
                        });
                    }
                });

                // Добавляем в общий итог
                totalPlan += categoryPlan;
                totalFact += categoryFact;

                return (
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
                                        <th className="border p-2">
                                            Наименование
                                        </th>
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

                                        return (
                                            <React.Fragment key={ind.id}>
                                                <tr>
                                                    <td className="border p-2">
                                                        {ind.code}
                                                    </td>
                                                    <td className="border p-2">
                                                        {ind.title}
                                                        <br />
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

                                                    {/* ---- План ---- */}
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
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* ---- Факт ---- */}
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
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </td>

                                                    {/* ---- Файлы ---- */}
                                                    <td className="border p-2">
                                                        {(perms.can_view &&
                                                            perms.can_add_files) ||
                                                        ind.code?.startsWith(
                                                            "1.1"
                                                        ) ? (
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
                                                        ) : null}

                                                        {(perms.can_view &&
                                                            files.length > 0) ||
                                                        ind.code?.startsWith(
                                                            "1.1"
                                                        ) ? (
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
                                                                                    >
                                                                                        🗑
                                                                                    </button>
                                                                                )}
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : null}
                                                    </td>

                                                    {/* ---- Кнопка ---- */}
                                                    <td className="border p-2 text-center">
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
                                                                        processing
                                                                    }
                                                                    className="text-white px-3 py-1 rounded"
                                                                    style={{
                                                                        backgroundColor:
                                                                            "#21397D",
                                                                    }}
                                                                >
                                                                    💾 Сохранить
                                                                </button>
                                                            )}
                                                    </td>
                                                </tr>

                                                {/* ---- Подиндикаторы ---- */}
                                                {ind.code?.startsWith("1.1") &&
                                                    openRows.includes(
                                                        ind.id
                                                    ) && (
                                                        <tr className="bg-gray-50">
                                                            <td
                                                                colSpan="7"
                                                                className="p-4"
                                                            >
                                                                <h4 className="font-semibold mb-2">
                                                                    Подиндикаторы
                                                                </h4>

                                                                {ind.subs
                                                                    ?.length >
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
                                                                                        <td className="border p-2 pl-8">
                                                                                            {
                                                                                                sub.code
                                                                                            }
                                                                                        </td>
                                                                                        <td className="border p-2">
                                                                                            <input
                                                                                                type="text"
                                                                                                disabled={
                                                                                                    !permissions.can_edit_plan
                                                                                                }
                                                                                                defaultValue={
                                                                                                    sub.title ||
                                                                                                    ""
                                                                                                }
                                                                                                className={`border rounded px-2 py-1 w-full ${
                                                                                                    !permissions.can_edit_plan
                                                                                                        ? "bg-gray-100 cursor-not-allowed"
                                                                                                        : ""
                                                                                                }`}
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    (sub.title =
                                                                                                        e.target.value)
                                                                                                }
                                                                                            />
                                                                                        </td>

                                                                                        <td className="border p-2">
                                                                                            {
                                                                                                ind.unit
                                                                                            }
                                                                                        </td>

                                                                                        <td className="border p-2 text-center">
                                                                                            <input
                                                                                                type="number"
                                                                                                disabled={
                                                                                                    !permissions.can_edit_plan
                                                                                                }
                                                                                                defaultValue={
                                                                                                    sub.plan ||
                                                                                                    ""
                                                                                                }
                                                                                                className={`border rounded px-2 py-1 w-full ${
                                                                                                    !permissions.can_edit_plan
                                                                                                        ? "bg-gray-100 cursor-not-allowed"
                                                                                                        : ""
                                                                                                }`}
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    (sub.plan =
                                                                                                        e.target.value)
                                                                                                }
                                                                                            />
                                                                                        </td>

                                                                                        <td className="border p-2 text-center">
                                                                                            <input
                                                                                                type="number"
                                                                                                disabled={
                                                                                                    !permissions.can_edit_fact
                                                                                                }
                                                                                                defaultValue={
                                                                                                    sub.fact ||
                                                                                                    ""
                                                                                                }
                                                                                                className={`border rounded px-2 py-1 w-full ${
                                                                                                    !permissions.can_edit_fact
                                                                                                        ? "bg-gray-100 cursor-not-allowed"
                                                                                                        : ""
                                                                                                }`}
                                                                                                onChange={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    (sub.fact =
                                                                                                        e.target.value)
                                                                                                }
                                                                                            />
                                                                                        </td>

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
                                                                                                            sub.title ||
                                                                                                                ""
                                                                                                        );
                                                                                                        fd.append(
                                                                                                            "plan",
                                                                                                            sub.plan ||
                                                                                                                "0"
                                                                                                        );
                                                                                                        fd.append(
                                                                                                            "fact",
                                                                                                            sub.fact ||
                                                                                                                "0"
                                                                                                        );

                                                                                                        for (const f of e
                                                                                                            .target
                                                                                                            .files) {
                                                                                                            fd.append(
                                                                                                                "files[]",
                                                                                                                f
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
                                                                                                                className="flex justify-between"
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
                                                                                                                        className="text-red-500 hover:text-red-700"
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

                                                                                        <td className="border p-2 text-center">
                                                                                            {(permissions.can_edit_plan ||
                                                                                                permissions.can_edit_fact ||
                                                                                                permissions.can_add_files) && (
                                                                                                <button
                                                                                                    onClick={() => {
                                                                                                        const fd =
                                                                                                            new FormData();
                                                                                                        fd.append(
                                                                                                            "title",
                                                                                                            sub.title ||
                                                                                                                ""
                                                                                                        );
                                                                                                        fd.append(
                                                                                                            "plan",
                                                                                                            sub.plan ||
                                                                                                                "0"
                                                                                                        );
                                                                                                        fd.append(
                                                                                                            "fact",
                                                                                                            sub.fact ||
                                                                                                                "0"
                                                                                                        );
                                                                                                        router.post(
                                                                                                            `/indicator-subs/${sub.id}`,
                                                                                                            fd,
                                                                                                            {
                                                                                                                preserveScroll: true,
                                                                                                            }
                                                                                                        );
                                                                                                    }}
                                                                                                    className="text-white px-3 py-1 rounded"
                                                                                                    style={{
                                                                                                        backgroundColor:
                                                                                                            "#21397D",
                                                                                                    }}
                                                                                                >
                                                                                                    💾
                                                                                                    Сохранить
                                                                                                </button>
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <p className="text-gray-500">
                                                                        Подиндикаторов
                                                                        пока нет
                                                                    </p>
                                                                )}

                                                                <form
                                                                    onSubmit={(
                                                                        e
                                                                    ) => {
                                                                        e.preventDefault();
                                                                        router.post(
                                                                            `/indicators/${ind.id}/subs`,
                                                                            {},
                                                                            {
                                                                                preserveScroll: true,
                                                                            }
                                                                        );
                                                                    }}
                                                                    className="text-right mt-2"
                                                                >
                                                                    <button
                                                                        type="submit"
                                                                        className="text-white px-3 py-1 rounded"
                                                                        style={{
                                                                            backgroundColor:
                                                                                "#21397D",
                                                                        }}
                                                                    >
                                                                        ➕
                                                                        Добавить
                                                                        подиндикатор
                                                                    </button>
                                                                </form>
                                                            </td>
                                                        </tr>
                                                    )}
                                            </React.Fragment>
                                        );
                                    })}

                                    {/* ----- ИТОГО ПО КАТЕГОРИИ ----- */}
                                    <tr className="bg-blue-50 font-semibold">
                                        <td className="border p-2" colSpan="3">
                                            Итого по категории
                                        </td>
                                        <td className="border p-2">
                                            {categoryPlan}
                                        </td>
                                        <td className="border p-2">
                                            {categoryFact}
                                        </td>
                                        <td
                                            colSpan="2"
                                            className="border p-2 text-center"
                                        >
                                            —
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}

            {/* ----- ОБЩИЙ ИТОГ ----- */}
            <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-4 mb-10">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                    Общий итог по всем категориям
                </h2>

                <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">План</th>
                            <th className="border p-2">Факт</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-blue-50 font-semibold">
                            <td className="border p-2">{totalPlan}</td>
                            <td className="border p-2">{totalFact}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
