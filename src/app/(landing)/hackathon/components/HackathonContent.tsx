export function HackathonContent() {
  return (
    <div id="details" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-16">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12 text-blackout">
          
          <section>
            <h3 className="text-2xl font-medium text-blackout mb-4">Overview</h3>
            <p className="leading-7 text-solid-matte-gray">
              The next generation of open models is here. Welcome to the Gemma 4 Hackathon Sprint, a fast-paced, two-week sprint where you'll get hands-on with the most capable open models from Google DeepMind.
            </p>
            <p className="leading-7 mt-4 text-solid-matte-gray">
              This hackathon is not about over-engineering a finalized, commercial product. It is an intensive sprint to experiment, learn, push boundaries, and build incredible prototypes for real-world problems. You have full access to the newly released Gemma 4 models. Team up, brainstorm your wildest out-of-the-box ideas, hack together a working prototype, and craft a compelling story before the deadline.
            </p>
          </section>

          <section>
            <h3 className="text-2xl font-medium text-blackout mb-4">What to Build (Local Frontier Innovation)</h3>
            <p className="leading-7 mb-4 text-solid-matte-gray">
              Choose your frontier. For this hackathon, we are looking for submissions that reject the ordinary and push the boundaries of what open models can achieve. We highly encourage you to build a prototype that taps into one or more of Gemma 4's key architectural pillars:
            </p>
            <ul className="list-disc pl-6 space-y-3 leading-7 text-solid-matte-gray">
              <li><strong className="text-blackout">Edge Intelligence & Offline Frontiers:</strong> Harness the highly efficient Effective 2B (E2B) and 4B (E4B) models to build local-first, privacy-focused, or completely offline applications.</li>
              <li><strong className="text-blackout">Multimodal Fusion & Sensory Experiences:</strong> Move far beyond the text box by blending senses using native video, image, or audio processing.</li>
              <li><strong className="text-blackout">Agentic Workflows & Autonomous Tools:</strong> Transition from conversation to autonomous action by using native function calling and multi-step reasoning to orchestrate complex task chains.</li>
              <li><strong className="text-blackout">Hyper-Local & Social Impact:</strong> Solve culturally specific problems, break down regional language barriers using native multi-language support, or address high-impact societal challenges in healthcare, education, and civic tech.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-medium text-blackout mb-4">Submission Requirements</h3>
            <ul className="list-disc pl-6 space-y-3 leading-7 text-solid-matte-gray">
              <li><strong className="text-blackout">The Kaggle Writeup:</strong> Your "Proof of Work" (Maximum 1,500 words). Must clearly explain the architecture of your project and how you specifically implemented Gemma 4.</li>
              <li><strong className="text-blackout">Public Code Repository:</strong> Provide a link to a fully public repository containing your code (GitHub or public Kaggle Notebook).</li>
              <li><strong className="text-blackout">Live Demo:</strong> Provide a working, publicly accessible demo that does not require an account, login, or paywall to access.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-medium text-blackout mb-4">Tracks & Awards</h3>
            <div className="space-y-6">
              <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-medium text-blackout">Local Frontier Innovation</h4>
                  <span className="inline-flex items-center rounded-full bg-[#E8F5EB] px-3 py-1 text-sm font-semibold text-[#137333]">
                    $250
                  </span>
                </div>
                <p className="text-solid-matte-gray leading-7">
                  <strong className="text-blackout">The Vibe:</strong> Push the absolute boundaries of what open models can achieve.<br />
                  <strong className="text-blackout">The Focus:</strong> Build an application using the Gemma 4 family that champions innovation, creativity, and out-of-the-box thinking.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xl font-medium text-blackout">Best Idea and Implementation</h4>
                  <span className="inline-flex items-center rounded-full bg-[#E8F5EB] px-3 py-1 text-sm font-semibold text-[#137333]">
                    $250 (Top 4 Teams)
                  </span>
                </div>
                <p className="text-solid-matte-gray leading-7">
                  This award is given to the top 4 teams with the best overall ideas and implementation.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-medium text-blackout mb-4">Judges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {['Mark Ndubuisi', 'Nnaemeka Obi', 'Sarah Nzeshi'].map((judge, index) => {
                const colors = ['bg-[#4285F4]', 'bg-[#EA4335]', 'bg-[#FBBC05]'];
                return (
                  <div key={judge} className="flex flex-col items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
                    <div className={`h-16 w-16 ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white text-xl font-medium mb-4`}>
                      {judge.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h4 className="text-lg font-medium text-blackout">{judge}</h4>
                    <p className="text-sm text-solid-matte-gray mt-1">Hackathon Judge</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-medium text-blackout mb-4">Resources</h3>
            <ul className="list-disc pl-6 space-y-3 leading-7 text-solid-matte-gray">
              <li>
                <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blackout font-medium hover:underline">
                  Google AI Studio
                </a> - The fastest way to build with Gemini and Gemma.
              </li>
              <li>
                <a href="https://deepmind.google/models/gemma/gemma-4/" target="_blank" rel="noopener noreferrer" className="text-blackout font-medium hover:underline">
                  Gemma 4
                </a> - State-of-the-art open models by Google DeepMind.
              </li>
            </ul>
          </section>

        </div>

        {/* Sidebar */}
        <div className="mt-16 lg:mt-0">
          <div className="rounded-xl bg-[#F8F8F8] p-8 border border-gray-200">
            <h3 className="text-xl font-medium text-blackout mb-6">Key Dates</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#4285F4] border border-gray-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-blackout">Submission Deadline</p>
                  <p className="text-sm text-solid-matte-gray">In 20 Days</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#34A853] border border-gray-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.866 8.21 8.21 0 0 0 3 2.48Z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-blackout">Hackathon Started</p>
                  <p className="text-sm text-solid-matte-gray">Just Now</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#FBBC05] border border-gray-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99-2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-blackout">Prizes & Awards</p>
                  <p className="text-sm text-solid-matte-gray">Total Pool: $1,000</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
