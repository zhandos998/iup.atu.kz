import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, usePage } from "@inertiajs/react";

export default function PlanShow() {
    const { teacher, categories } = usePage().props;
    const [openRows, setOpenRows] = useState([]);

    const toggleSubs = (id) => {
        setOpenRows((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    // ---- Общий итог ----
    let totalPlanPoints = 0;
    let totalFactPoints = 0;

    return (
        <AppLayout>
            <Head title={`План — ${teacher.name}`} />

            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
                <h1 className="text-2xl font-semibold mb-2 text-gray-800">
                    Индивидуальный план преподавателя
                </h1>
                <p className="text-gray-600 mb-6">
                    {teacher.name} — {teacher.department?.name} /{" "}
                    {teacher.department?.faculty?.name}
                </p>

                {categories.length > 0 ? (
                    categories.map((cat) => {
                        // ---- Итоги по КАТЕГОРИИ ----
                        let categoryPlanPoints = 0;
                        let categoryFactPoints = 0;

                        return (
                            <div key={cat.id} className="mb-8">
                                <h2 className="text-lg font-semibold mb-3 text-gray-700 uppercase">
                                    {cat.name}
                                </h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full border text-sm">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="border p-2">
                                                    Код
                                                </th>
                                                <th className="border p-2">
                                                    Наименование
                                                </th>
                                                <th className="border p-2">
                                                    Ед. изм.
                                                </th>
                                                <th className="border p-2 text-center">
                                                    План (баллы)
                                                </th>
                                                <th className="border p-2 text-center">
                                                    Факт (баллы)
                                                </th>
                                                <th className="border p-2 text-center">
                                                    Файлы
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {cat.indicators.map((ind) => {
                                                const value =
                                                    ind.values?.[0] || {};
                                                const files = value.files || [];

                                                // ----- Категория-заголовок -----
                                                if (!ind.unit) {
                                                    return (
                                                        <tr key={ind.id}>
                                                            <td className="border p-2">
                                                                {ind.code}
                                                            </td>
                                                            <td
                                                                className="border p-2 font-semibold text-gray-800"
                                                                colSpan="5"
                                                            >
                                                                {ind.title}
                                                            </td>
                                                        </tr>
                                                    );
                                                }

                                                // ---- Подсчёт баллов индикатора ----
                                                const planPoints =
                                                    value.plan && ind.points
                                                        ? value.plan *
                                                          ind.points
                                                        : 0;

                                                const factPoints =
                                                    value.fact && ind.points
                                                        ? value.fact *
                                                          ind.points
                                                        : 0;

                                                categoryPlanPoints +=
                                                    planPoints;
                                                categoryFactPoints +=
                                                    factPoints;

                                                // ---- Вывод индикатора ----
                                                return (
                                                    <React.Fragment
                                                        key={ind.id}
                                                    >
                                                        <tr>
                                                            <td className="border p-2">
                                                                {ind.code}
                                                            </td>
                                                            <td className="border p-2">
                                                                {ind.title}
                                                                {ind.code?.startsWith(
                                                                    "1.1"
                                                                ) && (
                                                                    <button
                                                                        onClick={() =>
                                                                            toggleSubs(
                                                                                ind.id
                                                                            )
                                                                        }
                                                                        className="ml-2 text-xs text-blue-600 hover:text-blue-800"
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

                                                            {/* План в баллах */}
                                                            <td className="border p-2 text-center">
                                                                {value.plan
                                                                    ? `${value.plan} × ${ind.points} = ${planPoints}`
                                                                    : "—"}
                                                            </td>

                                                            {/* Факт в баллах */}
                                                            <td className="border p-2 text-center">
                                                                {value.fact
                                                                    ? `${value.fact} × ${ind.points} = ${factPoints}`
                                                                    : "—"}
                                                            </td>

                                                            {/* Файлы */}
                                                            <td className="border p-2 text-center">
                                                                {files.length >
                                                                0 ? (
                                                                    <ul className="text-blue-600 text-sm space-y-1">
                                                                        {files.map(
                                                                            (
                                                                                file
                                                                            ) => (
                                                                                <li
                                                                                    key={
                                                                                        file.id
                                                                                    }
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
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                ) : (
                                                                    <span className="text-gray-400 text-sm">
                                                                        Нет
                                                                        файлов
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>

                                                        {/* Подиндикаторы */}
                                                        {ind.code?.startsWith(
                                                            "1.1"
                                                        ) &&
                                                            openRows.includes(
                                                                ind.id
                                                            ) && (
                                                                <tr className="bg-gray-50">
                                                                    <td
                                                                        colSpan="6"
                                                                        className="p-4"
                                                                    >
                                                                        <h4 className="font-semibold mb-2">
                                                                            Подиндикаторы
                                                                        </h4>

                                                                        {ind
                                                                            .subs
                                                                            ?.length >
                                                                        0 ? (
                                                                            <table className="w-full border text-sm">
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
                                                                                        <th className="border p-2 text-center">
                                                                                            План
                                                                                            (баллы)
                                                                                        </th>
                                                                                        <th className="border p-2 text-center">
                                                                                            Факт
                                                                                            (баллы)
                                                                                        </th>
                                                                                        <th className="border p-2 text-center">
                                                                                            Файлы
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {ind.subs.map(
                                                                                        (
                                                                                            sub
                                                                                        ) => {
                                                                                            const subPlanPoints =
                                                                                                sub.plan &&
                                                                                                ind.points
                                                                                                    ? sub.plan *
                                                                                                      ind.points
                                                                                                    : 0;

                                                                                            const subFactPoints =
                                                                                                sub.fact &&
                                                                                                ind.points
                                                                                                    ? sub.fact *
                                                                                                      ind.points
                                                                                                    : 0;

                                                                                            categoryPlanPoints +=
                                                                                                subPlanPoints;
                                                                                            categoryFactPoints +=
                                                                                                subFactPoints;

                                                                                            return (
                                                                                                <tr
                                                                                                    key={
                                                                                                        sub.id
                                                                                                    }
                                                                                                >
                                                                                                    <td className="border p-2 pl-6">
                                                                                                        {
                                                                                                            sub.code
                                                                                                        }
                                                                                                    </td>
                                                                                                    <td className="border p-2">
                                                                                                        {sub.title ??
                                                                                                            "—"}
                                                                                                    </td>
                                                                                                    <td className="border p-2">
                                                                                                        {
                                                                                                            ind.unit
                                                                                                        }
                                                                                                    </td>
                                                                                                    <td className="border p-2 text-center">
                                                                                                        {sub.plan
                                                                                                            ? `${sub.plan} × ${ind.points} = ${subPlanPoints}`
                                                                                                            : "—"}
                                                                                                    </td>
                                                                                                    <td className="border p-2 text-center">
                                                                                                        {sub.fact
                                                                                                            ? `${sub.fact} × ${ind.points} = ${subFactPoints}`
                                                                                                            : "—"}
                                                                                                    </td>
                                                                                                    <td className="border p-2 text-center">
                                                                                                        {sub
                                                                                                            .files
                                                                                                            ?.length >
                                                                                                        0 ? (
                                                                                                            <ul className="text-blue-600 text-sm space-y-1">
                                                                                                                {sub.files.map(
                                                                                                                    (
                                                                                                                        file
                                                                                                                    ) => (
                                                                                                                        <li
                                                                                                                            key={
                                                                                                                                file.id
                                                                                                                            }
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
                                                                                                                        </li>
                                                                                                                    )
                                                                                                                )}
                                                                                                            </ul>
                                                                                                        ) : (
                                                                                                            <span className="text-gray-400 text-sm">
                                                                                                                Нет
                                                                                                                файлов
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            );
                                                                                        }
                                                                                    )}
                                                                                </tbody>
                                                                            </table>
                                                                        ) : (
                                                                            <p className="text-gray-500 text-sm">
                                                                                Подиндикаторов
                                                                                нет
                                                                            </p>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                    </React.Fragment>
                                                );
                                            })}

                                            {/* ---- ИТОГО ПО КАТЕГОРИИ ---- */}
                                            <tr className="bg-blue-50 font-semibold">
                                                <td
                                                    colSpan="3"
                                                    className="border p-2"
                                                >
                                                    Итого по категории
                                                </td>
                                                <td className="border p-2 text-center">
                                                    {categoryPlanPoints}
                                                </td>
                                                <td className="border p-2 text-center">
                                                    {categoryFactPoints}
                                                </td>
                                                <td className="border p-2 text-center">
                                                    —
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Добавляем в общий итог */}
                                {void (totalPlanPoints += categoryPlanPoints)}
                                {void (totalFactPoints += categoryFactPoints)}
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500">Нет данных по категориям</p>
                )}

                {/* ---- ОБЩИЙ ИТОГ ---- */}
                <div className="mt-10 bg-gray-50 p-4 rounded border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Общий итог по всем категориям
                    </h3>

                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-center">
                                    План (баллы)
                                </th>
                                <th className="border p-2 text-center">
                                    Факт (баллы)
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-blue-50 font-semibold">
                                <td className="border p-2 text-center">
                                    {totalPlanPoints}
                                </td>
                                <td className="border p-2 text-center">
                                    {totalFactPoints}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="mt-5">
                    <a
                        href={`/reports/${teacher.id}/export`}
                        className="text-white px-4 py-2 rounded-lg text-sm transition"
                        style={{ backgroundColor: "#21397D" }}
                    >
                        ⬇️ Скачать отчёт
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
