"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../redux/hooks"
import {
  Search,
  ChevronDown,
  MenuIcon,
  X,
  Shield,
  Users,
  CreditCard,
  FileText,
  Building,
  Zap,
  Award,
  BookOpen,
  HelpCircle,
  User,
  Briefcase,
} from "lucide-react"

// Enhanced Button Component
const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  ...props
}: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "contained" | "outlined" | "ghost" | "gradient"
  size?: "default" | "sm" | "lg"
  onClick?: () => void
  [key: string]: any
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const variantClasses = {
    default: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
    contained: "bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl",
    outlined: "border-2 border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50",
    ghost: "text-gray-700 hover:text-blue-600 hover:bg-blue-50",
    gradient:
      "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl",
  }

  const sizeClasses = {
    default: "px-4 py-2.5 text-sm",
    sm: "px-3 py-2 text-xs",
    lg: "px-8 py-4 text-base",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  )
}

const IconButton = ({
  children,
  className = "",
  onClick,
  ...props
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  [key: string]: any
}) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className={`p-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </motion.button>
)

const Menu = ({
  isOpen,
  onClose,
  children,
  className = "",
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`absolute top-full left-0 mt-3  rounded-2xl shadow-2xl border border-gray-100 min-w-[280px] py-3 z-50 backdrop-blur-lg bg-white/95 ${className}`}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

const MenuItem = ({
  children,
  onClick,
  icon: Icon,
  description,
  className = "",
  href,
}: {
  children: React.ReactNode
  onClick?: () => void
  icon?: any
  description?: string
  className?: string
  href?: string
}) => {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Navigate if href is provided
    if (href) {
      navigate(href)
    }

    // Call additional onClick if provided
    if (onClick) {
      onClick()
    }
  }

  return (
    <motion.div
      whileHover={{ backgroundColor: "#f8fafc", x: 6 }}
      className={`px-5 py-4 cursor-pointer flex items-start gap-4 text-gray-700 hover:text-blue-600 transition-all duration-300 ${className}`}
      onClick={handleClick}
    >
      {Icon && (
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold text-sm">{children}</div>
        {description && <div className="text-xs text-gray-500 mt-1">{description}</div>}
      </div>
    </motion.div>
  )
}

const navItems = [
  {
    label: "Products",
    dropdown: true,
    items: [
      {
        label: "Identity Verification",
        icon: Shield,
        description: "Verify government IDs instantly",
        href: "/products?category=identity",
      },
      {
        label: "Document Verification",
        icon: FileText,
        description: "Authenticate official documents",
        href: "/products?category=document",
      },
      // {
      //   label: "Biometric Verification",
      //   icon: Users,
      //   description: "Face matching & liveness detection",
      //   href: "/products?category=biometric",
      // },
      {
        label: "Address Verification",
        icon: Building,
        description: "Confirm residential addresses",
        href: "/products?category=address",
      },
      {
        label: "Business Verification",
        icon: Briefcase,
        description: "Verify business registries",
        href: "/products?category=business",
      },
    ],
  },
  {
    label: "Solutions",
    dropdown: true,
    items: [
      {
        label: "Banking & Finance",
        icon: CreditCard,
        description: "KYC for financial institutions",
        href: "/solutions?industry=banking",
      },
      {
        label: "Government Services",
        icon: Building,
        description: "Citizen verification solutions",
        href: "/solutions?industry=government",
      },
      {
        label: "Healthcare",
        icon: Shield,
        description: "Patient identity verification",
        href: "/solutions?industry=healthcare",
      },
      {
        label: "E-commerce",
        icon: Zap,
        description: "Customer onboarding solutions",
        href: "/solutions?industry=ecommerce",
      },
    ],
  },
  { label: "Pricing", link: "/#pricing" },
  // {
  //   label: "Resources",
  //   dropdown: true,
  //   items: [
  //     {
  //       label: "Documentation",
  //       icon: BookOpen,
  //       description: "API guides and tutorials",
  //       href: "/documentation",
  //     },
  //     {
  //       label: "API Reference",
  //       icon: FileText,
  //       description: "Complete API documentation",
  //       href: "/api-reference",
  //     },
  //     {
  //       label: "Case Studies",
  //       icon: Award,
  //       description: "Success stories and examples",
  //       href: "/resources?type=case-study",
  //     },
  //     {
  //       label: "Help Center",
  //       icon: HelpCircle,
  //       description: "Support and FAQs",
  //       href: "/help",
  //     },
  //   ],
  // },
  {
    label: "Company",
    dropdown: true,
    items: [
      {
        label: "About Us",
        icon: Users,
        description: "Our story and mission",
        href: "/about",
      },
      {
        label: "Careers",
        icon: Award,
        description: "Join our growing team",
        href: "/careers",
      },
      // {
      //   label: "News & Updates",
      //   icon: FileText,
      //   description: "Latest company news",
      //   href: "/news",
      // },
      // {
      //   label: "Partners",
      //   icon: Building,
      //   description: "Our trusted partners",
      //   href: "/partners",
      // },
    ],
  },
  { label: "Contact Us", href: "/contact" },
]

export default function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  
  const [openMenus, setOpenMenus] = useState<{ [key: number]: boolean }>({})
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [logoAvailable, setLogoAvailable] = useState(true)
  const menuTimeouts = useRef<{ [key: number]: NodeJS.Timeout }>({})

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(menuTimeouts.current).forEach(clearTimeout)
    }
  }, [])

  const handleMenuToggle = (index: number) => {
    setOpenMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const handleMenuClose = (index: number) => {
    // Clear any existing timeout
    if (menuTimeouts.current[index]) {
      clearTimeout(menuTimeouts.current[index])
    }

    // Set a delay before closing to allow mouse movement to dropdown
    menuTimeouts.current[index] = setTimeout(() => {
      setOpenMenus((prev) => ({
        ...prev,
        [index]: false,
      }))
    }, 150) // 150ms delay
  }

  const handleMenuEnter = (index: number) => {
    // Clear any pending close timeout
    if (menuTimeouts.current[index]) {
      clearTimeout(menuTimeouts.current[index])
    }

    setOpenMenus((prev) => ({ ...prev, [index]: true }))
  }

  const handleMenuLeave = (index: number) => {
    // Set a delay before closing
    menuTimeouts.current[index] = setTimeout(() => {
      setOpenMenus((prev) => ({ ...prev, [index]: false }))
    }, 200) // 200ms delay
  }

  const handleDropdownEnter = (index: number) => {
    // Clear any pending close timeout when entering dropdown
    if (menuTimeouts.current[index]) {
      clearTimeout(menuTimeouts.current[index])
    }
  }

  const handleDropdownLeave = (index: number) => {
    // Close immediately when leaving dropdown area
    setOpenMenus((prev) => ({ ...prev, [index]: false }))
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleSearch = () => {
    setSearchOpen(!searchOpen)
  }

  const handleNavItemClick = (item: any) => {
    if (item.label === "Pricing") {
      if (window.location.pathname === "/") {
        const el = document.getElementById("pricing");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/", { replace: false });
        setTimeout(() => {
          const el = document.getElementById("pricing");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 400); // Wait for navigation
      }
    } else if (item.href) {
      navigate(item.href)
    }
  }

  const handleMobileNavItemClick = (item: any, index: number) => {
    if (item.label === "Pricing") {
      if (window.location.pathname === "/") {
        const el = document.getElementById("pricing");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        handleMenuClose(index);
        
      } else {
        navigate("/", { replace: false });
        setTimeout(() => {
          const el = document.getElementById("pricing");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 400); // Wait for navigation
        handleMenuClose(index);
      }
    } else if (item.href) {
      navigate(item.href)
      setMobileMenuOpen(false)
    } else if (item.dropdown) {
      handleMenuToggle(index)
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100"
          : "bg-white shadow-sm border-b-2 border-blue-500"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 ">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center cursor-pointer pl-2 md:pl-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate("/")}
          >
          {logoAvailable ? (
            <img
              src="/verifymykyclogo.svg"
              alt="VerifyMyKyc"
              className="h-12 md:h-12 w-auto"
              onError={() => setLogoAvailable(false)}
            />
          ) : (
            <div className="font-extrabold tracking-tight leading-none flex items-baseline">
              <span className="text-2xl md:text-3xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Verify</span>
              <span className="ml-1 text-2xl md:text-3xl bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">MyKyc</span>
            </div>
          )}
        </motion.div>


          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
            {navItems.map((item, index) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => handleMenuEnter(index)}
                    onMouseLeave={() => handleMenuLeave(index)}
                  >
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-5 py-3 rounded-xl"
                      onClick={() => handleMenuToggle(index)}
                    >
                      {item.label}
                      <motion.div animate={{ rotate: openMenus[index] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </Button>
                    <div
                      onMouseEnter={() => handleDropdownEnter(index)}
                      onMouseLeave={() => handleDropdownLeave(index)}
                    >
                      <Menu
                        isOpen={openMenus[index]}
                        onClose={() => setOpenMenus((prev) => ({ ...prev, [index]: false }))}
                      >
                        {item.items?.map((subItem, subIndex) => (
                          <MenuItem
                            key={subIndex}
                            icon={subItem.icon}
                            description={subItem.description}
                            href={subItem.href}
                          >
                            {subItem.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  </div>
                ) : (
                  <Button variant="ghost" className="px-5 py-3 rounded-xl" onClick={() => handleNavItemClick(item)}>
                    {item.label}
                  </Button>
                )}
              </div>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search */}
            {/* <div className="relative">
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="absolute right-16 top-1/2 -translate-y-1/2"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search services, docs..."
                        className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm bg-white/95 backdrop-blur-sm shadow-lg"
                        autoFocus
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <IconButton onClick={toggleSearch}>
                <Search className="w-5 h-5" />
              </IconButton>
            </div> */}

            {/* CTA Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Button 
                      variant="outlined" 
                      size="default"
                      onClick={() => navigate('/admin/dashboard')}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button 
                    variant="outlined" 
                    size="default"
                    onClick={() => navigate('/profile')}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outlined" 
                    size="default"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    variant="gradient" 
                    size="default"
                    onClick={() => navigate('/register')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile CTA */}
            {/* <Button variant="gradient" size="sm" className="sm:hidden">
              <Shield className="w-3 h-3" />
            </Button> */}

            {/* Mobile Menu Toggle */}
            <IconButton className="lg:hidden" onClick={toggleMobileMenu}>
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MenuIcon className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </IconButton>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer py-2"
                    onClick={() => handleMobileNavItemClick(item, index)}
                  >
                    <span className="font-semibold text-gray-900 text-lg">{item.label}</span>
                    {item.dropdown && (
                      <motion.div animate={{ rotate: openMenus[index] ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    )}
                  </div>
                  <AnimatePresence>
                    {item.dropdown && openMenus[index] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 space-y-3 overflow-hidden border-l-2 border-blue-100"
                      >
                        {item.items?.map((subItem, subIndex) => (
                          <motion.div
                            key={subIndex}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: subIndex * 0.05 }}
                            className="flex items-center gap-3 py-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                            onClick={() => {
                              if (subItem.href) {
                                navigate(subItem.href)
                                setMobileMenuOpen(false)
                                setOpenMenus({}) // Close all menus
                              }
                            }}
                          >
                            {subItem.icon && (
                              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                <subItem.icon className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">{subItem.label}</div>
                              {subItem.description && (
                                <div className="text-xs text-gray-500">{subItem.description}</div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Mobile CTA Buttons */}
              <div className="pt-6 border-t border-gray-100 space-y-3">
                {isAuthenticated ? (
                  <>
                    {user?.role === 'admin' && (
                      <Button 
                        variant="outlined" 
                        className="w-full justify-center"
                        onClick={() => {
                          navigate('/admin/dashboard')
                          setMobileMenuOpen(false)
                        }}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    )}
                    <Button 
                      variant="outlined" 
                      className="w-full justify-center"
                      onClick={() => {
                        navigate('/profile')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outlined" 
                      className="w-full justify-center"
                      onClick={() => {
                        navigate('/login')
                        setMobileMenuOpen(false)
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="gradient" 
                      className="w-full justify-center"
                      onClick={() => {
                        navigate('/register')
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}