import { Button, Card } from '@/components/ui';

export default function HomePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Card className="mx-auto w-full max-w-3xl">
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-primary-light px-3 py-1 text-caption font-medium text-primary">
            Homepage placeholder
          </span>
          <div className="space-y-3">
            <h1 className="text-h1 text-text">Frontend foundation ready.</h1>
            <p className="text-body2 text-text-muted">
              Setup fokus di router, layouts, providers, store, axios client,
              dan UI base. Halaman final dikerjakan di task terpisah.
            </p>
            <p className="text-body2 text-text-muted">
              This page is intentionally minimal for CAP-16 boilerplate setup.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="button">Button base</Button>
            <Button type="button" variant="ghost">
              Route placeholder
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
