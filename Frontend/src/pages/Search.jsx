import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate, useLocation } from 'react-router-dom'

function Search() {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHistory = async () => {
    try {
      const response = await api.get('/search/history/')
      setHistory(response.data)
    } catch (error) {
      console.log('HISTORY ERROR:', error.response?.data)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      return
    }

    setQuery(searchQuery)
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/search/', {
        params: {
          q: searchQuery,
        },
      })

      console.log('SEARCH RESPONSE:', response.data)
      setResults(response.data)

      // Refresh history because this search was just saved by the backend
      fetchHistory()
    } catch (error) {
      console.log('SEARCH ERROR:', error.response?.data)

      setError(
        error.response?.data?.error || 'Unable to perform search.'
      )

      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleSearch()
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
      icon: '📁',
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

          {/* Close / Open Sidebar */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`mb-3 flex w-full items-center rounded-xl py-3.5 text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
              sidebarOpen
                ? 'justify-end gap-3 px-4'
                : 'justify-center'
            }`}
            title={
              sidebarOpen
                ? 'Close window'
                : 'Open sidebar'
            }
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

          {/* Search History */}
          {sidebarOpen && (
            <div className="mt-5 flex min-h-0 flex-1 flex-col">
              <div className="mb-3 border-t border-[#dbe2e5] pt-4">
                <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-[#5C7C89]">
                  Search History
                </h2>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                {historyLoading ? (
                  <div className="px-2 py-3 text-sm text-[#5C7C89]">
                    Loading history...
                  </div>
                ) : history.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-[#5C7C89]">
                    No searches yet.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSearch(item.query)}
                        className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition duration-200 hover:bg-[#f1f5f6]"
                      >
                        <span className="mt-0.5 shrink-0 text-base text-[#5C7C89]">
                          ⌕
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[#242424]">
                            {item.query}
                          </p>

                          <p className="mt-1 text-[11px] text-[#8a9aa1]">
                            {new Date(
                              item.searched_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings */}
          <div className="mt-4 border-t border-[#dbe2e5] pt-4">
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
              Search
            </h1>

            <p className="mt-1 text-sm text-[#dbe7eb]">
              Find information across everything stored in your Vault.
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

        {/* Page Content */}
        <main className="px-6 py-8 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-6xl">

            {/* Search Introduction */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[#242424]">
                Search your knowledge
              </h2>

              <p className="mt-1 text-sm text-[#5C7C89]">
                Search by meaning, topic, or phrase across your documents.
              </p>
            </div>

            {/* Search Box */}
            <form
              onSubmit={handleSubmit}
              className="mb-8 flex gap-3"
            >
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#5C7C89]">
                  ⌕
                </span>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search your files..."
                  className="w-full rounded-xl border border-[#dbe2e5] bg-white py-4 pl-12 pr-4 text-[#242424] shadow-sm outline-none transition focus:border-[#1F4959] focus:ring-2 focus:ring-[#5C7C89]/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#071E2D] px-7 py-4 font-medium text-white transition hover:bg-[#1F4959] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Search Results */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#242424]">
                  Search Results
                </h2>

                {results.length > 0 && (
                  <span className="text-sm text-[#5C7C89]">
                    {results.length} result
                    {results.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Loading */}
              {loading && (
                <div className="rounded-xl border border-[#dbe2e5] bg-white p-8 text-center shadow-sm">
                  <p className="text-[#5C7C89]">
                    Searching your files...
                  </p>
                </div>
              )}

              {/* Empty */}
              {!loading && results.length === 0 && (
                <div className="rounded-xl border border-[#dbe2e5] bg-white p-10 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3f5] text-2xl text-[#5C7C89]">
                    ⌕
                  </div>

                  <p className="font-medium text-[#242424]">
                    Search your Vault
                  </p>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Enter a search query to find matching content.
                  </p>
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div
                      key={`${result.file_id}-${index}`}
                      onClick={() => navigate(`/files/${result.file_id}`)}
                      className="rounded-xl border border-[#dbe2e5] bg-white p-5 shadow-sm transition duration-200 hover:border-[#5C7C89]"
                    >
                      <div className="flex items-start justify-between gap-4">

                        <div className="min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              📄
                            </span>

                            <h3 className="truncate font-semibold text-[#242424]">
                              {result.filename}
                            </h3>
                          </div>

                          {result.page_number !== null &&
                            result.page_number !== undefined && (
                              <p className="mt-2 text-xs text-[#5C7C89]">
                                Page {result.page_number}
                              </p>
                            )}
                        </div>

                        <span className="shrink-0 rounded-lg bg-[#f1f5f6] px-3 py-1.5 text-xs text-[#5C7C89]">
                          Distance:{' '}
                          {result.distance?.toFixed(4)}
                        </span>
                      </div>

                      <div className="mt-4 rounded-lg bg-[#f7f9fa] p-4">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-[#242424]">
                          {result.chunk_text}
                        </p>
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

export default Search
