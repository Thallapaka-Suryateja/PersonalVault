import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [fileCount, setFileCount] = useState(0)
  const [collectionCount, setCollectionCount] = useState(0)
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [tagCount, setTagCount] = useState(0)
  const [recentFiles, setRecentFiles] = useState([])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/')
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [files, collections, bookmarks, tags] = await Promise.all([
          api.get('/files/'),
          api.get('/collections/'),
          api.get('/bookmarks/'),
          api.get('/tags/'),
        ])

        setFileCount(files.data.length)
        setCollectionCount(collections.data.length)
        setBookmarkCount(bookmarks.data.length)
        setTagCount(tags.data.length)
        setRecentFiles(files.data.slice(0, 5))
      } catch (error) {
        console.log(
          'DASHBOARD ERROR:',
          error.response?.data
        )
      }
    }

    fetchDashboardData()
  }, [])

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
            <a
              href="/dashboard"
              title="Dashboard"
              className={`flex items-center rounded-xl bg-[#071E2D] py-3.5 text-base font-semibold text-white transition duration-200 ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              }`}
            >
              <span className="text-lg">
                ⌂
              </span>

              {sidebarOpen && (
                <span>
                  Dashboard
                </span>
              )}
            </a>

            {/* My Files */}
            <a
              href="/files"
              title="Vault"
              className={`flex items-center rounded-xl py-3.5 text-base font-medium text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              }`}
            >
              <span className="text-lg">
                ▣
              </span>

              {sidebarOpen && (
                <span>
                  Vault
                </span>
              )}
            </a>

            {/* Search */}
            <a
              href="/search"
              title="Search"
              className={`flex items-center rounded-xl py-3.5 text-base font-medium text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              }`}
            >
              <span className="text-lg">
                ⌕
              </span>

              {sidebarOpen && (
                <span>
                  Search
                </span>
              )}
            </a>

            {/* AI Chat */}
            <a
              href="/chat"
              title="AI Chat"
              className={`flex items-center rounded-xl py-3.5 text-base font-medium text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              }`}
            >
              <span className="text-lg">
                ✦
              </span>

              {sidebarOpen && (
                <span>
                  AI Chat
                </span>
              )}
            </a>

            {/* Collections */}
            <a
              href="/collections"
              title="Collections"
              className={`flex items-center rounded-xl py-3.5 text-base font-medium text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              }`}
            >
              <span className="text-lg">
                ▣
              </span>

              {sidebarOpen && (
                <span>
                  Collections
                </span>
              )}
            </a>

            {/* Tags */}
            <a
              href="/tags"
              title="Tags"
              className={`flex items-center rounded-xl py-3.5 text-base font-medium text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              }`}
            >
              <span className="text-lg">
                #
              </span>

              {sidebarOpen && (
                <span>
                  Tags
                </span>
              )}
            </a>

            {/* Bookmarks */}
            <a
              href="/bookmarks"
              title="Bookmarks"
              className={`flex items-center rounded-xl py-3.5 text-base font-medium text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              }`}
            >
              <span className="text-lg">
                ☆
              </span>

              {sidebarOpen && (
                <span>
                  Bookmarks
                </span>
              )}
            </a>

          </div>

          {/* Settings */}
          <div className="mt-auto border-t border-[#dbe2e5] pt-4">

            <a
              href="/settings"
              title="Settings"
              className={`flex items-center rounded-xl py-3.5 text-base font-medium text-[#5C7C89] transition duration-200 hover:bg-[#f1f5f6] hover:text-[#1F4959] ${
                sidebarOpen
                  ? 'gap-4 px-5'
                  : 'justify-center px-0'
              }`}
            >
              <span className="text-lg">
                ⚙
              </span>

              {sidebarOpen && (
                <span>
                  Settings
                </span>
              )}
            </a>

          </div>

        </nav>

      </aside>

      {/* Main Area */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen
            ? 'lg:ml-72'
            : 'lg:ml-20'
        }`}
      >

        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#1F4959] bg-[#071E2D] px-6 sm:px-8 lg:px-10">

          <div>

            <h2 className="text-xl font-semibold text-white">
              Dashboard
            </h2>

            <p className="mt-1 hidden text-sm text-[#cbd9dd] sm:block">
              Your personal knowledge space
            </p>

          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/20"
          >
            Logout
          </button>

        </header>

        {/* Dashboard Content */}
        <main className="mx-auto max-w-\[1500px\] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">

          {/* Welcome */}
          <div className="mb-9">

            <h1 className="text-3xl font-semibold tracking-tight text-[#071E2D] sm:text-4xl">
              Welcome to PersonalVault
            </h1>

            <p className="mt-2 text-lg leading-7 text-[#5C7C89]">
              Manage, search and interact with your personal files.
            </p>

          </div>

          {/* Overview */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total Files */}
            <div className="rounded-2xl border border-[#dbe2e5] bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

              <p className="text-base font-medium text-[#5C7C89]">
                Total Files
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#071E2D]">
                {fileCount}
              </p>

              <p className="mt-2 text-sm text-[#9aabb1]">
                Files in your vault
              </p>

            </div>

            {/* Collections */}
            <div className="rounded-2xl border border-[#dbe2e5] bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

              <p className="text-base font-medium text-[#5C7C89]">
                Collections
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#071E2D]">
                {collectionCount}
              </p>

              <p className="mt-2 text-sm text-[#9aabb1]">
                Organized collections
              </p>

            </div>

            {/* Bookmarks */}
            <div className="rounded-2xl border border-[#dbe2e5] bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

              <p className="text-base font-medium text-[#5C7C89]">
                Bookmarks
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#071E2D]">
                {bookmarkCount}
              </p>

              <p className="mt-2 text-sm text-[#9aabb1]">
                Saved bookmarks
              </p>

            </div>

            {/* Tags */}
            <div className="rounded-2xl border border-[#dbe2e5] bg-white p-7 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

              <p className="text-base font-medium text-[#5C7C89]">
                Tags
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#071E2D]">
                {tagCount}
              </p>

              <p className="mt-2 text-sm text-[#9aabb1]">
                Tags across your files
              </p>

            </div>

          </div>

          {/* Quick Actions */}
          <section className="mt-10">

            <div className="mb-5">

              <h2 className="text-2xl font-semibold tracking-tight text-[#071E2D]">
                Quick Actions
              </h2>

              <p className="mt-1 text-base text-[#5C7C89]">
                Get to the tools you use most.
              </p>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

              {/* Upload File */}
              <button
                type="button"
                onClick={() => navigate('/files')}
                className="group rounded-2xl border border-[#dbe2e5] bg-white p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#9eb3ba] hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white transition duration-200 group-hover:bg-[#1F4959]">
                  ▣
                </div>

                <p className="mt-6 text-lg font-semibold text-[#242424]">
                  Upload File
                </p>

                <p className="mt-2 text-base leading-7 text-[#5C7C89]">
                  Add a new file to your vault.
                </p>

              </button>

              {/* Search Files */}
              <button
                type="button"
                onClick={() => navigate('/search')}
                className="group rounded-2xl border border-[#dbe2e5] bg-white p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#9eb3ba] hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white transition duration-200 group-hover:bg-[#1F4959]">
                  ⌕
                </div>

                <p className="mt-6 text-lg font-semibold text-[#242424]">
                  Search Files
                </p>

                <p className="mt-2 text-base leading-7 text-[#5C7C89]">
                  Find files using semantic search.
                </p>

              </button>

              {/* Ask AI */}
              <button
                type="button"
                onClick={() => navigate('/chat')}
                className="group rounded-2xl border border-[#dbe2e5] bg-white p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#9eb3ba] hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white transition duration-200 group-hover:bg-[#1F4959]">
                  ✦
                </div>

                <p className="mt-6 text-lg font-semibold text-[#242424]">
                  Ask AI
                </p>

                <p className="mt-2 text-base leading-7 text-[#5C7C89]">
                  Ask questions about your documents.
                </p>

              </button>

              {/* Create Collection */}
              <button
                type="button"
                onClick={() => navigate('/collections')}
                className="group rounded-2xl border border-[#dbe2e5] bg-white p-7 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#9eb3ba] hover:shadow-lg"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white transition duration-200 group-hover:bg-[#1F4959]">
                  ▣
                </div>

                <p className="mt-6 text-lg font-semibold text-[#242424]">
                  Create Collection
                </p>

                <p className="mt-2 text-base leading-7 text-[#5C7C89]">
                  Organize files into collections.
                </p>

              </button>

            </div>

          </section>

          {/* Bottom Sections */}
          <div className="mt-10 grid gap-6 xl:grid-cols-2">

            {/* Recent Files */}
            <section className="rounded-2xl border border-[#dbe2e5] bg-white shadow-sm">

              <div className="border-b border-[#dbe2e5] px-7 py-6">

                <h2 className="text-xl font-semibold text-[#071E2D]">
                  Recent Files
                </h2>

                <p className="mt-1 text-sm text-[#5C7C89]">
                  Your latest uploaded files
                </p>

              </div>

              <div className="divide-y divide-[#eef2f3]">

                {recentFiles.length === 0 ? (
                  <div className="px-7 py-8">

                    <p className="text-base text-[#5C7C89]">
                      No files uploaded yet.
                    </p>

                  </div>
                ) : (
                  recentFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-5 px-7 py-5"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-base font-semibold text-[#242424]">
                          {file.filename}
                        </p>

                        <p className="mt-1 text-sm text-[#5C7C89]">
                          {file.file_size} bytes
                        </p>

                      </div>

                      <p className="shrink-0 rounded-lg bg-[#f1f5f6] px-3 py-1.5 text-sm font-medium text-[#1F4959]">
                        {file.processing_status}
                      </p>

                    </div>
                  ))
                )}

              </div>

            </section>

            {/* Recent Activity */}
            <section className="rounded-2xl border border-[#dbe2e5] bg-white shadow-sm">

              <div className="border-b border-[#dbe2e5] px-7 py-6">

                <h2 className="text-xl font-semibold text-[#071E2D]">
                  Recent Activity
                </h2>

                <p className="mt-1 text-sm text-[#5C7C89]">
                  Your latest activity
                </p>

              </div>

              <div className="px-7 py-8">

                <p className="text-base text-[#5C7C89]">
                  No recent activity.
                </p>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  )
}

export default Dashboard