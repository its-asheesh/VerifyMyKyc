import React, { useState, useMemo } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  BarChart,
  Eye,
  MapPin,
  Mail,
  Phone,
  Building
} from "lucide-react";
import {
  useUsers,
  useUserStats,
  useUpdateUserRole,
  useToggleUserStatus,
} from "../hooks/useUsers";
import { useAnalyticsOverview } from "../hooks/useAnalytics";
import UserAnalyticsChart from "../components/dashboard/UserAnalyticsChart";
import UserDetailsModal from "../components/users/UserDetailsModal";
import type { User as UserType } from "../services/api/userApi";

// Import reusable components
import StatCard from "../components/common/StatCard";
import DataTable from "../components/common/DataTable";
import StatusBadge from "../components/common/StatusBadge";
import AdvancedFilters from "../components/common/AdvancedFilters";
import { exportToExcel, formatters } from "../utils/exportUtils";
import { formatDate } from "../utils/dateUtils";
import { getRoleConfig, STATUS_ICON_COLORS } from "../utils/statusUtils";
import type { Column } from "../components/common/DataTable";

type SortField = 'name' | 'email' | 'createdAt' | 'lastLogin' | 'role' | 'isActive';
type SortDirection = 'asc' | 'desc';

const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isUserChartOpen, setIsUserChartOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fetch data using React Query
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useUsers();
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const analyticsData = useAnalyticsOverview().data;
  const updateUserRole = useUpdateUserRole();
  const toggleUserStatus = useToggleUserStatus();

  // Filter configuration
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { value: 'user', label: 'Regular Users' },
        { value: 'admin', label: 'Admins' }
      ]
    },
    {
      key: 'emailVerified',
      label: 'Email Verification',
      type: 'select' as const,
      options: [
        { value: 'verified', label: 'Verified' },
        { value: 'unverified', label: 'Unverified' }
      ]
    },
    {
      key: 'dateRange',
      label: 'Registration Date',
      type: 'select' as const,
      options: [
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'last30days', label: 'Last 30 Days' },
        { value: 'last90days', label: 'Last 90 Days' },
        { value: 'custom', label: 'Custom Range' }
      ]
    }
  ];

  // Table columns configuration
  const columns: Column[] = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {value
                  ? value.split(" ").map((n: string) => n[0]).join("").toUpperCase()
                  : "NA"}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500 flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {row.email}
            </div>
            {row.phone && (
              <div className="text-sm text-gray-500 flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {row.phone}
              </div>
            )}
            <div className="flex items-center space-x-2 mt-1">
              <StatusBadge 
                status={row.emailVerified ? 'verified' : 'unverified'} 
                size="sm" 
              />
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'company',
      label: 'Company',
      render: (value, row) => (
        <div className="text-sm text-gray-900 flex items-center">
          {value ? (
            <>
              <Building className="w-4 h-4 mr-2 text-gray-400" />
              {value}
            </>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
          {row.location?.city && (
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {row.location.city}, {row.location.country}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      sortable: true,
      render: (value) => <StatusBadge status={value ? 'active' : 'inactive'} />
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => {
        const config = getRoleConfig(value);
        const IconComponent = config.icon;
        return (
          <div className="flex items-center space-x-2">
            <IconComponent className={`w-4 h-4 ${STATUS_ICON_COLORS[config.color as keyof typeof STATUS_ICON_COLORS] || STATUS_ICON_COLORS.gray}`} />
            <StatusBadge status={value} />
          </div>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'Joined',
      sortable: true,
      render: (value) => formatDate(value, 'short')
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (value) => value ? formatDate(value, 'short') : 'Never'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUserClick(row);
            }}
            className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center"
            title="View Details"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusToggle(row.id);
            }}
            className={`px-3 py-1 rounded-md text-xs font-medium ${
              row.isActive
                ? "bg-red-100 text-red-800 hover:bg-red-200"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {row.isActive ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRoleChange(
                row.id,
                row.role === "admin" ? "user" : "admin"
              );
            }}
            className="px-3 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
          >
            {row.role === "admin" ? "Make User" : "Make Admin"}
          </button>
        </div>
      )
    }
  ];

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company &&
          user.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone &&
          user.phone.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "inactive" && !user.isActive);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      const matchesEmailVerified =
        emailVerifiedFilter === "all" ||
        (emailVerifiedFilter === "verified" && user.emailVerified) ||
        (emailVerifiedFilter === "unverified" && !user.emailVerified);

      const matchesDateRange = (() => {
        if (dateRangeFilter === "all") return true;
        
        const userDate = new Date(user.createdAt);
        const now = new Date();
        
        switch (dateRangeFilter) {
          case "last7days":
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return userDate >= sevenDaysAgo;
          case "last30days":
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return userDate >= thirtyDaysAgo;
          case "last90days":
            const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            return userDate >= ninetyDaysAgo;
          case "custom":
            if (!customDateRange.start || !customDateRange.end) return true;
            const startDate = new Date(customDateRange.start);
            const endDate = new Date(customDateRange.end);
            return userDate >= startDate && userDate <= endDate;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesStatus && matchesRole && matchesEmailVerified && matchesDateRange;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'lastLogin':
          aValue = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
          bValue = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'isActive':
          aValue = a.isActive;
          bValue = b.isActive;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, searchTerm, statusFilter, roleFilter, emailVerifiedFilter, dateRangeFilter, customDateRange, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field as SortField);
      setSortDirection('asc');
    }
  };

  const handleUserClick = (user: UserType) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin"
  ) => {
    try {
      await updateUserRole.mutateAsync({ userId, role: newRole });
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleStatusToggle = async (userId: string) => {
    try {
      await toggleUserStatus.mutateAsync(userId);
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    switch (key) {
      case 'search':
        setSearchTerm(value);
        break;
      case 'status':
        setStatusFilter(value);
        break;
      case 'role':
        setRoleFilter(value);
        break;
      case 'emailVerified':
        setEmailVerifiedFilter(value);
        break;
      case 'dateRange':
        setDateRangeFilter(value);
        break;
      case 'customDateRange_start':
        setCustomDateRange(prev => ({ ...prev, start: value }));
        break;
      case 'customDateRange_end':
        setCustomDateRange(prev => ({ ...prev, end: value }));
        break;
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setRoleFilter("all");
    setEmailVerifiedFilter("all");
    setDateRangeFilter("all");
    setCustomDateRange({ start: '', end: '' });
    setSortField('createdAt');
    setSortDirection('desc');
  };

  // Export users to Excel
  const exportUsersToExcel = () => {
    const exportColumns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role', formatter: formatters.status },
      { key: 'isActive', label: 'Status', formatter: formatters.status },
      { key: 'company', label: 'Company' },
      { key: 'emailVerified', label: 'Email Verified', formatter: formatters.boolean },
      { key: 'lastLogin', label: 'Last Login', formatter: formatters.date },
      { key: 'createdAt', label: 'Created At', formatter: formatters.date }
    ];

    exportToExcel(filteredAndSortedUsers, exportColumns, {
      filename: 'users',
      includeTimestamp: true
    });
  };

  if (usersLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Users
          </h3>
          <p className="text-gray-600">
            Failed to load user data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">
            Manage your platform users and their subscriptions
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportUsersToExcel}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Excel
          </button>
          <button
            onClick={() => setIsUserChartOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <BarChart className="w-4 h-4 mr-2" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={CheckCircle}
          color="blue"
          loading={statsLoading}
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={CheckCircle}
          color="green"
          loading={statsLoading}
        />
        <StatCard
          title="Inactive Users"
          value={stats?.inactiveUsers || 0}
          icon={Clock}
          color="yellow"
          loading={statsLoading}
        />
        <StatCard
          title="This Month"
          value={stats?.newUsersThisMonth || 0}
          icon={Calendar}
          color="purple"
          loading={statsLoading}
        />
      </div>

      {/* Filters */}
      <AdvancedFilters
        filters={filterConfig}
        values={{
          search: searchTerm,
          status: statusFilter,
          role: roleFilter,
          emailVerified: emailVerifiedFilter,
          dateRange: dateRangeFilter,
          customDateRange_start: customDateRange.start,
          customDateRange_end: customDateRange.end
        }}
        onChange={handleFilterChange}
        onClear={clearFilters}
        searchPlaceholder="Search users by name, email, company, or phone..."
        showAdvanced={showAdvancedFilters}
        onToggleAdvanced={setShowAdvancedFilters}
      />

      {/* Users Table */}
      <DataTable
        data={filteredAndSortedUsers}
        columns={columns}
        loading={usersLoading}
        error={(usersError as unknown as Error)?.message}
        sortConfig={{ field: sortField, direction: sortDirection }}
        onSort={handleSort}
        onRowClick={handleUserClick}
        emptyMessage="No users found"
      />

      {/* User Analytics Chart Modal */}
      <UserAnalyticsChart
        isOpen={isUserChartOpen}
        onClose={() => setIsUserChartOpen(false)}
        data={analyticsData}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isUserDetailsOpen}
        onClose={() => {
          setIsUserDetailsOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;