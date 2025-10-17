import React from 'react';
import { Head } from '@inertiajs/react';

export default function Dashboard({ user }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-4">👋 Welcome, {user.name}!</h1>

                <div className="bg-white shadow rounded-lg p-6">
                    <p className="text-gray-700 mb-2">
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-gray-700 mb-2">
                        <strong>Roles:</strong> {user.roles.join(', ')}
                    </p>
                </div>
            </div>
        </>
    );
}
