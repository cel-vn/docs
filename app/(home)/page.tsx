import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col p-0">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center bg-gradient-to-b from-fd-muted/50 to-fd-background">
        <h1 className="text-4xl md:text-6xl font-bold text-fd-foreground mb-6">
          CEL Developer
        </h1>
        <p className="text-xl md:text-2xl text-fd-muted-foreground mb-8 max-w-3xl">
          Your comprehensive knowledge base for development, project management, and best practices
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/docs"
            className="px-8 py-3 bg-fd-primary text-fd-primary-foreground font-semibold rounded-lg hover:bg-fd-primary/90 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/project-management"
            className="px-8 py-3 border border-fd-border text-fd-foreground font-semibold rounded-lg hover:bg-fd-muted transition-colors"
          >
            Project Management
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-fd-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-fd-foreground mb-12">
            What You'll Find Here
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Documentation Card */}
            <div className="bg-fd-card p-6 rounded-lg border border-fd-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-fd-muted rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-fd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-fd-foreground mb-2">Documentation</h3>
              <p className="text-fd-muted-foreground mb-4">
                Comprehensive technical documentation, guides, and tutorials for developers.
              </p>
              <Link
                href="/docs"
                className="text-fd-primary font-medium hover:text-fd-primary/80 transition-colors"
              >
                Browse Docs →
              </Link>
            </div>

            {/* Project Management Card */}
            <div className="bg-fd-card p-6 rounded-lg border border-fd-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-fd-muted rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-fd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-fd-foreground mb-2">Project Management</h3>
              <p className="text-fd-muted-foreground mb-4">
                Complete guide to project management methodologies, frameworks, and best practices.
              </p>
              <Link
                href="/project-management"
                className="text-fd-primary font-medium hover:text-fd-primary/80 transition-colors"
              >
                Learn PM →
              </Link>
            </div>

            {/* Best Practices Card */}
            <div className="bg-fd-card p-6 rounded-lg border border-fd-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-fd-muted rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-fd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-fd-foreground mb-2">Best Practices</h3>
              <p className="text-fd-muted-foreground mb-4">
                Industry-standard practices, coding standards, and development workflows.
              </p>
              <Link
                href="/docs"
                className="text-fd-primary font-medium hover:text-fd-primary/80 transition-colors"
              >
                Get Started →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 px-4 bg-fd-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-fd-foreground mb-12">
            Popular Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/project-management/agile-methodology"
              className="p-4 bg-fd-card rounded-lg border border-fd-border hover:border-fd-primary hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">
                Agile Methodology
              </h3>
              <p className="text-sm text-fd-muted-foreground mt-1">
                Scrum, Kanban, and agile practices
              </p>
            </Link>

            <Link
              href="/project-management/risk-management"
              className="p-4 bg-fd-card rounded-lg border border-fd-border hover:border-fd-primary hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">
                Risk Management
              </h3>
              <p className="text-sm text-fd-muted-foreground mt-1">
                Identify and mitigate project risks
              </p>
            </Link>

            <Link
              href="/project-management/team-management"
              className="p-4 bg-fd-card rounded-lg border border-fd-border hover:border-fd-primary hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">
                Team Management
              </h3>
              <p className="text-sm text-fd-muted-foreground mt-1">
                Leadership and team development
              </p>
            </Link>

            <Link
              href="/project-management/planning-estimation"
              className="p-4 bg-fd-card rounded-lg border border-fd-border hover:border-fd-primary hover:shadow-md transition-all group"
            >
              <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">
                Planning & Estimation
              </h3>
              <p className="text-sm text-fd-muted-foreground mt-1">
                Project planning techniques
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 bg-fd-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-fd-primary mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-fd-primary/80 mb-8">
            Explore our comprehensive documentation and project management resources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="px-8 py-3 bg-fd-background text-fd font-semibold rounded-lg hover:bg-fd-muted transition-colors"
            >
              Browse Documentation
            </Link>
            <Link
              href="/project-management"
              className="px-8 py-3 border border-fd-primary/20 text-fd-primary font-semibold rounded-lg hover:bg-fd-primary-foreground/10 transition-colors"
            >
              Learn Project Management
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-fd-muted border-t border-fd-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-fd-muted-foreground">
            © {new Date().getFullYear()} CEL Developer. Building better software through knowledge sharing.
          </p>
        </div>
      </footer>
    </main>
  );
}
