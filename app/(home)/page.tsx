import { Heading } from 'fumadocs-ui/components/heading';
import { Cards, Card } from 'fumadocs-ui/components/card';

export default function HomePage() {
  return (
    <div className="flex-1">
      <section className="px-4 py-16">
        <div className="max-w-[1100px] mx-auto">
          <Heading
            title="CEL Developer"
            description="Your comprehensive knowledge base for development, project management, and best practices."
          />

          <div className="mt-10">
            <Cards className="grid-cols-3 @max-lg:grid-cols-1">
              <Card
                href="/docs"
                title="Documentation"
                description="Comprehensive guides, docs, and tutorials for developers."
              />
              <Card
                href="/project-management"
                title="Project Management"
                description="Methodologies, frameworks, and best practices."
              />
              <Card
                href="/docs/architecture"
                title="Architecture"
                description="Patterns, decisions, and system design."
              />
            </Cards>
          </div>
        </div>
      </section>
    </div>
  );
}
