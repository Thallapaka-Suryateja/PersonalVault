
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axios'

const getFileType = (file) => {
  const extension = file.name.split('.').pop().toLowerCase()

  if (extension === 'pdf') return 'pdf'
  if (['doc', 'docx'].includes(extension)) return 'docx'
  if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(extension)) {
    return 'image'
  }

  return 'text'
}

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

const getFileIcon = (file) => {
  const type = getFileType({
    name: file.filename || file.name,
  })

  if (type === 'pdf') return '📕'
  if (type === 'docx') return '📄'
  if (type === 'image') return '🖼️'

  return '📝'
}

function Files() {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [deleting, setDeleting] = useState(null)

  const [showAllFiles, setShowAllFiles] = useState(false)

  const [relatedOpen, setRelatedOpen] = useState(false)
  const [relatedDocuments, setRelatedDocuments] = useState({})
  const [relatedLoading, setRelatedLoading] = useState(false)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await api.get('/files/')
        setFiles(response.data)
      } catch (error) {
        console.log('LOAD FILES ERROR:', error.response?.data)
        setError('Unable to load files.')
      } finally {
        setLoading(false)
      }
    }

    fetchFiles()
  }, [])

  const handleUpload = async (e) => {
    const selectedFile = e.target.files[0]

    if (!selectedFile) {
      return
    }

    const formData = new FormData()

    formData.append('file', selectedFile)
    formData.append('filename', selectedFile.name)
    formData.append('file_type', getFileType(selectedFile))

    setError('')
    setUploading(true)

    try {
      const response = await api.post('/files/', formData)

      setFiles((currentFiles) => [response.data, ...currentFiles])

      // Existing related-document results are no longer guaranteed
      // to be current after uploading a new file.
      setRelatedDocuments({})
    } catch (error) {
      console.log('UPLOAD ERROR:', error.response?.data)
      setError('Unable to upload file.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (fileId) => {
    setDeleting(fileId)
    setError('')

    try {
      await api.delete(`/files/${fileId}/`)

      setFiles((currentFiles) =>
        currentFiles.filter((file) => file.id !== fileId)
      )

      // Clear cached related-document results because deleting
      // one file can affect relationships involving other files.
      setRelatedDocuments({})
    } catch (error) {
      console.log('DELETE FILE ERROR:', error.response?.data)
      setError('Unable to delete file.')
    } finally {
      setDeleting(null)
    }
  }

  const handleShowRelated = async () => {
    if (relatedOpen) {
      setRelatedOpen(false)
      return
    }

    setRelatedOpen(true)

    if (Object.keys(relatedDocuments).length > 0) {
      return
    }

    if (files.length === 0) {
      return
    }

    setRelatedLoading(true)
    setError('')

    try {
      const visibleFiles = files.slice(0, 5)

      const results = await Promise.all(
        visibleFiles.map(async (file) => {
          try {
            const response = await api.get(`/related/${file.id}/`)

            return {
              fileId: file.id,
              related: response.data,
            }
          } catch (error) {
            console.log(
              `RELATED DOCUMENT ERROR FOR ${file.id}:`,
              error.response?.data
            )

            return {
              fileId: file.id,
              related: [],
            }
          }
        })
      )

      const formattedResults = {}

      results.forEach((result) => {
        formattedResults[result.fileId] = result.related
      })

      setRelatedDocuments(formattedResults)
    } catch (error) {
      console.log('RELATED DOCUMENTS ERROR:', error)
      setError('Unable to load related documents.')
    } finally {
      setRelatedLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    navigate('/')
  }

  const displayedFiles = showAllFiles
    ? files
    : files.slice(0, 5)

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
              <span className="text-lg">
                ⌂
              </span>

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
                location.pathname === '/files'
                  ? 'bg-[#071E2D] font-semibold text-white'
                  : 'font-medium text-[#5C7C89] hover:bg-[#f1f5f6] hover:text-[#1F4959]'
              }`}
            >
              <span className="text-lg">
                ▣
              </span>

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
              <span className="text-lg">
                ⌕
              </span>

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
              <span className="text-lg">
                ✦
              </span>

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
              <span className="text-lg">
                ▣
              </span>

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
              <span className="text-lg">
                #
              </span>

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
              <span className="text-lg">
                ☆
              </span>

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
              <span className="text-lg">
                ⚙
              </span>

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
              Vault
            </h2>

            <p className="mt-1 hidden text-sm text-[#cbd9dd] sm:block">
              Manage and explore everything in your personal vault.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <label className="cursor-pointer rounded-xl bg-[#1F4959] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#2b5c6d] hover:shadow-md">
              {uploading
                ? 'Uploading...'
                : 'Upload File'}

              <input
                type="file"
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif"
              />
            </label>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-white/20"
            >
              Logout
            </button>

          </div>
        </header>

        {/* Page */}
        <main className="mx-auto max-w-\[1500px\] px-6 py-8 sm:px-8 lg:px-10 lg:py-10">

          {/* Intro */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight text-[#071E2D] sm:text-4xl">
              Your Vault
            </h1>

            <p className="mt-2 text-lg leading-7 text-[#5C7C89]">
              Keep your important files organized and easy to discover.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="rounded-2xl border border-[#dbe2e5] bg-white p-8 shadow-sm">
              <p className="text-[#5C7C89]">
                Loading files...
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && files.length === 0 && (
            <div className="rounded-2xl border border-[#dbe2e5] bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef4f5] text-3xl">
                ▣
              </div>

              <h2 className="mt-6 text-xl font-semibold text-[#071E2D]">
                Your Vault is empty
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5C7C89]">
                Upload your first file to start building your personal
                knowledge space.
              </p>

              <label className="mt-6 inline-flex cursor-pointer rounded-xl bg-[#071E2D] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#1F4959]">
                Upload Your First File

                <input
                  type="file"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif"
                />
              </label>

            </div>
          )}

          {/* Files */}
          {!loading && files.length > 0 && (
            <>

              <section>

                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#071E2D]">
                      Your Files
                    </h2>

                    <p className="mt-1 text-sm text-[#5C7C89]">
                      {showAllFiles
                        ? `Showing all ${files.length} files`
                        : `Showing your ${Math.min(files.length, 5)} most recent files`}
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#dbe2e5] bg-white shadow-sm">

                  <div className="divide-y divide-[#edf2f3]">

                    {displayedFiles.map((file) => (
                      <div
                        key={file.id}
                         onClick={() => navigate(`/files/${file.id}`)}
                        className="p-5 transition duration-200 hover:bg-[#fbfcfc] sm:p-6"
                      >

                        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                          {/* File */}
                          <div className="flex min-w-0 items-center gap-4">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef4f5] text-2xl">
                              {getFileIcon(file)}
                            </div>

                            <div className="min-w-0">

                              <h3 className="truncate text-base font-semibold text-[#071E2D] sm:text-lg">
                                {file.filename}
                              </h3>

                              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-[#5C7C89]">

                                <span>
                                  {file.filename
                                    .split('.')
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

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(file.id)}
                            disabled={deleting === file.id}
                            className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-500 transition duration-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deleting === file.id
                              ? 'Deleting...'
                              : 'Delete'}
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>

                </div>

                {/* See More */}
                {files.length > 5 && (
                  <div className="mt-5 flex justify-center">

                    <button
                      type="button"
                      onClick={() => setShowAllFiles(!showAllFiles)}
                      className="rounded-xl border border-[#cbd9dd] bg-white px-6 py-3 text-sm font-semibold text-[#1F4959] shadow-sm transition duration-200 hover:border-[#1F4959] hover:bg-[#eef4f5]"
                    >
                      {showAllFiles
                        ? 'Show less ↑'
                        : `See all ${files.length} files →`}
                    </button>

                  </div>
                )}

              </section>

              {/* Related Documents */}
              <section className="mt-10">

                <button
                  type="button"
                  onClick={handleShowRelated}
                  className="flex w-full items-center justify-between rounded-2xl border border-[#dbe2e5] bg-white px-6 py-5 text-left shadow-sm transition duration-200 hover:border-[#b9cbd0] hover:shadow-md"
                >

                  <div>
                    <h2 className="text-xl font-semibold text-[#071E2D]">
                      Related Documents
                    </h2>

                    <p className="mt-1 text-sm text-[#5C7C89]">
                      Documents with similar content in your Vault.
                    </p>
                  </div>

                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef4f5] text-xl text-[#1F4959] transition-transform duration-300 ${
                      relatedOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  >
                    ↓
                  </span>

                </button>

                {/* Sliding Down Window */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    relatedOpen
                      ? 'mt-4 grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >

                  <div className="overflow-hidden">

                    <div className="rounded-2xl border border-[#dbe2e5] bg-white p-6 shadow-sm">

                      {relatedLoading ? (
                        <div className="py-8 text-center">
                          <p className="text-sm text-[#5C7C89]">
                            Finding related documents...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">

                          {Object.entries(relatedDocuments).map(
                            ([fileId, relatedFiles]) => {
                              const sourceFile = files.find(
                                (file) =>
                                  String(file.id) === String(fileId)
                              )

                              if (
                                !sourceFile ||
                                relatedFiles.length === 0
                              ) {
                                return null
                              }

                              return relatedFiles.map((related) => (
                                <div
                                  key={`${fileId}-${related.file_id}`}
                                  className="rounded-xl border border-[#edf2f3] bg-[#fbfcfc] p-4 transition duration-200 hover:border-[#cbd9dd]"
                                >

                                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="min-w-0 flex-1">

                                      <p className="truncate text-sm font-semibold text-[#071E2D]">
                                        {sourceFile.filename}
                                      </p>

                                      <div className="my-2 flex items-center gap-2 text-[#5C7C89]">
                                        <span>↓</span>
                                        <span className="h-px flex-1 bg-[#dbe2e5]" />
                                      </div>

                                      <p className="truncate text-sm font-medium text-[#1F4959]">
                                        {related.filename}
                                      </p>

                                    </div>

                                    <div className="shrink-0 rounded-xl bg-[#eef4f5] px-4 py-3 text-center">

                                      <p className="text-xs text-[#5C7C89]">
                                        Similarity
                                      </p>

                                      <p className="mt-1 text-sm font-bold text-[#1F4959]">
                                        {(
                                          Number(
                                            related.similarity_score
                                          ) * 100
                                        ).toFixed(1)}
                                        %
                                      </p>

                                    </div>

                                  </div>

                                </div>
                              ))
                            }
                          )}

                          {Object.keys(relatedDocuments).length > 0 &&
                            Object.values(relatedDocuments).every(
                              (related) => related.length === 0
                            ) && (
                              <div className="py-8 text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4f5] text-xl text-[#1F4959]">
                                  ◎
                                </div>

                                <h3 className="mt-4 text-base font-semibold text-[#071E2D]">
                                  No related documents found
                                </h3>

                                <p className="mt-1 text-sm text-[#5C7C89]">
                                  Similar documents will appear here
                                  when they are detected.
                                </p>

                              </div>
                            )}

                        </div>
                      )}

                    </div>

                  </div>

                </div>

              </section>

            </>
          )}

        </main>
      </div>
    </div>
  )
}

export default Files
