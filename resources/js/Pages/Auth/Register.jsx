import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import React from "react";

export default function Register() {
    const { faculties } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        faculty_id: "",
        department_id: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const selectedFaculty = faculties.find(
        (f) => f.id == data.faculty_id
    );

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                {/* ФИО */}
                <div>
                    <InputLabel htmlFor="name" value="ФИО" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* Email */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Факультет */}
                <div className="mt-4">
                    <InputLabel htmlFor="faculty" value="Факультет" />

                    <select
                        id="faculty"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.faculty_id}
                        required
                        onChange={(e) => {
                            setData("faculty_id", e.target.value);
                            setData("department_id", "");
                        }}
                    >
                        <option value="">Выберите факультет</option>
                        {faculties.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.name}
                            </option>
                        ))}
                    </select>

                    <InputError message={errors.faculty_id} className="mt-2" />
                </div>

                {/* Кафедра */}
                <div className="mt-4">
                    <InputLabel htmlFor="department" value="Кафедра" />

                    <select
                        id="department"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.department_id}
                        required
                        disabled={!data.faculty_id}
                        onChange={(e) =>
                            setData("department_id", e.target.value)
                        }
                    >
                        <option value="">
                            {data.faculty_id
                                ? "Выберите кафедру"
                                : "Сначала выберите факультет"}
                        </option>

                        {selectedFaculty?.departments?.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    <InputError
                        message={errors.department_id}
                        className="mt-2"
                    />
                </div>

                {/* Пароль */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Пароль" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Повтор пароля */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Повторите пароль"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Кнопки */}
                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route("login")}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900"
                    >
                        Уже зарегистрированы?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Зарегистрироваться
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
