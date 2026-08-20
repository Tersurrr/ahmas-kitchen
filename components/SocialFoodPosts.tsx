import { ExternalLink, Facebook } from "lucide-react";

const foodPosts = [
  {
    href: "https://www.facebook.com/share/r/18Z45u64k1/",
    title: "Another kitchen favorite",
    description: "Watch another delicious Amahs Kitchen food post on Facebook.",
  },
] as const;

export default function SocialFoodPosts() {
  return (
    <section aria-labelledby="facebook-food-posts" className="mb-12">
      <div className="mb-5">
        <span className="text-sm font-bold tracking-widest uppercase text-secondary">
          On Facebook
        </span>
        <h2
          id="facebook-food-posts"
          className="mt-2 font-display text-2xl font-bold text-primary md:text-3xl"
        >
          More food from Amahs Kitchen
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
          These posts open directly in Facebook without slowing down this page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {foodPosts.map((post) => (
          <a
            key={post.href}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-xl border border-outline-variant/30 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-modal"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <Facebook size={22} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-lg font-semibold text-primary">
                {post.title}
              </span>
              <span className="mt-1 block text-sm text-on-surface-variant">
                {post.description}
              </span>
            </span>
            <ExternalLink
              size={18}
              aria-hidden="true"
              className="shrink-0 text-secondary transition-transform group-hover:translate-x-0.5"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
