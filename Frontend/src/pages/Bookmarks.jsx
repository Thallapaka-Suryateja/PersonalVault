import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate, useLocation } from 'react-router-dom'

function Bookmarks() {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [bookmarks, setBookmarks] = useState([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const fetchBookmarks = async () => {
    try {
      const response = await api.get('/bookmarks/')
      setBookmarks(response.data)
    } catch (error) {
      console.log('BOOKMARKS ERROR:', error.response?.data)
      setError('Unable to load bookmarks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()

    if (!url.trim() || !title.trim() || creating) {
      return
    }

    setCreating(true)
    setError('')

    try {
      await api.post('/bookmarks/', {
        url: url.trim(),
        title: title.trim(),
        description: description.trim(),
      })

      setUrl('')
      setTitle('')
      setDescription('')

      await fetchBookmarks()
    } catch (error) {
      console.log('CREATE BOOKMARK ERROR:', error.response?.data)

      setError(
        error.response?.data?.detail ||
        error.response?.data?.url?.[0] ||
        error.response?.data?.title?.[0] ||
        'Unable to create bookmark.'
      )
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bookmarks/${id}/`)

      setBookmarks((prev) =>
        prev.filter((bookmark) => bookmark.id !== id)
      )
    } catch (error) {
      console.log('DELETE BOOKMARK ERROR:', error.response?.data)
      setError('Unable to delete bookmark.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/')
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fa]">

        {/* Sidebar */}
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
                className={`flex w-full items-center rounded-xl py-3.5 text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
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

        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
          }`}
        >
          <header className="flex h-20 items-center border-b border-[#1F4959] bg-[#071E2D] px-6 sm:px-8 lg:px-10">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Bookmarks
              </h1>

              <p className="mt-1 text-sm text-[#dbe7eb]">
                Save useful links for quick access.
              </p>
            </div>
          </header>

          <main className="px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-sm text-[#5C7C89]">
              Loading bookmarks...
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

        {/* Sidebar Header */}
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

          {/* Close / Open */}
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

          {/* Navigation */}
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
              className={`flex w-full items-center rounded-xl py-3.5 text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
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

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
        }`}
      >

        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#1F4959] bg-[#071E2D] px-6 sm:px-8 lg:px-10">

          <div>
            <h1 className="text-2xl font-semibold text-white">
              Bookmarks
            </h1>

            <p className="mt-1 text-sm text-[#dbe7eb]">
              Save useful links for quick access.
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

          <div className="mx-auto max-w-6xl">

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Add Bookmark */}
            <section className="mb-8 rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-[#242424]">
                  Add Bookmark
                </h2>

                <p className="mt-1 text-sm text-[#5C7C89]">
                  Save a useful link to your personal vault.
                </p>
              </div>

              <form
                onSubmit={handleCreate}
                className="space-y-4"
              >

                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] px-4 py-3 text-[#242424] outline-none transition focus:border-[#1F4959] focus:bg-white focus:ring-2 focus:ring-[#5C7C89]/20"
                />

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Bookmark title"
                  className="w-full rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] px-4 py-3 text-[#242424] outline-none transition focus:border-[#1F4959] focus:bg-white focus:ring-2 focus:ring-[#5C7C89]/20"
                />

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows="3"
                  className="w-full rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] px-4 py-3 text-[#242424] outline-none transition focus:border-[#1F4959] focus:bg-white focus:ring-2 focus:ring-[#5C7C89]/20"
                />

                <button
                  type="submit"
                  disabled={
                    creating ||
                    !url.trim() ||
                    !title.trim()
                  }
                  className="rounded-xl bg-[#071E2D] px-5 py-3 font-medium text-white transition duration-200 hover:bg-[#1F4959] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? 'Adding...'
                    : 'Add Bookmark'}
                </button>

              </form>

            </section>

            {/* Your Bookmarks */}
            <section>

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-[#242424]">
                    Your Bookmarks
                  </h2>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Keep useful links close at hand.
                  </p>
                </div>

                {bookmarks.length > 0 && (
                  <span className="rounded-lg bg-[#eef3f4] px-3 py-1.5 text-xs font-medium text-[#1F4959]">
                    {bookmarks.length} bookmark
                    {bookmarks.length !== 1 ? 's' : ''}
                  </span>
                )}

              </div>

              {bookmarks.length === 0 ? (
                <div className="rounded-xl border border-[#dbe2e5] bg-white p-8 text-center shadow-sm">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3f4] text-xl text-[#1F4959]">
                    ☆
                  </div>

                  <p className="font-medium text-[#242424]">
                    No bookmarks yet
                  </p>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Add your first bookmark above.
                  </p>

                </div>
              ) : (
                <div className="space-y-4">

                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="rounded-xl border border-[#dbe2e5] bg-white p-5 shadow-sm transition duration-200 hover:border-[#5C7C89] hover:shadow-md"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">

                          <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef3f4] text-lg text-[#1F4959]">
                              ☆
                            </div>

                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold text-[#242424]">
                                {bookmark.title}
                              </h3>

                              <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 block break-all text-sm text-[#1F4959] hover:underline"
                              >
                                {bookmark.url}
                              </a>
                            </div>

                          </div>

                          {bookmark.description && (
                            <p className="mt-4 text-sm leading-6 text-[#5C7C89]">
                              {bookmark.description}
                            </p>
                          )}

                          <p className="mt-3 text-xs text-[#8a9ba2]">
                            {new Date(
                              bookmark.created_at
                            ).toLocaleString()}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() => handleDelete(bookmark.id)}
                          className="shrink-0 rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                        >
                          Delete
                        </button>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </section>

          </div>
        </main>
      </div>
    </div>
  )
}

export default Bookmarks
