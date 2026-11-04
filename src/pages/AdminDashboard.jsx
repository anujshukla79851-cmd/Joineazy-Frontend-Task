 import { useState } from "react";
import { users } from "../data/users";

function AdminDashboard({ user, assignments, setAssignments, onLogout }) {
    const students = users.filter((user) => user.role === "student");

    // Assignment form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [driveLink, setDriveLink] = useState("");

    // Edit and student selection states
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Professor's assignments
    const myAssignments = assignments.filter(
        (assignment) => assignment.createdBy === user.id
    );

    // Search and filter assignments
    const filteredAssignments = myAssignments.filter((assignment) => {
        const matchesSearch = assignment.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            assignment.assignedTo.some((studentId) => {
                const status =
                    assignment.submissions?.[studentId] || "Pending";

                return status === statusFilter;
            });

        return matchesSearch && matchesStatus;
    });

    // Dashboard statistics
    const totalAssignments = myAssignments.length;

    const totalSubmissions = myAssignments.reduce(
        (total, assignment) => total + assignment.assignedTo.length,
        0
    );

    const totalSubmitted = myAssignments.reduce(
        (total, assignment) =>
            total +
            assignment.assignedTo.filter(
                (studentId) =>
                    assignment.submissions?.[studentId] === "Submitted"
            ).length,
        0
    );

    const pendingCount = totalSubmissions - totalSubmitted;

    const completionRate =
        totalSubmissions === 0
            ? 0
            : Math.round((totalSubmitted / totalSubmissions) * 100);

    // Select all students
    function handleSelectAll(e) {
        if (e.target.checked) {
            setSelectedStudents(students.map((student) => student.id));
        } else {
            setSelectedStudents([]);
        }
    }

    // Select individual student
    function handleStudentSelection(studentId) {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(
                selectedStudents.filter((id) => id !== studentId)
            );
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    }

    // Create or update assignment
    function handleSubmit(e) {
        e.preventDefault();

        if (selectedStudents.length === 0) {
            alert("Please select at least one student.");
            return;
        }

        if (editingAssignment) {
            setAssignments((previousAssignments) =>
                previousAssignments.map((assignment) =>
                    assignment.id === editingAssignment.id
                        ? {
                              ...assignment,
                              title,
                              description,
                              dueDate,
                              driveLink,
                              assignedTo: selectedStudents,
                          }
                        : assignment
                )
            );

            setEditingAssignment(null);
        } else {
            const newAssignment = {
                id: Date.now(),
                title,
                description,
                dueDate,
                driveLink,
                assignedTo: selectedStudents,
                createdBy: user.id,
                submissions: {},
            };

            setAssignments((previousAssignments) => [
                ...previousAssignments,
                newAssignment,
            ]);
        }

        // Reset form
        setTitle("");
        setDescription("");
        setDueDate("");
        setDriveLink("");
        setSelectedStudents([]);
    }

    // Edit assignment
    function handleEdit(assignment) {
        setEditingAssignment(assignment);
        setTitle(assignment.title);
        setDescription(assignment.description);
        setDueDate(assignment.dueDate);
        setDriveLink(assignment.driveLink);
        setSelectedStudents(assignment.assignedTo);
    }

    // Delete assignment
    function handleDelete(assignmentId) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this assignment?"
        );

        if (confirmDelete) {
            setAssignments((previousAssignments) =>
                previousAssignments.filter(
                    (assignment) => assignment.id !== assignmentId
                )
            );
        }
    }

    // Cancel editing
    function handleCancelEdit() {
        setEditingAssignment(null);
        setTitle("");
        setDescription("");
        setDueDate("");
        setDriveLink("");
        setSelectedStudents([]);
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl">

                {/* Dashboard Header */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-lg sm:flex-row sm:items-center md:p-8">
                    <div>
                        <p className="mb-2 text-sm font-medium tracking-wide text-blue-100">
                            JOINEAZY | PROFESSOR PANEL
                        </p>

                        <h1 className="text-3xl font-bold md:text-4xl">
                            Professor Dashboard
                        </h1>

                        <p className="mt-2 text-blue-100">
                            Welcome back, {user.name}
                        </p>
                    </div>

                    <button
                        onClick={onLogout}
                        className="rounded-lg bg-white px-5 py-2.5 font-semibold text-indigo-700 transition hover:bg-indigo-50"
                    >
                        Logout
                    </button>
                </div>

                <p className="mt-5 text-gray-600">
                    Manage assignments, track student submissions and monitor progress.
                </p>

                {/* Dashboard Statistics */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <p className="font-medium text-gray-500">
                            Total Assignments
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-indigo-600">
                            {totalAssignments}
                        </h3>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <p className="font-medium text-gray-500">
                            Submitted
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-green-600">
                            {totalSubmitted}
                        </h3>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <p className="font-medium text-gray-500">
                            Pending Submissions
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-amber-600">
                            {pendingCount}
                        </h3>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <p className="font-medium text-gray-500">
                            Completion Rate
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-purple-600">
                            {completionRate}%
                        </h3>
                    </div>
                </div>

                {/* Create / Edit Assignment Form */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
                >
                    <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editingAssignment
                                ? "Edit Assignment"
                                : "Create New Assignment"}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Add assignment details and select students.
                        </p>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                            Assignment Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter assignment title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-200 bg-slate-50 p-3 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                            Description
                        </label>

                        <textarea
                            placeholder="Enter assignment description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="4"
                            className="w-full rounded-lg border border-gray-200 bg-slate-50 p-3 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                            Due Date
                        </label>

                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-200 bg-slate-50 p-3 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Drive Link */}
                    <div>
                        <label className="mb-2 block font-semibold text-gray-700">
                            Google Drive Link
                        </label>

                        <input
                            type="url"
                            placeholder="Paste Google Drive link"
                            value={driveLink}
                            onChange={(e) => setDriveLink(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-200 bg-slate-50 p-3 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />
                    </div>

                    {/* Student Selection */}
                    <div className="rounded-xl border border-gray-200 bg-slate-50 p-5">
                        <h3 className="mb-4 font-bold text-gray-800">
                            Assign to Students
                        </h3>

                        <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 font-medium text-gray-700">
                            <input
                                type="checkbox"
                                checked={
                                    students.length > 0 &&
                                    selectedStudents.length === students.length
                                }
                                onChange={handleSelectAll}
                                className="h-4 w-4 accent-indigo-600"
                            />
                            Select All Students
                        </label>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {students.map((student) => (
                                <label
                                    key={student.id}
                                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 text-gray-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedStudents.includes(student.id)}
                                        onChange={() =>
                                            handleStudentSelection(student.id)
                                        }
                                        className="h-4 w-4 accent-indigo-600"
                                    />

                                    {student.name}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
                        >
                            {editingAssignment
                                ? "Update Assignment"
                                : "Create Assignment"}
                        </button>

                        {editingAssignment && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* Created Assignments */}
                <div className="mt-10">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Created Assignments
                            </h2>

                            <p className="mt-1 text-gray-500">
                                View and manage your assignments.
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                            {myAssignments.length} Assignments
                        </span>
                    </div>

                    {/* Search and Filter */}
                    <div className="my-5 flex flex-col gap-4 sm:flex-row">
                        <input
                            type="text"
                            placeholder="Search assignments by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 rounded-lg border border-gray-200 bg-white p-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Submitted">Submitted</option>
                        </select>
                    </div>

                    {/* Assignment Cards */}
                    {filteredAssignments.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                            {myAssignments.length === 0
                                ? "No assignments created yet."
                                : "No assignments match your search or filter."}
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2">
                            {filteredAssignments.map((assignment) => {
                                const submittedCount = assignment.assignedTo.filter(
                                    (studentId) =>
                                        assignment.submissions?.[studentId] === "Submitted"
                                ).length;

                                const totalStudents = assignment.assignedTo.length;

                                const progress =
                                    totalStudents === 0
                                        ? 0
                                        : (submittedCount / totalStudents) * 100;

                                return (
                                    <div
                                        key={assignment.id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        {/* Card Header */}
                                        <div className="border-b border-gray-200 bg-slate-50 p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {assignment.title}
                                                </h3>

                                                <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                                                    Assignment
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-gray-500">
                                                Due Date: {assignment.dueDate}
                                            </p>
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-5">
                                            <p className="leading-relaxed text-gray-600">
                                                {assignment.description}
                                            </p>

                                            {/* Drive Link */}
                                            <a
                                                href={assignment.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-100"
                                            >
                                                Open Assignment ↗
                                            </a>

                                            {/* Assigned Students */}
                                            <div className="mt-5">
                                                <p className="mb-2 font-semibold text-gray-800">
                                                    Assigned Students
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {students
                                                        .filter((student) =>
                                                            assignment.assignedTo.includes(student.id)
                                                        )
                                                        .map((student) => (
                                                            <span
                                                                key={student.id}
                                                                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
                                                            >
                                                                {student.name}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>

                                            {/* Submission Status */}
                                            <div className="mt-5">
                                                <h4 className="mb-3 font-semibold text-gray-800">
                                                    Student Submission Status
                                                </h4>

                                                {assignment.assignedTo.map((studentId) => {
                                                    const student = students.find(
                                                        (student) => student.id === studentId
                                                    );

                                                    const status =
                                                        assignment.submissions?.[studentId] ||
                                                        "Pending";

                                                    return (
                                                        <div
                                                            key={studentId}
                                                            className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                                                        >
                                                            <span className="text-sm font-medium text-gray-700">
                                                                {student?.name}
                                                            </span>

                                                            <span
                                                                className={
                                                                    status === "Submitted"
                                                                        ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                                                                        : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
                                                                }
                                                            >
                                                                {status}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Progress */}
                                            <div className="mt-5 rounded-lg bg-gray-50 p-4">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        Submission Progress
                                                    </p>

                                                    <p className="text-sm font-bold text-indigo-600">
                                                        {submittedCount}/{totalStudents}
                                                    </p>
                                                </div>

                                                <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                                                    <div
                                                        className="h-full rounded-full bg-green-600 transition-all duration-500"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>

                                                <p className="mt-2 text-right text-xs font-semibold text-gray-500">
                                                    {Math.round(progress)}% completed
                                                </p>
                                            </div>

                                            {/* Edit and Delete */}
                                            <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(assignment)}
                                                    className="flex-1 rounded-lg bg-amber-50 px-4 py-2.5 font-semibold text-amber-700 transition hover:bg-amber-100"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(assignment.id)}
                                                    className="flex-1 rounded-lg bg-red-50 px-4 py-2.5 font-semibold text-red-700 transition hover:bg-red-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;