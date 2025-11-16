import React from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, router } from "@inertiajs/react";

export default function RolesIndex({ roles, permissions }) {
    const handleToggle = (roleId, permId, checked) => {
        const url = checked
            ? `/roles/${roleId}/permissions/${permId}/attach`
            : `/roles/${roleId}/permissions/${permId}/detach`;

        router.post(url, {}, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title="Роли и разрешения" />
            <div className="max-w-6xl mx-auto py-8">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                    Управление ролями и их разрешениями
                </h1>

                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Роль</th>
                                {permissions.map((perm) => (
                                    <th key={perm.id} className="border p-2">
                                        {perm.name}
                                        <div className="text-xs text-gray-500">
                                            {perm.label}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id}>
                                    <td className="border p-2 font-semibold text-gray-700">
                                        {role.label}
                                    </td>
                                    {permissions.map((perm) => {
                                        const hasPerm = role.permissions.some(
                                            (p) => p.id === perm.id
                                        );
                                        return (
                                            <td
                                                key={`${role.id}-${perm.id}`}
                                                className="border p-2 text-center"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={hasPerm}
                                                    onChange={(e) =>
                                                        handleToggle(
                                                            role.id,
                                                            perm.id,
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
