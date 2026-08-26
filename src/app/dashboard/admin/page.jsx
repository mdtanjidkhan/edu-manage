import { FiUsers, FiUserCheck, FiDollarSign, FiBookOpen } from "react-icons/fi";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-base-content">Dashboard Overview</h2>
        <p className="text-sm text-base-content/70">Welcome back! Here is what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="stat bg-base-100 shadow-md border border-base-200 rounded-2xl">
          <div className="stat-figure text-primary">
            <FiUsers size={32} />
          </div>
          <div className="stat-title">Total Students</div>
          <div className="stat-value text-primary">1,250</div>
          <div className="stat-desc font-medium text-emerald-600">↗︎ 12% more than last year</div>
        </div>

        {/* Card 2 */}
        <div className="stat bg-base-100 shadow-md border border-base-200 rounded-2xl">
          <div className="stat-figure text-secondary">
            <FiUserCheck size={32} />
          </div>
          <div className="stat-title">Total Teachers</div>
          <div className="stat-value text-secondary">48</div>
          <div className="stat-desc font-medium text-info">All Active</div>
        </div>

        {/* Card 3 */}
        <div className="stat bg-base-100 shadow-md border border-base-200 rounded-2xl">
          <div className="stat-figure text-accent">
            <FiBookOpen size={32} />
          </div>
          <div className="stat-title">Attendance Today</div>
          <div className="stat-value text-accent">94.5%</div>
          <div className="stat-desc font-medium text-emerald-600">↗︎ 2% higher than yesterday</div>
        </div>

        {/* Card 4 */}
        <div className="stat bg-base-100 shadow-md border border-base-200 rounded-2xl">
          <div className="stat-figure text-warning">
            <FiDollarSign size={32} />
          </div>
          <div className="stat-title">Pending Fees</div>
          <div className="stat-value text-warning">৳45.5k</div>
          <div className="stat-desc font-medium text-error">15 Students Due</div>
        </div>
      </div>

      {/* Recent Activity / Table Area */}
      <div className="card bg-base-100 shadow-md border border-base-200">
        <div className="card-body">
          <h3 className="card-title text-lg mb-2">Recent Student Enrolments</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Roll</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>101</td>
                  <td>Rahim Ahmed</td>
                  <td>Class 9</td>
                  <td><span className="badge badge-success badge-sm">Active</span></td>
                </tr>
                <tr>
                  <td>102</td>
                  <td>Sumaiya Akter</td>
                  <td>Class 10</td>
                  <td><span className="badge badge-success badge-sm">Active</span></td>
                </tr>
                <tr>
                  <td>103</td>
                  <td>Tanvir Hasan</td>
                  <td>Class 8</td>
                  <td><span className="badge badge-warning badge-sm">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}