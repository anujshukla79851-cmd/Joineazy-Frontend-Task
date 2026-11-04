 function StudentDashboard({ user, assignments, setAssignments, onLogout }) {
    // Get assignments assigned to this student
    const studentAssignments = assignments.filter((assignment) =>
        assignment.assignedTo.includes(user.id)
    );

    // Count submitted assignments
    const submittedCount = studentAssignments.filter(
        (assignment) => assignment.submissions?.[user.id] === "Submitted"
    ).length;

    // Count pending assignments
    const pendingCount = studentAssignments.length - submittedCount;

    // Calculate completion percentage
    const completionRate =
        studentAssignments.length === 0
            ? 0
            : Math.round((submittedCount / studentAssignments.length) * 100);

    // Submit assignment
    function handleSubmit(assignmentId) {
        const confirmSubmission = window.confirm(
            "Are you sure you have submitted this assignment?"
        );

        if (confirmSubmission) {
            setAssignments((previousAssignments) =>
                previousAssignments.map((item) =>
                    item.id === assignmentId
                        ? {
                              ...item,
                              submissions: {
                                  ...item.submissions,
                                  [user.id]: "Submitted",
                              },
                          }
                        : item
                )
            );
        }
    }

    // Check overdue assignments
    function isOverdue(assignment) {
        const status = assignment.submissions?.[user.id] || "Pending";

        return (
            status !== "Submitted" &&
            assignment.dueDate &&
            new Date(assignment.dueDate) < new Date().setHours(0, 0, 0, 0)
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white shadow-lg sm:flex-row sm:items-center md:p-8">
                    <div>
                        <p className="mb-2 text-sm font-medium tracking-wide text-blue-100">
                            JOINEAZY | STUDENT PANEL
                        </p>

                        <h1 className="text-3xl font-bold md:text-4xl">
                            Student Dashboard
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
                    Track your assignments, deadlines and submission progress.
                </p>

                {/* Statistics */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Total Assignments */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <p className="font-medium text-gray-500">
                            Total Assignments
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-indigo-600">
                            {studentAssignments.length}
                        </h3>
                    </div>

                    {/* Submitted */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <p className="font-medium text-gray-500">
                            Submitted Assignments
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-green-600">
                            {submittedCount}
                        </h3>
                    </div>

                    {/* Pending */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                        <p className="font-medium text-gray-500">
                            Pending Assignments
                        </p>

                        <h3 className="mt-3 text-3xl font-bold text-amber-600">
                            {pendingCount}
                        </h3>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">
                                Overall Progress
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Track your assignment completion.
                            </p>
                        </div>

                        <span className="rounded-full bg-indigo-50 px-4 py-2 font-bold text-indigo-700">
                            {completionRate}%
                        </span>
                    </div>

                    <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>

                    <p className="mt-3 text-sm text-gray-500">
                        {submittedCount} of {studentAssignments.length} assignments completed
                    </p>
                </div>

                {/* Assignment List */}
                <div className="mt-10">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Your Assignments
                            </h2>

                            <p className="mt-1 text-gray-500">
                                View your assigned tasks and submission status.
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                            {studentAssignments.length} Assignments
                        </span>
                    </div>

                    {/* No Assignments */}
                    {studentAssignments.length === 0 ? (
                        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-8 text-center">
                            <p className="text-lg font-semibold text-gray-700">
                                No assignments yet
                            </p>

                            <p className="mt-2 text-gray-500">
                                Your professor has not assigned any tasks to you.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-5 grid gap-5 md:grid-cols-2">
                            {studentAssignments.map((assignment) => {
                                const status =
                                    assignment.submissions?.[user.id] || "Pending";

                                const overdue = isOverdue(assignment);

                                return (
                                    <div
                                        key={assignment.id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        {/* Assignment Header */}
                                        <div className="border-b border-gray-200 bg-slate-50 p-5">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-xl font-bold text-gray-800">
                                                    {assignment.title}
                                                </h3>

                                                <span
                                                    className={
                                                        status === "Submitted"
                                                            ? "shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                                                            : "shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
                                                    }
                                                >
                                                    {status}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-gray-500">
                                                Due Date: {assignment.dueDate}
                                            </p>
                                        </div>

                                        {/* Assignment Details */}
                                        <div className="p-5">
                                            <p className="leading-relaxed text-gray-600">
                                                {assignment.description}
                                            </p>

                                            {/* Overdue Warning */}
                                            {overdue && (
                                                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2">
                                                    <p className="text-sm font-medium text-red-600">
                                                        This assignment is overdue.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Assignment Link */}
                                            <a
                                                href={assignment.driveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 font-semibold text-blue-700 transition hover:bg-blue-100"
                                            >
                                                Open Assignment ↗
                                            </a>

                                            {/* Submission Status */}
                                            <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
                                                <span className="font-medium text-gray-700">
                                                    Submission Status
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

                                            {/* Submit Button */}
                                            {status !== "Submitted" ? (
                                                <button
                                                    onClick={() =>
                                                        handleSubmit(assignment.id)
                                                    }
                                                    className="mt-5 w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                                                >
                                                    I Have Submitted
                                                </button>
                                            ) : (
                                                <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-center">
                                                    <p className="font-semibold text-green-700">
                                                        Assignment Submitted Successfully
                                                    </p>
                                                </div>
                                            )}
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

export default StudentDashboard;