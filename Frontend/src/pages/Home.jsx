import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: '📁',
      title: 'File Management',
      description:
        'Keep your documents together in one place and access the information you need without the clutter.',
    },
    {
      icon: '⌕',
      title: 'Semantic Search',
      description:
        'Find information by what you mean, not just by matching exact words.',
    },
    {
      icon: '✦',
      title: 'AI Chat',
      description:
        'Ask questions about your documents and explore answers using your own knowledge.',
    },
    {
      icon: '◎',
      title: 'Organization & Connections',
      description:
        'Use collections, tags and bookmarks while discovering meaningful relationships between your files.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-[#242424]">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#dbe2e5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-\[1400px\] items-center justify-between px-6 lg:px-10">

          {/* Brand */}
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071E2D] text-xl text-white shadow-sm">
              ✦
            </div>

            <span className="text-2xl font-semibold tracking-tight text-[#242424]">
              PersonalVault
            </span>
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-xl px-5 py-3 text-base font-medium text-[#1F4959] transition duration-200 hover:bg-[#eef3f4]"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="rounded-xl bg-[#071E2D] px-6 py-3 text-base font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#1F4959] hover:shadow-md"
            >
              Sign Up
            </button>
          </div>

        </div>
      </header>

      <main>

        {/* Hero */}
        <section className="overflow-hidden bg-white">

          <div className="mx-auto max-w-\[1400px\] px-6 py-20 lg:px-10 lg:py-28">

            <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">

              {/* Hero Content */}
              <div className="text-center lg:text-left">

                <div className="mb-7 inline-flex items-center rounded-full border border-[#cbd9dd] bg-[#f4f7f8] px-5 py-2.5 text-sm font-medium tracking-wide text-[#1F4959]">
                  Your personal knowledge space
                </div>

                <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight text-[#071E2D] sm:text-6xl lg:text-7xl">
                  Your digital world,
                  <span className="block text-[#1F4959]">
                    organized and connected.
                  </span>
                </h1>

                <p className="mt-7 max-w-2xl text-xl leading-9 text-[#5C7C89] sm:text-2xl lg:mx-0">
                  A Space Where Your Digital World Is Organized,
                  Your Knowledge Lives, and Everything Connects.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:justify-start">

                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="rounded-xl bg-[#071E2D] px-8 py-4 text-base font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#1F4959] hover:shadow-lg"
                  >
                    Get Started →
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="rounded-xl border border-[#cbd9dd] bg-white px-8 py-4 text-base font-semibold text-[#1F4959] transition duration-200 hover:-translate-y-0.5 hover:border-[#5C7C89] hover:bg-[#f7f9fa]"
                  >
                    Sign In
                  </button>

                </div>

              </div>

              {/* Hero Visual */}
              <div className="relative">

                <div className="rounded-\[2rem\] border border-[#dbe2e5] bg-[#071E2D] p-3 shadow-2xl">

                  <div className="rounded-\[1\.5rem\] border border-white/10 bg-[#0d2b3b] p-7 sm:p-9">

                    <div className="mb-7 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white/60">
                          PersonalVault
                        </p>
                        <p className="mt-1 text-lg font-semibold text-white">
                          Knowledge Space
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg text-white">
                        ✦
                      </div>
                    </div>

                    <div className="space-y-4">

                      <div className="rounded-2xl border border-white/15 bg-white/10 p-6 transition duration-200 hover:bg-white/15">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                            📁
                          </div>

                          <div>
                            <p className="text-base font-semibold text-white">
                              Documents
                            </p>
                            <p className="mt-1 text-sm text-white/65">
                              Organized in one place
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/15 bg-white/10 p-6 transition duration-200 hover:bg-white/15">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                            ⌕
                          </div>

                          <div>
                            <p className="text-base font-semibold text-white">
                              Knowledge
                            </p>
                            <p className="mt-1 text-sm text-white/65">
                              Searchable by meaning
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/15 bg-white/10 p-6 transition duration-200 hover:bg-white/15">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xl">
                            ◎
                          </div>

                          <div>
                            <p className="text-base font-semibold text-white">
                              Connections
                            </p>
                            <p className="mt-1 text-sm text-white/65">
                              Discover relationships
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3 text-sm font-medium text-white/65">
                      <span>Store</span>
                      <span>→</span>
                      <span>Understand</span>
                      <span>→</span>
                      <span>Discover</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Problem / Introduction */}
        <section className="bg-[#f7f9fa]">

          <div className="mx-auto max-w-\[1400px\] px-6 py-24 lg:px-10 lg:py-28">

            <div className="grid items-center gap-12 lg:grid-cols-2">

              <div className="max-w-2xl">

                <p className="text-base font-semibold uppercase tracking-widest text-[#5C7C89]">
                  A simpler way to find what matters
                </p>

                <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-[#071E2D] sm:text-5xl">
                  Ever spent too much time looking for that one file?
                </h2>

                <p className="mt-6 text-lg leading-8 text-[#5C7C89]">
                  As your collection grows, finding the right information
                  shouldn't become harder.
                </p>

              </div>

              <div className="rounded-3xl border border-[#dbe2e5] bg-white p-9 shadow-sm sm:p-11">

                <p className="text-2xl font-medium leading-9 text-[#242424]">
                  Your documents shouldn't feel like an ocean to search through.
                </p>

                <div className="my-7 h-px bg-[#dbe2e5]" />

                <p className="text-lg leading-8 text-[#5C7C89]">
                  Meet{' '}
                  <span className="font-semibold text-[#1F4959]">
                    PersonalVault
                  </span>{' '}
                  — a place where your files are organized, your knowledge is
                  easier to discover, and everything comes together.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* Features */}
        <section className="bg-white">

          <div className="mx-auto max-w-\[1400px\] px-6 py-24 lg:px-10 lg:py-28">

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div className="max-w-2xl">

                <p className="text-base font-semibold uppercase tracking-widest text-[#5C7C89]">
                  Everything in one place
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight text-[#071E2D] sm:text-5xl">
                  Your files, understood
                </h2>

              </div>

              <p className="max-w-xl text-lg leading-8 text-[#5C7C89] lg:text-right">
                PersonalVault brings together the tools you need to manage,
                discover and interact with your personal knowledge.
              </p>

            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group min-h-\[250px\] rounded-2xl border border-[#dbe2e5] bg-[#f7f9fa] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#9eb3ba] hover:bg-white hover:shadow-lg"
                >

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#071E2D] text-2xl text-white transition duration-300 group-hover:bg-[#1F4959]">
                    {feature.icon}
                  </div>

                  <h3 className="mt-7 text-xl font-semibold text-[#242424]">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-[#5C7C89]">
                    {feature.description}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* How it comes together */}
        <section className="bg-[#071E2D] text-white">

          <div className="mx-auto max-w-\[1400px\] px-6 py-24 lg:px-10 lg:py-28">

            <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">

              <div className="max-w-xl">

                <p className="text-base font-semibold uppercase tracking-widest text-white/75">
                  From files to knowledge
                </p>

                <h2 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Everything works together.
                </h2>

                <p className="mt-6 text-lg leading-8 text-white/80">
                  Upload your documents, find information by meaning,
                  ask questions about your files, and organize the knowledge
                  you want to keep close.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="mt-8 rounded-xl bg-white px-7 py-4 text-base font-semibold text-[#071E2D] transition duration-200 hover:-translate-y-0.5 hover:bg-[#eef3f4] hover:shadow-lg"
                >
                  Get Started →
                </button>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-2xl border border-white/15 bg-white/10 p-8 transition duration-200 hover:bg-white/15">
                  <span className="text-2xl font-semibold text-white">
                    01
                  </span>

                  <h3 className="mt-6 text-xl font-semibold text-white">
                    Store
                  </h3>

                  <p className="mt-3 text-base leading-7 text-white/75">
                    Bring your important documents into one space.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-8 transition duration-200 hover:bg-white/15">
                  <span className="text-2xl font-semibold text-white">
                    02
                  </span>

                  <h3 className="mt-6 text-xl font-semibold text-white">
                    Understand
                  </h3>

                  <p className="mt-3 text-base leading-7 text-white/75">
                    Turn document content into searchable knowledge.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-8 transition duration-200 hover:bg-white/15">
                  <span className="text-2xl font-semibold text-white">
                    03
                  </span>

                  <h3 className="mt-6 text-xl font-semibold text-white">
                    Discover
                  </h3>

                  <p className="mt-3 text-base leading-7 text-white/75">
                    Find information and related documents naturally.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-8 transition duration-200 hover:bg-white/15">
                  <span className="text-2xl font-semibold text-white">
                    04
                  </span>

                  <h3 className="mt-6 text-xl font-semibold text-white">
                    Connect
                  </h3>

                  <p className="mt-3 text-base leading-7 text-white/75">
                    Explore the relationships within your knowledge.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* Final CTA */}
        <section className="bg-white">

          <div className="mx-auto max-w-\[1400px\] px-6 py-24 text-center lg:px-10 lg:py-28">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#071E2D] text-2xl text-white">
              ✦
            </div>

            <h2 className="mt-7 text-4xl font-semibold tracking-tight text-[#071E2D] sm:text-5xl">
              Your knowledge, all in one place.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5C7C89]">
              Store your files. Discover your knowledge.
              Understand how everything connects.
            </p>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="mt-8 rounded-xl bg-[#071E2D] px-9 py-4 text-base font-semibold text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-[#1F4959] hover:shadow-lg"
            >
              Get Started →
            </button>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#071E2D]">

        <div className="mx-auto flex max-w-\[1400px\] flex-col gap-3 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-10">

          <p className="text-base font-medium text-white/90">
            PersonalVault
          </p>

          <p className="text-sm text-white/60">
            A space for your files, knowledge and connections.
          </p>

        </div>

      </footer>

    </div>
  )
}

export default Home