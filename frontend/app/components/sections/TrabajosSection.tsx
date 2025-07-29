"use client";
import { useLocaleStore } from "@/app/store/localeStore";

interface TrabajosSectionData {
  _type: "trabajosSection";
  title?: string;
  description?: string;
  maxPosts?: number;
  backgroundColor?: string;
}

interface TrabajosSectionProps {
  data?: TrabajosSectionData;
  posts: any[]; // Posts data passed from server
}

export default function TrabajosSection({ data, posts }: TrabajosSectionProps) {
  const locale = useLocaleStore(state => state.locale);

  const content = {
    title: data?.title || "Trabajos",
    description: data?.description || "Aquí van los posts (datos desde servidor)",
    maxPosts: data?.maxPosts || 3,
    backgroundColor: data?.backgroundColor || "bg-yellow-200",
  };

  return (
    <section
      id="trabajos"
      className={`h-svh ${content.backgroundColor} flex items-center justify-center`}
    >
      <div>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
          <p className="text-lg">{content.description}</p>
          <div className="mt-4">
            {posts?.slice(0, content.maxPosts).map((post, index) => (
              <div key={post._id || index} className="mb-2">
                <p className="text-sm">{post.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}