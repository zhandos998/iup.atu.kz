import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";

export default function Indicators({ category, indicators }) {
    const { data, setData, post, processing } = useForm({});

    const handleSubmit = (id) => {
        post(`/indicators/${id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <h1 className="text-2xl font-bold text-blue-600 mb-6">
                {category.name}
            </h1>

            <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
                <table className="w-full text-sm border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Код</th>
                            <th className="p-2 border">Наименование</th>
                            <th className="p-2 border">Ед. изм.</th>
                            <th className="p-2 border">План</th>
                            <th className="p-2 border">Факт</th>
                            <th className="p-2 border">Файлы</th>
                            <th className="p-2 border"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {indicators.map((ind) => (
                            <tr key={ind.id}>
                                <td className="p-2 border">{ind.code}</td>
                                <td className="p-2 border">{ind.title}</td>
                                <td className="p-2 border">{ind.unit}</td>
                                <td className="p-2 border">
                                    <input
                                        type="text"
                                        className="border rounded px-2 py-1 w-full"
                                        onChange={(e) =>
                                            setData(
                                                `plan_${ind.id}`,
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td className="p-2 border">
                                    <input
                                        type="text"
                                        className="border rounded px-2 py-1 w-full"
                                        onChange={(e) =>
                                            setData(
                                                `fact_${ind.id}`,
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td className="p-2 border">
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
                                </td>
                                <td className="p-2 border text-center">
                                    <button
                                        disabled={processing}
                                        onClick={() => handleSubmit(ind.id)}
                                        className="text-white px-3 py-1 rounded"
                                        style={{ backgroundColor: "#21397D" }}
                                    >
                                        Сохранить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
