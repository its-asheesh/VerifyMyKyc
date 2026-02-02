import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  IndianRupee,
  Users,
  BarChart3,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  Package,
  Image,
  Home,
  Globe,
  Tag,
  Mail,
  MessageSquare,
  FileText,
} from 'lucide-react'
import SearchBar from '../common/SearchBar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Order Management', href: '/orders', icon: Package },
    { name: 'Pricing Management', href: '/pricing', icon: IndianRupee },
    { name: 'Coupon Management', href: '/coupons', icon: Tag },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Location Analytics', href: '/location-analytics', icon: Globe },
    { name: 'Carousel Management', href: '/carousel', icon: Image },
    { name: 'Reviews', href: '/reviews', icon: MessageSquare },
    { name: 'Blog', href: '/blog', icon: FileText },
    { name: 'Subscribers', href: '/subscribers', icon: Mail },
  ]

  const isActive = (href: string) => {
    return location.pathname === href
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-inter">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-sm transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-20 px-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">VerifyMyKyc</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              <div className="px-4 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Main Menu
              </div>
              {navigation.slice(0, 7).map((item) => {
                const IconComponent = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${active
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <IconComponent className={`mr-3 h-5 w-5 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                    {item.name}
                  </Link>
                )
              })}

              <div className="px-4 mt-8 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Administration
              </div>
              {navigation.slice(7).map((item) => {
                const IconComponent = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${active
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <IconComponent className={`mr-3 h-5 w-5 transition-colors ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-700">Admin User</p>
                <p className="text-xs text-slate-500 truncate">admin@verifymykyc.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        {/* Header */}
        <header className="glass sticky top-0 z-30 border-b border-indigo-100/50">
          <div className="flex items-center justify-between h-20 px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 max-w-lg lg:max-w-xs ml-4 lg:ml-0">
              <SearchBar
                value={globalSearch}
                onChange={setGlobalSearch}
                placeholder="Search resources..."
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {children}
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout 