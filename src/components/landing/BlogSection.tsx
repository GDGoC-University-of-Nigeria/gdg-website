const articles = [
  {
    id: 1,
    category: 'Design & Collaboration',
    title: 'Why My Figma Design Broke When the Developer Touched It (And How We Fixed It)',
    date: 'October 21, 2025',
    color: 'bg-[#34A853]',
  },
  {
    id: 2,
    category: 'Code & Community',
    title: 'I Built a Full-Stack App in 24 Hours: A DevFest Survival Guide',
    date: 'February 10, 2025',
    color: 'bg-[#4285F4]',
  },
  {
    id: 3,
    category: 'Career & Skills',
    title: "Don't Send That CV! 5 Things Hiring Managers at UNN-Adjacent Tech Companies Actually Care About",
    date: 'July 2, 2025',
    color: 'bg-[#EA4335]',
  },
];

const QuoteIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g transform="matrix(-1, 0, 0, 1, 32, 0)">
      <path
        d="M8 6L14 26M18 6L24 26"
        stroke="#34A853"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

export const BlogSection = () => {
  return (
    <section className="bg-[#F8F8F8] px-6 py-16 md:px-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <QuoteIcon />
            <h2 className="text-2xl font-normal text-blackout md:text-3xl">
              By Students, For Students
            </h2>
          </div>
          <p className="text-sm font-medium text-blackout">
            Students like us sharing wins, lessons, and real project journeys.
          </p>
          <p className="text-sm text-solid-matte-gray">
            Got something to say? Write it, we&apos;ll review it, and you&apos;ll inspire
            someone who needs to hear it.
          </p>
        </div>

        {/* Article Cards */}
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group cursor-pointer"
            >
              {/* Image Placeholder */}
              <div
                className={`${article.color} mb-4 h-40 w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.02]`}
              />
              
              {/* Category */}
              <p className="mb-2 text-xs text-solid-matte-gray">
                {article.category}
              </p>
              
              {/* Title */}
              <h3 className="mb-3 text-base font-medium leading-snug text-blackout transition-colors group-hover:text-alexandra">
                {article.title}
              </h3>
              
              {/* Date */}
              <p className="text-xs text-solid-matte-gray">{article.date}</p>
            </article>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center">
          <a
            href="#"
            className="inline-block border-b border-alexandra pb-0.5 text-sm text-alexandra transition-opacity hover:opacity-80"
          >
            View more
          </a>
        </div>
      </div>
    </section>
  );
};

