import { useEffect, useState } from 'react'
import api from '../api/axios'
import { useNavigate, useLocation } from 'react-router-dom'

function Collections() {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [collections, setCollections] = useState([])
  const [files, setFiles] = useState([])
  const [name, setName] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      const [collectionsResponse, filesResponse] = await Promise.all([
        api.get('/collections/'),
        api.get('/files/'),
      ])

      setCollections(collectionsResponse.data)
      setFiles(filesResponse.data)
    } catch (error) {
      console.log('COLLECTIONS ERROR:', error.response?.data)
      setError('Unable to load collections.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFileChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    )

    setSelectedFiles(values)
  }

  const handleCreate = async (e) => {
    e.preventDefault()

    if (!name.trim() || creating) {
      return
    }

    setCreating(true)
    setError('')

    try {
      await api.post('/collections/', {
        name: name.trim(),
        files: selectedFiles,
      })

      setName('')
      setSelectedFiles([])
      await fetchData()
    } catch (error) {
      console.log('CREATE COLLECTION ERROR:', error.response?.data)

      setError(
        error.response?.data?.detail ||
        'Unable to create collection.'
      )
    } finally {
      setCreating(false)
    }
  }

  const handleOpen = async (id) => {
    try {
      setError('')

      const response = await api.get(`/collections/${id}/`)
      setSelectedCollection(response.data)
      setEditing(false)
    } catch (error) {
      console.log('OPEN COLLECTION ERROR:', error.response?.data)
      setError('Unable to open collection.')
    }
  }

  const handleStartEdit = () => {
    setName(selectedCollection.name)
    setSelectedFiles(selectedCollection.files || [])
    setEditing(true)
    setError('')
  }

  const handleCancelEdit = () => {
    setEditing(false)
    setName('')
    setSelectedFiles([])
    setError('')
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()

    if (!name.trim() || saving) {
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await api.patch(
        `/collections/${selectedCollection.id}/`,
        {
          name: name.trim(),
          files: selectedFiles,
        }
      )

      setSelectedCollection(response.data)

      setCollections((prev) =>
        prev.map((collection) =>
          collection.id === response.data.id
            ? response.data
            : collection
        )
      )

      setEditing(false)
      setName('')
      setSelectedFiles([])
    } catch (error) {
      console.log('UPDATE COLLECTION ERROR:', error.response?.data)

      setError(
        error.response?.data?.detail ||
        'Unable to update collection.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/collections/${id}/`)

      setCollections((prev) =>
        prev.filter((collection) => collection.id !== id)
      )

      if (selectedCollection?.id === id) {
        setSelectedCollection(null)
        setEditing(false)
      }
    } catch (error) {
      console.log('DELETE COLLECTION ERROR:', error.response?.data)
      setError('Unable to delete collection.')
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

        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
          }`}
        >
          <header className="flex h-20 items-center border-b border-[#1F4959] bg-[#071E2D] px-6 sm:px-8 lg:px-10">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Collections
              </h1>

              <p className="mt-1 text-sm text-[#dbe7eb]">
                Organize your files into collections.
              </p>
            </div>
          </header>

          <main className="px-6 py-8 sm:px-8 lg:px-10">
            <p className="text-sm text-[#5C7C89]">
              Loading collections...
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
              Collections
            </h1>

            <p className="mt-1 text-sm text-[#dbe7eb]">
              Organize your files into collections.
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

            {/* Create Collection */}
            <section className="mb-8 rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

              <div className="mb-5">
                <h2 className="text-lg font-semibold text-[#242424]">
                  Create Collection
                </h2>

                <p className="mt-1 text-sm text-[#5C7C89]">
                  Group related files together for easier organization.
                </p>
              </div>

              <form
                onSubmit={handleCreate}
                className="space-y-4"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Collection name"
                  className="w-full rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] px-4 py-3 text-[#242424] outline-none transition focus:border-[#1F4959] focus:bg-white focus:ring-2 focus:ring-[#5C7C89]/20"
                />

                <select
                  multiple
                  value={selectedFiles}
                  onChange={handleFileChange}
                  className="h-40 w-full rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] px-3 py-2 text-sm text-[#242424] outline-none transition focus:border-[#1F4959] focus:bg-white focus:ring-2 focus:ring-[#5C7C89]/20"
                >
                  {files.map((file) => (
                    <option key={file.id} value={file.id}>
                      {file.filename}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-[#5C7C89]">
                  Hold Ctrl (Windows/Linux) or Command (Mac) to select multiple files.
                </p>

                <button
                  type="submit"
                  disabled={creating || !name.trim()}
                  className="rounded-xl bg-[#071E2D] px-5 py-3 font-medium text-white transition duration-200 hover:bg-[#1F4959] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? 'Creating...'
                    : 'Create Collection'}
                </button>
              </form>

            </section>

            {/* Selected Collection */}
            {selectedCollection && (
              <section className="mb-8 rounded-xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

                {!editing ? (
                  <>
                    <div className="flex items-center justify-between gap-4">

                      <div>
                        <h2 className="text-xl font-semibold text-[#242424]">
                          {selectedCollection.name}
                        </h2>

                        <p className="mt-1 text-sm text-[#5C7C89]">
                          {selectedCollection.files?.length || 0} file(s)
                        </p>
                      </div>

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={handleStartEdit}
                          className="rounded-lg bg-[#071E2D] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1F4959]"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedCollection(null)}
                          className="rounded-lg border border-[#dbe2e5] px-4 py-2 text-sm text-[#5C7C89] transition hover:bg-[#f1f5f6]"
                        >
                          Close
                        </button>

                      </div>
                    </div>

                    <div className="mt-5 space-y-3">

                      {selectedCollection.files?.length === 0 ? (
                        <p className="text-sm text-[#5C7C89]">
                          No files in this collection.
                        </p>
                      ) : (
                        selectedCollection.files.map((fileId) => {
                          const file = files.find(
                            (item) => item.id === fileId
                          )

                          return (
                            <div
                              key={fileId}
                              className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-4"
                            >
                              <p className="text-sm font-medium text-[#242424]">
                                {file?.filename || `File ${fileId}`}
                              </p>
                            </div>
                          )
                        })
                      )}

                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="mb-5 text-xl font-semibold text-[#242424]">
                      Edit Collection
                    </h2>

                    <form
                      onSubmit={handleSaveEdit}
                      className="space-y-4"
                    >

                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Collection name"
                        className="w-full rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] px-4 py-3 text-[#242424] outline-none transition focus:border-[#1F4959] focus:bg-white focus:ring-2 focus:ring-[#5C7C89]/20"
                      />

                      <select
                        multiple
                        value={selectedFiles}
                        onChange={handleFileChange}
                        className="h-40 w-full rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] px-3 py-2 text-sm text-[#242424] outline-none transition focus:border-[#1F4959] focus:bg-white focus:ring-2 focus:ring-[#5C7C89]/20"
                      >
                        {files.map((file) => (
                          <option key={file.id} value={file.id}>
                            {file.filename}
                          </option>
                        ))}
                      </select>

                      <p className="text-xs text-[#5C7C89]">
                        Select the files you want in this collection.
                      </p>

                      <div className="flex gap-2">

                        <button
                          type="submit"
                          disabled={saving || !name.trim()}
                          className="rounded-xl bg-[#071E2D] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1F4959] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saving
                            ? 'Saving...'
                            : 'Save Changes'}
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          disabled={saving}
                          className="rounded-xl border border-[#dbe2e5] px-5 py-2.5 text-sm text-[#5C7C89] transition hover:bg-[#f1f5f6] disabled:opacity-50"
                        >
                          Cancel
                        </button>

                      </div>
                    </form>
                  </>
                )}

              </section>
            )}

            {/* Collections */}
            <section>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#242424]">
                    Your Collections
                  </h2>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Browse and manage your organized files.
                  </p>
                </div>

                {collections.length > 0 && (
                  <span className="rounded-lg bg-[#eef3f4] px-3 py-1.5 text-xs font-medium text-[#1F4959]">
                    {collections.length} collection
                    {collections.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {collections.length === 0 ? (
                <div className="rounded-xl border border-[#dbe2e5] bg-white p-8 text-center shadow-sm">

                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef3f4] text-xl text-[#1F4959]">
                    ▣
                  </div>

                  <p className="font-medium text-[#242424]">
                    No collections yet
                  </p>

                  <p className="mt-1 text-sm text-[#5C7C89]">
                    Create your first collection above.
                  </p>

                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      className="rounded-xl border border-[#dbe2e5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#5C7C89] hover:shadow-md"
                    >

                      <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#eef3f4] text-lg text-[#1F4959]">
                          ▣
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold text-[#242424]">
                            {collection.name}
                          </h3>

                          <p className="mt-1 text-sm text-[#5C7C89]">
                            {collection.files?.length || 0} file(s)
                          </p>
                        </div>

                      </div>

                      <div className="mt-5 flex gap-2">

                        <button
                          type="button"
                          onClick={() => handleOpen(collection.id)}
                          className="rounded-lg bg-[#071E2D] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1F4959]"
                        >
                          Open
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(collection.id)}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
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

export default Collections
