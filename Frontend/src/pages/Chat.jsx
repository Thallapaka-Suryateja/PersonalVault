import { useEffect, useState } from 'react'
import { askQuestion, getChatHistory } from '../api/chat'
import api from '../api/axios'
import { useNavigate, useLocation } from 'react-router-dom'

function Chat() {
  const navigate = useNavigate()
  const location = useLocation()

  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])

  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const [error, setError] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const fetchHistory = async () => {
    try {
      const response = await getChatHistory()
      setHistory(response.data)
    } catch (error) {
      console.log('CHAT HISTORY ERROR:', error.response?.data)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!question.trim() || loading || uploading) {
      return
    }

    const currentQuestion = question.trim()

    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        text: currentQuestion,
      },
    ])

    setQuestion('')
    setLoading(true)
    setError('')
    setUploadMessage('')

    try {
      const response = await askQuestion(currentQuestion)

      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          text: response.data.answer,
          sources: response.data.sources || [],
        },
      ])

      fetchHistory()
    } catch (error) {
      console.log('CHAT ERROR:', error.response?.data)

      setError(
        error.response?.data?.error ||
        'Unable to get an answer.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    setUploading(true)
    setError('')
    setUploadMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      await api.post('/files/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadMessage(`${file.name} uploaded successfully.`)

      setQuestion(
        `Tell me about the important information in ${file.name}`
      )
    } catch (error) {
      console.log('CHAT UPLOAD ERROR:', error.response?.data)

      setError(
        error.response?.data?.error ||
        'Unable to upload the file.'
      )
    } finally {
      setUploading(false)

      // Allows selecting the same file again later.
      e.target.value = ''
    }
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

          {/* Chat History */}
          {sidebarOpen && (
            <div className="mt-5 flex min-h-0 flex-1 flex-col">

              <div className="mb-3 border-t border-[#dbe2e5] pt-4">
                <h2 className="px-2 text-xs font-semibold uppercase tracking-wider text-[#5C7C89]">
                  Chat History
                </h2>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto pr-1">

                {historyLoading ? (
                  <div className="px-2 py-3 text-sm text-[#5C7C89]">
                    Loading history...
                  </div>
                ) : history.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-[#dbe2e5] p-5 text-center">
                    <p className="text-sm text-[#5C7C89]">
                      No conversations yet.
                    </p>

                    <p className="mt-2 text-xs leading-5 text-[#8a9aa1]">
                      Start a conversation with your documents.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">

                    {history.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="w-full rounded-lg p-3 text-left transition duration-200 hover:bg-[#f1f5f6]"
                      >
                        <p className="line-clamp-2 text-sm font-medium text-[#242424]">
                          {item.question}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#5C7C89]">
                          {item.answer}
                        </p>

                        <p className="mt-2 text-[11px] text-[#8a9aa1]">
                          {new Date(
                            item.created_at
                          ).toLocaleString()}
                        </p>
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

      {/* Main Area */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
        }`}
      >

        <main className="flex h-screen min-w-0 flex-col">

          {/* Top Bar */}
          <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#1F4959] bg-[#071E2D] px-6 sm:px-8 lg:px-10">

            <div className="flex items-center gap-3">

              <div>
                <h1 className="text-2xl font-semibold text-white">
                  AI Chat
                </h1>

                <p className="mt-1 hidden text-sm text-[#dbe7eb] sm:block">
                  Ask questions about your personal knowledge
                </p>
              </div>

            </div>

            <div className="rounded-full bg-[#1F4959] px-3 py-1.5 text-xs font-medium text-white">
              Document AI
            </div>

          </header>

          {/* Conversation */}
          <div className="flex-1 overflow-y-auto">

            <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-5 py-8">

              {/* Empty State */}
              {messages.length === 0 && (
                <div className="flex flex-1 items-center justify-center py-12">

                  <div className="w-full max-w-2xl text-center">

                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071E2D] text-2xl text-white shadow-lg">
                      ✦
                    </div>

                    <h2 className="text-3xl font-semibold tracking-tight text-[#242424]">
                      Ask your knowledge vault
                    </h2>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#5C7C89]">
                      Search your uploaded documents and ask questions
                      using AI-powered document understanding.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-3">

                      <button
                        type="button"
                        onClick={() => setQuestion('Summarize my documents')}
                        className="rounded-xl border border-[#dbe2e5] bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#5C7C89] hover:shadow-md"
                      >
                        <p className="text-sm font-medium text-[#242424]">
                          Summarize
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#5C7C89]">
                          Get key information from your documents.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setQuestion(
                            'What are the important topics in my documents?'
                          )
                        }
                        className="rounded-xl border border-[#dbe2e5] bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#5C7C89] hover:shadow-md"
                      >
                        <p className="text-sm font-medium text-[#242424]">
                          Find topics
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#5C7C89]">
                          Discover important concepts and themes.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setQuestion(
                            'Find related information in my files'
                          )
                        }
                        className="rounded-xl border border-[#dbe2e5] bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-[#5C7C89] hover:shadow-md"
                      >
                        <p className="text-sm font-medium text-[#242424]">
                          Find connections
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#5C7C89]">
                          Explore related information across files.
                        </p>
                      </button>

                    </div>

                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.length > 0 && (
                <div className="space-y-7">

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={
                        message.type === 'user'
                          ? 'ml-auto max-w-[85%]'
                          : 'mr-auto max-w-[92%]'
                      }
                    >

                      <div
                        className={
                          message.type === 'user'
                            ? 'rounded-2xl rounded-br-md bg-[#1F4959] px-5 py-4 text-white shadow-sm'
                            : 'rounded-2xl rounded-bl-md border border-[#dbe2e5] bg-white px-5 py-4 shadow-sm'
                        }
                      >

                        <p
                          className={
                            message.type === 'user'
                              ? 'whitespace-pre-wrap text-sm leading-6'
                              : 'whitespace-pre-wrap text-sm leading-6 text-[#242424]'
                          }
                        >
                          {message.text}
                        </p>

                        {/* Sources */}
                        {message.type === 'assistant' &&
                          message.sources?.length > 0 && (
                            <div className="mt-5 border-t border-[#e2e7e9] pt-4">

                              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#5C7C89]">
                                Sources
                              </h3>

                              <div className="space-y-2">

                                {message.sources.map(
                                  (source, sourceIndex) => (
                                    <div
                                      key={`${source.filename}-${sourceIndex}`}
                                      className="rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] p-3"
                                    >

                                      <div className="flex items-center justify-between gap-3">

                                        <p className="text-sm font-medium text-[#242424]">
                                          {source.filename}
                                        </p>

                                        {source.page_number !== null &&
                                          source.page_number !== undefined && (
                                            <span className="shrink-0 rounded-md bg-white px-2 py-1 text-[11px] text-[#5C7C89]">
                                              Page {source.page_number}
                                            </span>
                                          )}

                                      </div>

                                      <p className="mt-2 text-xs leading-5 text-[#5C7C89]">
                                        {source.chunk_text}
                                      </p>

                                    </div>
                                  )
                                )}

                              </div>
                            </div>
                          )}

                      </div>

                    </div>
                  ))}

                  {loading && (
                    <div className="mr-auto max-w-[92%]">

                      <div className="rounded-2xl rounded-bl-md border border-[#dbe2e5] bg-white px-5 py-4 shadow-sm">

                        <div className="flex items-center gap-3">

                          <div className="flex gap-1">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#5C7C89]" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#5C7C89] [animation-delay:150ms]" />
                            <span className="h-2 w-2 animate-pulse rounded-full bg-[#5C7C89] [animation-delay:300ms]" />
                          </div>

                          <p className="text-sm text-[#5C7C89]">
                            Searching your knowledge vault...
                          </p>

                        </div>

                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

          {/* Error / Upload Status */}
          {(error || uploadMessage) && (
            <div className="mx-auto w-full max-w-4xl px-5">

              {error && (
                <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {uploadMessage && (
                <div className="mb-2 rounded-xl border border-[#cbdde2] bg-[#eef5f6] px-4 py-3 text-sm text-[#1F4959]">
                  {uploadMessage}
                </div>
              )}

            </div>
          )}

          {/* Bottom Ask Bar */}
          <div className="shrink-0 border-t border-[#dbe2e5] bg-white px-5 py-4">

            <form
              onSubmit={handleSubmit}
              className="mx-auto flex w-full max-w-4xl items-end gap-3"
            >

              {/* Upload */}
              <label
                className={`flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#dbe2e5] bg-[#f7f9fa] text-lg text-[#1F4959] transition duration-200 hover:border-[#5C7C89] hover:bg-[#eef3f4] ${
                  uploading
                    ? 'pointer-events-none opacity-50'
                    : ''
                }`}
                title="Upload document"
              >
                📎

                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              {/* Input */}
              <div className="flex min-h-12 flex-1 items-center rounded-xl border border-[#cfd9dc] bg-[#f7f9fa] px-4 transition duration-200 focus-within:border-[#1F4959] focus-within:bg-white focus-within:shadow-sm">

                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    uploading
                      ? 'Uploading document...'
                      : 'Ask something about your files...'
                  }
                  disabled={uploading}
                  className="w-full bg-transparent text-sm text-[#242424] outline-none placeholder:text-[#8a9ba1]"
                />

              </div>

              {/* Send */}
              <button
                type="submit"
                disabled={
                  loading ||
                  uploading ||
                  !question.trim()
                }
                className="flex h-12 min-w-12 items-center justify-center rounded-xl bg-[#071E2D] px-4 text-white transition duration-200 hover:bg-[#1F4959] disabled:cursor-not-allowed disabled:opacity-40"
                title="Ask"
              >
                {loading ? '...' : '➤'}
              </button>

            </form>

            <p className="mx-auto mt-2 max-w-4xl text-center text-[11px] text-[#8a9ba1]">
              AI responses are generated from your uploaded documents.
            </p>

          </div>

        </main>
      </div>
    </div>
  )
}

export default Chat
