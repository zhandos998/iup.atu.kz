import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";

export default function ReportShow({
    teacher,
    categories,
    totalPlanPoints,
    totalFactPoints,
}) {
    return (
        <AppLayout>
            <Head title={`Отчёт — ${teacher.name}`} />

            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
                <h1 className="text-2xl font-semibold mb-2 text-gray-800">
                    Отчёт преподавателя
                </h1>
                <p className="text-gray-600 mb-6">
                    {teacher.name} — {teacher.department?.name} /{" "}
                    {teacher.department?.faculty?.name}
                </p>

                {categories.map((cat) => {
                    // вычисляем итог по категории
                    let categoryPlanSum = 0;
                    let categoryFactSum = 0;

                    cat.indicators.forEach((ind) => {
                        const points = ind.points ?? 1;
                        const val = ind.values?.[0];
                        if (val) {
                            categoryPlanSum += (val.plan ?? 0) * points;
                            categoryFactSum += (val.fact ?? 0) * points;
                        }

                        ind.subs?.forEach((sub) => {
                            categoryPlanSum += (sub.plan ?? 0) * points;
                            categoryFactSum += (sub.fact ?? 0) * points;
                        });
                    });

                    return (
                        <div key={cat.id} className="mb-10">
                            <h2 className="text-lg font-semibold mb-3 text-gray-700 uppercase">
                                {cat.name}
                            </h2>

                            <table className="w-full border text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border p-2">Код</th>
                                        <th className="border p-2">
                                            Наименование
                                        </th>
                                        <th className="border p-2">Ед. изм.</th>
                                        <th className="border p-2 text-center">
                                            Очки
                                        </th>
                                        <th className="border p-2 text-center">
                                            План
                                        </th>
                                        <th className="border p-2 text-center">
                                            Факт
                                        </th>
                                        <th className="border p-2 text-center">
                                            Файлы
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cat.indicators.length > 0 ? (
                                        cat.indicators.map((ind) => {
                                            const value = ind.values?.[0] || {};
                                            const files = value.files || [];
                                            const plan = value.plan ?? 0;
                                            const fact = value.fact ?? 0;
                                            const points = ind.points ?? 1;

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
                                                    {/* Основной индикатор */}
                                                    <tr className="bg-white">
                                                        <td className="border p-2">
                                                            {ind.code}
                                                        </td>
                                                        <td className="border p-2 font-medium">
                                                            {ind.title}
                                                        </td>
                                                        <td className="border p-2">
                                                            {ind.unit}
                                                        </td>
                                                        <td className="border p-2 text-center">
                                                            {points}
                                                        </td>
                                                        <td className="border p-2 text-center">
                                                            {plan
                                                                ? `${plan} (${(
                                                                      plan *
                                                                      points
                                                                  ).toFixed(
                                                                      1
                                                                  )})`
                                                                : "—"}
                                                        </td>
                                                        <td className="border p-2 text-center">
                                                            {fact
                                                                ? `${fact} (${(
                                                                      fact *
                                                                      points
                                                                  ).toFixed(
                                                                      1
                                                                  )})`
                                                                : "—"}
                                                        </td>
                                                        <td className="border p-2 text-center">
                                                            {files.length >
                                                            0 ? (
                                                                <ul className="text-blue-600 space-y-1">
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
                                                                    Нет файлов
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>

                                                    {/* Подиндикаторы */}
                                                    {ind.subs?.map((sub) => (
                                                        <tr
                                                            key={`sub-${sub.id}`}
                                                            className="bg-gray-50 text-gray-700"
                                                        >
                                                            <td className="border p-2 pl-8 text-gray-500">
                                                                {sub.code}
                                                            </td>
                                                            <td className="border p-2 italic">
                                                                {sub.title}
                                                            </td>
                                                            <td className="border p-2">
                                                                {ind.unit}
                                                            </td>
                                                            <td className="border p-2 text-center">
                                                                {ind.points ??
                                                                    1}
                                                            </td>
                                                            <td className="border p-2 text-center">
                                                                {sub.plan
                                                                    ? `${
                                                                          sub.plan
                                                                      } (${(
                                                                          sub.plan *
                                                                          (ind.points ??
                                                                              1)
                                                                      ).toFixed(
                                                                          1
                                                                      )})`
                                                                    : "—"}
                                                            </td>
                                                            <td className="border p-2 text-center">
                                                                {sub.fact
                                                                    ? `${
                                                                          sub.fact
                                                                      } (${(
                                                                          sub.fact *
                                                                          (ind.points ??
                                                                              1)
                                                                      ).toFixed(
                                                                          1
                                                                      )})`
                                                                    : "—"}
                                                            </td>
                                                            <td className="border p-2 text-center">
                                                                {sub.files
                                                                    ?.length >
                                                                0 ? (
                                                                    <ul className="text-blue-600 space-y-1">
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
                                                    ))}
                                                </React.Fragment>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center text-gray-500 p-4"
                                            >
                                                Нет данных
                                            </td>
                                        </tr>
                                    )}

                                    {/* Итог по категории */}
                                    <tr className="bg-blue-50 font-semibold">
                                        <td
                                            colSpan="4"
                                            className="border p-2 text-right"
                                        >
                                            ИТОГ по категории:
                                        </td>
                                        <td className="border p-2 text-center text-blue-700">
                                            {categoryPlanSum.toFixed(1)}
                                        </td>
                                        <td className="border p-2 text-center text-green-700">
                                            {categoryFactSum.toFixed(1)}
                                        </td>
                                        <td className="border p-2"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}

                {/* Общий итог */}
                <div className="mt-8 border-t pt-4 text-right">
                    <p className="text-lg font-semibold text-gray-800">
                        Общий план (баллы):{" "}
                        <span className="text-blue-600">
                            {totalPlanPoints.toFixed(1)}
                        </span>
                    </p>
                    <p className="text-lg font-semibold text-gray-800">
                        Общий факт (баллы):{" "}
                        <span className="text-green-600">
                            {totalFactPoints.toFixed(1)}
                        </span>
                    </p>
                </div>
                <div className="flex justify-end mb-4">
                    <a
                        href={`/reports/${teacher.id}/export`}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        ⬇️ Скачать Excel
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}
