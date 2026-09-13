import { useEffect, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import api from '../api/axios'

const formatFileSize = (bytes) => {
  if (!bytes) return '0 KB'

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileIcon = (filename) => {
  const extension = filename?.split('.').pop().toLowerCase()

  if (extension === 'pdf') return '📕'
  if (['doc', 'docx'].includes(extension)) return '📄'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extension)) {
    return '🖼️'
  }

  return '📝'
}

function FileContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await api.get(`/files/${id}/`)
        setFile(response.data)
      } catch (error) {
        console.log('LOAD FILE ERROR:', error.response?.data)
        setError('Unable to load file.')
      } finally {
        setLoading(false)
      }
    }

    fetchFile()
  }, [id])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/')
  }

  const isVaultActive = location.pathname.startsWith('/files')

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
            sidebarOpen
              ? 'justify-between px-5'
              : 'justify-center'
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

        {/* Navigation */}
        <nav className="flex h-[calc(100vh-5rem)] flex-col p-4">

          <div className="space-y-2">

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

            {/* Dashboard */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              title="Dashboard"
              className={`flex w-full items-center rounded-xl py-3.5 text-base transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              } ${
                location.pathname === '/dashboard'
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">⌂</span>

              {sidebarOpen && (
                <span>Dashboard</span>
              )}
            </button>

            {/* Vault */}
            <button
              type="button"
              onClick={() => navigate('/files')}
              title="Vault"
              className={`flex w-full items-center rounded-xl py-3.5 text-base transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              } ${
                isVaultActive
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">▣</span>

              {sidebarOpen && (
                <span>Vault</span>
              )}
            </button>

            {/* Search */}
            <button
              type="button"
              onClick={() => navigate('/search')}
              title="Search"
              className={`flex w-full items-center rounded-xl py-3.5 text-base transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              } ${
                location.pathname === '/search'
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">⌕</span>

              {sidebarOpen && (
                <span>Search</span>
              )}
            </button>

            {/* AI Chat */}
            <button
              type="button"
              onClick={() => navigate('/chat')}
              title="AI Chat"
              className={`flex w-full items-center rounded-xl py-3.5 text-base transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              } ${
                location.pathname === '/chat'
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">✦</span>

              {sidebarOpen && (
                <span>AI Chat</span>
              )}
            </button>

            {/* Collections */}
            <button
              type="button"
              onClick={() => navigate('/collections')}
              title="Collections"
              className={`flex w-full items-center rounded-xl py-3.5 text-base transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              } ${
                location.pathname === '/collections'
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">▣</span>

              {sidebarOpen && (
                <span>Collections</span>
              )}
            </button>

            {/* Tags */}
            <button
              type="button"
              onClick={() => navigate('/tags')}
              title="Tags"
              className={`flex w-full items-center rounded-xl py-3.5 text-base transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              } ${
                location.pathname === '/tags'
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">#</span>

              {sidebarOpen && (
                <span>Tags</span>
              )}
            </button>

            {/* Bookmarks */}
            <button
              type="button"
              onClick={() => navigate('/bookmarks')}
              title="Bookmarks"
              className={`flex w-full items-center rounded-xl py-3.5 text-base transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              } ${
                location.pathname === '/bookmarks'
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">☆</span>

              {sidebarOpen && (
                <span>Bookmarks</span>
              )}
            </button>

          </div>

          {/* Settings */}
          <div className="mt-auto border-t border-[#dbe2e5] pt-4">
            <button
              type="button"
              onClick={() => navigate('/settings')}
              title="Settings"
              className={`flex w-full items-center rounded-xl py-3.5 text-base transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              } ${
                location.pathname === '/settings'
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">⚙</span>

              {sidebarOpen && (
                <span>Settings</span>
              )}
            </button>
          </div>

        </nav>
      </aside>

      {/* Main */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen
            ? 'lg:ml-72'
            : 'lg:ml-20'
        }`}
      >

        {/* Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#1F4959] bg-[#071E2D] px-6 sm:px-8 lg:px-10">

          <div>
            <h2 className="text-xl font-semibold text-white">
              File Content
            </h2>

            <p className="mt-1 hidden text-sm text-[#cbd9dd] sm:block">
              View the content extracted from your file.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/files')}
            className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/20"
          >
            ← Back to Vault
          </button>

        </header>

        {/* Page */}
        <main className="mx-auto max-w-\[1500px\] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-[#dbe2e5] bg-white p-8 shadow-sm">
              <p className="text-[#5C7C89]">
                Loading file...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* File */}
          {!loading && !error && file && (
            <>

              {/* File Information */}
              <section className="rounded-2xl border border-[#dbe2e5] bg-white p-6 shadow-sm sm:p-8">

                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex min-w-0 items-center gap-4">

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eef4f5] text-3xl">
                      {getFileIcon(file.filename)}
                    </div>

                    <div className="min-w-0">

                      <h1 className="truncate text-2xl font-semibold tracking-tight text-[#071E2D] sm:text-3xl">
                        {file.filename}
                      </h1>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#5C7C89]">

                        <span>
                          {file.filename
                            ?.split('.')
                            .pop()
                            .toUpperCase()}
                        </span>

                        <span>•</span>

                        <span>
                          {formatFileSize(file.file_size)}
                        </span>

                        <span>•</span>

                        <span
                          className={
                            file.processing_status === 'done'
                              ? 'font-medium text-[#1F4959]'
                              : file.processing_status === 'failed'
                                ? 'font-medium text-red-500'
                                : 'font-medium text-[#5C7C89]'
                          }
                        >
                          {file.processing_status === 'done'
                            ? 'Processed'
                            : file.processing_status}
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </section>

              {/* Extracted Content */}
              <section className="mt-8">

                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-[#071E2D]">
                    Extracted Content
                  </h2>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Content extracted from your uploaded file.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#dbe2e5] bg-white shadow-sm">

                  {file.extracted_text ? (
                    <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
                      <pre className="whitespace-pre-wrap break-word font-sans text-[15px] leading-7 text-[#242424]">
                        {file.extracted_text}
                      </pre>
                    </div>
                  ) : (
                    <div className="px-6 py-16 text-center sm:px-8">

                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4f5] text-2xl text-[#1F4959]">
                        📝
                      </div>

                      <h3 className="mt-5 text-lg font-semibold text-[#071E2D]">
                        No extracted content available
                      </h3>

                      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#5C7C89]">
                        Text could not be extracted from this file.
                      </p>

                    </div>
                  )}

                </div>

              </section>

            </>
          )}

        </main>
      </div>
    </div>
  )
}

export default FileContent
