 import { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import { users } from "../data/users";

function Login() {
    const [selectedUserId, setSelectedUserId] = useState("3");

    // Load logged-in user from localStorage
    const [loggedInUser, setLoggedInUser] = useState(() => {
        const savedUserId = localStorage.getItem("joineazy_user");

        if (!savedUserId) return null;

        return (
            users.find(
                (user) => user.id === Number(savedUserId)
            ) || null
        );
    });

    // Load assignments from localStorage
    const [assignments, setAssignments] = useState(() => {
        try {
            const savedAssignments = localStorage.getItem(
                "joineazy_assignments"
            );

            return savedAssignments
                ? JSON.parse(savedAssignments)
                : [];
        } catch (error) {
            console.error("Error loading assignments:", error);
            return [];
        }
    });

    // Save assignments whenever they change
    useEffect(() => {
        localStorage.setItem(
            "joineazy_assignments",
            JSON.stringify(assignments)
        );
    }, [assignments]);

    // Save logged-in user whenever login state changes
    useEffect(() => {
        if (loggedInUser) {
            localStorage.setItem(
                "joineazy_user",
                String(loggedInUser.id)
            );
        } else {
            localStorage.removeItem("joineazy_user");
        }
    }, [loggedInUser]);

    // Login function
    function handleLogin() {
        const selectedUser = users.find(
            (user) => user.id === Number(selectedUserId)
        );

        setLoggedInUser(selectedUser);
    }

    // Logout function
    function handleLogout() {
        setLoggedInUser(null);
    }

    return (
        <div>
            {loggedInUser ? (
                loggedInUser.role === "student" ? (
                    <StudentDashboard
                        user={loggedInUser}
                        assignments={assignments}
                        setAssignments={setAssignments}
                        onLogout={handleLogout}
                    />
                ) : (
                    <AdminDashboard
                        user={loggedInUser}
                        assignments={assignments}
                        setAssignments={setAssignments}
                        onLogout={handleLogout}
                    />
                )
            ) : (
                <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4">

                    {/* Background decoration */}
                    <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl"></div>

                    {/* Login Card */}
                    <div className="relative w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-sm sm:p-10">

                        {/* Logo and Heading */}
                        <div className="mb-9 text-center">

                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
                                <span className="text-2xl font-bold text-white">
                                    J
                                </span>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
                                Join<span className="text-blue-600">eazy</span>
                            </h1>

                            <p className="mt-3 text-sm text-slate-500">
                                Assignment & Review Dashboard
                            </p>

                            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                        </div>

                        {/* Login Form */}
                        <div className="space-y-6">

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Select your account
                                </label>

                                <select
                                    value={selectedUserId}
                                    onChange={(e) =>
                                        setSelectedUserId(e.target.value)
                                    }
                                    className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                >
                                    {users.map((user) => (
                                        <option
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.name} — {user.role === "admin" ? "Admin / Professor" : "Student"}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Selected Role */}
                            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                                    Logging in as
                                </p>

                                <p className="mt-1 font-semibold text-blue-700">
                                    {users.find(
                                        (user) =>
                                            user.id === Number(selectedUserId)
                                    )?.role === "admin"
                                        ? "Admin / Professor"
                                        : "Student"}
                                </p>
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleLogin}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:translate-y-0"
                            >
                                Login to Dashboard

                                <span className="transition-transform duration-200 group-hover:translate-x-1">
                                    →
                                </span>
                            </button>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                            <p className="text-xs text-slate-400">
                                Assignment management made simple
                            </p>

                            <p className="mt-2 text-xs font-medium text-slate-500">
                                Joineazy Dashboard
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;