import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'

function Settings() {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [user, setUser] = useState(null)
  const [files, setFiles] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [tags, setTags] = useState([])
  const [collections, setCollections] = useState([])
  const [searchHistory, setSearchHistory] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navItems = [
    {
      label: 'Dashboard',
      icon: '⌂',
      path: '/dashboard',
    },
    {
      label: 'Vault',
      icon: '▣',
      path: '/files',
    },
    {
      label: 'Search',
      icon: '⌕',
      path: '/search',
    },
    {
      label: 'AI Chat',
      icon: '✦',
      path: '/chat',
    },
    {
      label: 'Collections',
      icon: '▣',
      path: '/collections',
    },
    {
      label: 'Tags',
      icon: '#',
      path: '/tags',
    },
    {
      label: 'Bookmarks',
      icon: '☆',
      path: '/bookmarks',
    },
  ]

  const fetchSettingsData = async () => {
    setLoading(true)
    setError('')

    try {
      const results = await Promise.allSettled([
        api.get('/accounts/me/'),
        api.get('/files/'),
        api.get('/bookmarks/'),
        api.get('/tags/'),
        api.get('/collections/'),
        api.get('/search/history/'),
      ])

      if (results[0].status === 'fulfilled') {
        setUser(results[0].value.data)
      }

      if (results[1].status === 'fulfilled') {
        setFiles(results[1].value.data)
      }

      if (results[2].status === 'fulfilled') {
        setBookmarks(results[2].value.data)
      }

      if (results[3].status === 'fulfilled') {
        setTags(results[3].value.data)
      }

      if (results[4].status === 'fulfilled') {
        setCollections(results[4].value.data)
      }

      if (results[5].status === 'fulfilled') {
        setSearchHistory(results[5].value.data)
      }

      if (results[0].status === 'rejected') {
        setError('Unable to load profile information.')
      }
    } catch (error) {
      console.log('SETTINGS ERROR:', error.response?.data)
      setError('Unable to load settings information.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettingsData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/')
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) {
      return '0 B'
    }

    const units = ['B', 'KB', 'MB', 'GB']

    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(
      size >= 10 || unitIndex === 0 ? 0 : 1
    )} ${units[unitIndex]}`
  }

  const totalStorage = files.reduce(
    (total, file) => total + (file.file_size || 0),
    0
  )

  const getInitial = () => {
    if (!user?.username) {
      return 'U'
    }

    return user.username.charAt(0).toUpperCase()
  }

  const formatCreatedAt = (date) => {
    if (!date) {
      return 'Not available'
    }

    return new Date(date).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fa]">

        <aside
          className={`fixed left-0 top-0 z-50 hidden h-screen border-r border-[#dbe2e5] bg-white transition-all duration-300 lg:block ${
            sidebarOpen ? 'w-72' : 'w-20'
          }`}
        >
          <div
            className={`flex h-20 items-center border-b border-[#dbe2e5] ${
              sidebarOpen ? 'justify-between px-5' : 'justify-center'
            }`}
          >
            {sidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white">
                  ✦
                </div>

                <span className="text-2xl font-semibold tracking-tight text-[#242424]">
                  PersonalVault
                </span>
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white">
                ✦
              </div>
            )}
          </div>

          <nav className="flex h-[calc(100vh-5rem)] flex-col p-4">

            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`mb-3 flex w-full items-center rounded-xl py-3.5 text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
                sidebarOpen
                  ? 'justify-end gap-3 px-4'
                  : 'justify-center'
              }`}
            >
              {sidebarOpen && (
                <span className="text-sm font-medium">
                  Close window
                </span>
              )}

              <span className="text-xl font-semibold">
                {sidebarOpen ? '✕' : '›'}
              </span>
            </button>

            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`flex w-full items-center rounded-xl py-3.5 transition duration-200 ${
                      sidebarOpen
                        ? 'gap-4 px-4'
                        : 'justify-center'
                    } ${
                      isActive
                        ? 'bg-[#071E2D] text-white'
                        : 'text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
                    }`}
                    title={!sidebarOpen ? item.label : ''}
                  >
                    <span className="flex w-6 justify-center text-xl">
                      {item.icon}
                    </span>

                    {sidebarOpen && (
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-auto border-t border-[#dbe2e5] pt-4">
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className={`flex w-full items-center rounded-xl bg-[#071E2D] py-3.5 text-white ${
                  sidebarOpen
                    ? 'gap-4 px-4'
                    : 'justify-center'
                }`}
              >
                <span className="flex w-6 justify-center text-xl">
                  ⚙
                </span>

                {sidebarOpen && (
                  <span className="text-sm font-medium">
                    Settings
                  </span>
                )}
              </button>
            </div>

          </nav>
        </aside>

        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
          }`}
        >
          <header className="h-20 bg-[#071E2D]" />

          <main className="px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-sm text-[#5C7C89]">
              Loading settings...
            </p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#242424]">

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen border-r border-[#dbe2e5] bg-white transition-all duration-300 lg:block ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >

        {/* Branding */}
        <div
          className={`flex h-20 items-center border-b border-[#dbe2e5] ${
            sidebarOpen ? 'justify-between px-5' : 'justify-center'
          }`}
        >
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white">
                ✦
              </div>

              <span className="text-2xl font-semibold tracking-tight text-[#242424]">
                PersonalVault
              </span>
            </div>
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white">
              ✦
            </div>
          )}
        </div>

        <nav className="flex h-[calc(100vh-5rem)] flex-col p-4">

          {/* Sidebar Toggle */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`mb-3 flex w-full items-center rounded-xl py-3.5 text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
              sidebarOpen
                ? 'justify-end gap-3 px-4'
                : 'justify-center'
            }`}
            title={sidebarOpen ? 'Close window' : 'Open sidebar'}
          >
            {sidebarOpen && (
              <span className="text-sm font-medium">
                Close window
              </span>
            )}

            <span className="text-xl font-semibold">
              {sidebarOpen ? '✕' : '›'}
            </span>
          </button>

          {/* Main Navigation */}
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center rounded-xl py-3.5 transition duration-200 ${
                    sidebarOpen
                      ? 'gap-4 px-4'
                      : 'justify-center'
                  } ${
                    isActive
                      ? 'bg-[#071E2D] text-white'
                      : 'text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
                  }`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <span className="flex w-6 justify-center text-xl">
                    {item.icon}
                  </span>

                  {sidebarOpen && (
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Settings */}
          <div className="mt-auto border-t border-[#dbe2e5] pt-4">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              className={`flex w-full items-center rounded-xl bg-[#071E2D] py-3.5 text-white ${
                sidebarOpen
                  ? 'gap-4 px-4'
                  : 'justify-center'
              }`}
              title={!sidebarOpen ? 'Settings' : ''}
            >
              <span className="flex w-6 justify-center text-xl">
                ⚙
              </span>

              {sidebarOpen && (
                <span className="text-sm font-medium">
                  Settings
                </span>
              )}
            </button>
          </div>

        </nav>
      </aside>

      {/* Main */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
        }`}
      >

        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#1F4959] bg-[#071E2D] px-6 sm:px-8 lg:px-10">

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Settings
            </h1>

            <p className="mt-1 text-sm text-[#dbe7eb]">
              Manage your PersonalVault account and preferences.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-[#5C7C89] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1F4959]"
          >
            Logout
          </button>

        </header>

        <main className="px-6 py-8 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-6xl space-y-8">

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Profile */}
            <section className="rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#242424]">
                  Profile
                </h2>

                <p className="mt-1 text-sm text-[#5C7C89]">
                  Your account information.
                </p>
              </div>

              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#071E2D] text-2xl font-semibold text-white">
                  {getInitial()}
                </div>

                <div>
                  <p className="text-base font-semibold text-[#242424]">
                    {user?.username || 'User'}
                  </p>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    {user?.email || 'No email available'}
                  </p>
                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl bg-[#f7f9fa] p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#5C7C89]">
                    User ID
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#1F4959]">
                    {user?.id ?? 'Not available'}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f9fa] p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#5C7C89]">
                    Username
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#1F4959]">
                    {user?.username || 'Not available'}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f7f9fa] p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#5C7C89]">
                    Joined
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#1F4959]">
                    {formatCreatedAt(user?.created_at)}
                  </p>
                </div>

              </div>

              <div className="mt-4 rounded-xl bg-[#f7f9fa] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[#5C7C89]">
                  Account status
                </p>

                <p className="mt-1 text-sm font-medium text-[#1F4959]">
                  Active
                </p>
              </div>

            </section>

            {/* Storage & Data */}
            <section className="rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#242424]">
                  Storage & Data
                </h2>

                <p className="mt-1 text-sm text-[#5C7C89]">
                  Overview of your PersonalVault data.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-5">
                  <p className="text-sm text-[#5C7C89]">
                    Vault Files
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-[#071E2D]">
                    {files.length}
                  </p>
                </div>

                <div className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-5">
                  <p className="text-sm text-[#5C7C89]">
                    Storage Used
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-[#071E2D]">
                    {formatFileSize(totalStorage)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-5">
                  <p className="text-sm text-[#5C7C89]">
                    Collections
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-[#071E2D]">
                    {collections.length}
                  </p>
                </div>

                <div className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-5">
                  <p className="text-sm text-[#5C7C89]">
                    Tags
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-[#071E2D]">
                    {tags.length}
                  </p>
                </div>

              </div>

              <div className="mt-4 rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#242424]">
                      Bookmarks
                    </p>

                    <p className="mt-1 text-xs text-[#5C7C89]">
                      Saved links in your vault.
                    </p>
                  </div>

                  <span className="text-lg font-semibold text-[#1F4959]">
                    {bookmarks.length}
                  </span>
                </div>
              </div>

            </section>

            {/* Search History */}
            <section className="rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

              <div>
                <h2 className="text-lg font-semibold text-[#242424]">
                  Search History
                </h2>

                <p className="mt-1 text-sm text-[#5C7C89]">
                  Searches you've recently made in your vault.
                </p>
              </div>

              <div className="mt-5">

                {searchHistory.length === 0 ? (
                  <div className="rounded-xl bg-[#f7f9fa] p-5 text-sm text-[#5C7C89]">
                    No search history available.
                  </div>
                ) : (
                  <div className="max-h-64 space-y-2 overflow-y-auto pr-1">

                    {searchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4 rounded-lg bg-[#f7f9fa] px-4 py-3"
                      >
                        <span className="min-w-0 truncate text-sm text-[#242424]">
                          {item.query}
                        </span>

                        <span className="shrink-0 text-xs text-[#8a9ba2]">
                          {new Date(
                            item.searched_at
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}

                  </div>
                )}

              </div>

            </section>

            {/* Appearance - Phase 2 */}
            <section className="rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-semibold text-[#242424]">
                    Appearance
                  </h2>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Customize how PersonalVault looks.
                  </p>
                </div>

                <span className="rounded-lg bg-[#eef3f4] px-3 py-1.5 text-xs font-medium text-[#1F4959]">
                  Coming Soon
                </span>

              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">

                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-4 text-left opacity-60"
                >
                  <p className="font-medium text-[#242424]">
                    Light
                  </p>

                  <p className="mt-1 text-xs text-[#5C7C89]">
                    Default appearance
                  </p>
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-4 text-left opacity-60"
                >
                  <p className="font-medium text-[#242424]">
                    Dark
                  </p>

                  <p className="mt-1 text-xs text-[#5C7C89]">
                    Dark interface
                  </p>
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-4 text-left opacity-60"
                >
                  <p className="font-medium text-[#242424]">
                    System
                  </p>

                  <p className="mt-1 text-xs text-[#5C7C89]">
                    Follow device settings
                  </p>
                </button>

              </div>

            </section>

            {/* Security - Phase 2 */}
            <section className="rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-semibold text-[#242424]">
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Manage your account security.
                  </p>
                </div>

                <span className="rounded-lg bg-[#eef3f4] px-3 py-1.5 text-xs font-medium text-[#1F4959]">
                  Coming Soon
                </span>

              </div>

              <div className="mt-5 rounded-xl bg-[#f7f9fa] p-5">

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#242424]">
                      Change Password
                    </p>

                    <p className="mt-1 text-sm text-[#5C7C89]">
                      Update your PersonalVault password.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled
                    className="rounded-lg border border-[#dbe2e5] px-4 py-2 text-sm font-medium text-[#5C7C89] opacity-60"
                  >
                    Change
                  </button>
                </div>

              </div>

            </section>

            {/* AI Preferences - Phase 2 */}
            <section className="rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-semibold text-[#242424]">
                    AI Preferences
                  </h2>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Control how PersonalVault AI interacts with your documents.
                  </p>
                </div>

                <span className="rounded-lg bg-[#eef3f4] px-3 py-1.5 text-xs font-medium text-[#1F4959]">
                  Coming Soon
                </span>

              </div>

              <div className="mt-5 space-y-3">

                <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f7f9fa] p-5">
                  <div>
                    <p className="font-medium text-[#242424]">
                      Document-grounded answers
                    </p>

                    <p className="mt-1 text-sm text-[#5C7C89]">
                      Answer questions using your uploaded documents.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-5 w-5 opacity-60"
                    readOnly
                  />
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl bg-[#f7f9fa] p-5">
                  <div>
                    <p className="font-medium text-[#242424]">
                      Semantic document retrieval
                    </p>

                    <p className="mt-1 text-sm text-[#5C7C89]">
                      Use relevant document sections when answering.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="h-5 w-5 opacity-60"
                    readOnly
                  />
                </div>

              </div>

            </section>

            {/* Account */}
            <section className="rounded-xl border border-red-100 bg-white p-6 shadow-sm">

              <div>
                <h2 className="text-lg font-semibold text-[#242424]">
                  Account
                </h2>

                <p className="mt-1 text-sm text-[#5C7C89]">
                  Manage your PersonalVault session.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl bg-[#071E2D] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1F4959]"
                >
                  Logout
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-500 opacity-50"
                >
                  Delete Account
                </button>

              </div>

              <p className="mt-4 text-xs text-[#8a9ba2]">
                Account deletion will be available in a future update.
              </p>

            </section>

          </div>

        </main>
      </div>
    </div>
  )
}

export default Settings
