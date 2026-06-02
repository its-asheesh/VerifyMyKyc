import React, { useState, useMemo, useEffect } from "react";
import {
  Users as UsersIcon,
  UserCheck,
  UserX,
  BarChart,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Building,
  Eye,
  Loader2,
  XCircle,
} from "lucide-react";
import {
  useUsers,
  useUserStats,
  useUpdateUserRole,
  useToggleUserStatus,
} from "../hooks/useUsers";
import { useAnalyticsOverview } from "../hooks/useAnalytics";
import UserAnalyticsModal from "../components/dashboard/UserAnalyticsModal";
import UserDetailsModal from "../components/users/UserDetailsModal";
import AddTokensModal from "../components/users/AddTokensModal";
import type { User as UserType } from "../services/api/userApi";

// Import reusable components
import StatusBadge from "../components/common/StatusBadge";
import { StatCard, DataTable, AdvancedFilters, Button } from '../components/common';
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
  // @ts-ignore
  const [sortField, setSortField] = useState<SortField>('createdAt');
  // @ts-ignore
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isUserChartOpen, setIsUserChartOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [userForTokens, setUserForTokens] = useState<UserType | null>(null);


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
        { value: 'all', label: 'All Time' },
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
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
              <span className="text-sm font-bold text-indigo-700">
                {value
                  ? value.split(" ").map((n: string) => n[0]).join("").toUpperCase()
                  : "NA"}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      label: 'Contact & Verification',
      render: (_, row) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span className={`text - xs ${row.emailVerified ? 'text-green-600 font-medium' : 'text-yellow-600'} `}>
              {row.emailVerified ? 'Email Verified' : 'Email Pending'}
            </span>
          </div>
          {row.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span className={`text - xs ${row.phoneVerified ? 'text-green-600 font-medium' : 'text-yellow-600'} `}>
                {row.phone} {row.phoneVerified ? '(Verified)' : '(Pending)'}
              </span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (_, row) => row.location?.city || row.location?.country ? (
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
          {row.location.city && <span>{row.location.city}, </span>}
          {row.location.country && <span>{row.location.country}</span>}
        </div>
      ) : (
        <span className="text-xs text-gray-400 italic">Unknown</span>
      )
    },
    {
      key: 'company',
      label: 'Company',
      render: (value) => value ? (
        <div className="flex items-center text-sm text-gray-900">
          <Building className="w-3.5 h-3.5 mr-2 text-gray-400" />
          {value}
        </div>
      ) : (
        <span className="text-gray-400">-</span>
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
            <IconComponent className={`w - 4 h - 4 ${STATUS_ICON_COLORS[config.color as keyof typeof STATUS_ICON_COLORS] || STATUS_ICON_COLORS.gray} `} />
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
        <div className="flex items-center justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); handleUserClick(row); }}
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            View Details
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



  const handleUserClick = (user: UserType) => {
    // Get the latest user data from the users array to ensure we have the most up-to-date information
    const latestUser = users.find(u => u.id === user.id) || user;
    setSelectedUser(latestUser);
    setIsUserDetailsOpen(true);
  };

  // Keep selectedUser in sync with the latest data from users array
  useEffect(() => {
    if (selectedUser && isUserDetailsOpen) {
      const latestUser = users.find(u => u.id === selectedUser.id);
      if (latestUser && (
        latestUser.emailVerified !== selectedUser.emailVerified ||
        latestUser.phoneVerified !== selectedUser.phoneVerified ||
        latestUser.isActive !== selectedUser.isActive ||
        latestUser.role !== selectedUser.role
      )) {
        setSelectedUser(latestUser);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, isUserDetailsOpen]);





  const handleAddTokens = (user: UserType) => {
    setUserForTokens(user);
    setIsTokenModalOpen(true);
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
        // Clear custom date range if switching away from "custom"
        if (value !== 'custom') {
          setCustomDateRange({ start: '', end: '' });
        }
        break;
      case 'dateRange_start':
        setCustomDateRange(prev => ({ ...prev, start: value }));
        break;
      case 'dateRange_end':
        setCustomDateRange(prev => ({ ...prev, end: value }));
        break;
    }
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
            Failed to load user data. Please try again. <br />
            <span className="text-red-500 text-sm">{(usersError as Error)?.message}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      {/* Page Header */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Monitor user growth, manage permissions, and track verification status.</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={exportUsersToExcel}
            variant="outline"
            size="md"
            leftIcon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
            }
          >
            Export Excel
          </Button>
          <Button
            onClick={() => setIsUserChartOpen(true)}
            variant="primary"
            size="md"
            className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 text-white border-0"
            leftIcon={<BarChart className="w-4 h-4" />}
          >
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={UsersIcon}
          change={`${stats?.trends?.users?.percentage || 0}% `}
          changeType={stats?.trends?.users?.direction === 'up' ? 'positive' : 'negative'}
          color="blue"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          icon={UserCheck}
          change={`${stats?.trends?.active?.percentage || 0}% `}
          changeType={stats?.trends?.active?.direction === 'up' ? 'positive' : 'negative'}
          color="green"
        />
        <StatCard
          title="Inactive Users"
          value={stats?.inactiveUsers || 0}
          icon={UserX}
          change={`${stats?.trends?.active?.percentage || 0}% `}
          changeType={stats?.trends?.active?.direction === 'up' ? 'negative' : 'positive'}
          color="orange"
        />
        <StatCard
          title="Total Admins"
          value={stats?.totalAdmins ?? (stats as any)?.adminUsers ?? 0}
          icon={ShieldCheck}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      {/* Filters */}
      <AdvancedFilters
        filters={filterConfig}
        values={{
          search: searchTerm,
          status: statusFilter,
          role: roleFilter,
          emailVerified: emailVerifiedFilter,
          dateRange: dateRangeFilter,
        }}
        onChange={handleFilterChange}
        onClear={() => {
          setSearchTerm("");
          setStatusFilter("all");
          setRoleFilter("all");
          setEmailVerifiedFilter("all");
          setDateRangeFilter("all");
          setCustomDateRange({ start: '', end: '' });
        }}
        searchPlaceholder="Search users..."
      />

      {/* User Table */}
      <DataTable
        columns={columns}
        data={filteredAndSortedUsers}
        loading={usersLoading}
      />

      <UserAnalyticsModal
        isOpen={isUserChartOpen}
        onClose={() => setIsUserChartOpen(false)}
        data={analyticsData}
      />

      <UserDetailsModal
        isOpen={isUserDetailsOpen}
        onClose={() => {
          setIsUserDetailsOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onStatusToggle={toggleUserStatus.mutate}
        onRoleChange={(userId, role) => updateUserRole.mutate({ userId, role })}
        onAddTokens={handleAddTokens}
      />

      <AddTokensModal
        isOpen={isTokenModalOpen}
        onClose={() => {
          setIsTokenModalOpen(false);
          setUserForTokens(null);
        }}
        user={userForTokens}
      />
    </div>
  );
};

export default Users;