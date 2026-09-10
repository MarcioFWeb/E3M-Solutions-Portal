import { useState } from 'react';
import { getPath } from '../utils/paths';

type BlogPost = {
  id: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    author: string;
    type: 'case' | 'article' | 'service' | 'experiment' | 'saas' | 'track' | 'opinion' | 'recommendation';
    tags: string[];
  };
};

interface BlogFeedProps {
  posts: BlogPost[];
}

const typeColors: Record<string, string> = {
  case: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  article: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  opinion: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  service: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  experiment: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  saas: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  track: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  recommendation: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

const typeLabels: Record<string, string> = {
  case: 'Case',
  article: 'Artigo',
  opinion: 'Opinião',
  service: 'Serviço',
  experiment: 'Experimento',
  saas: 'SaaS',
  track: 'Trilha',
  recommendation: 'Recomendação',
};

export default function BlogFeed({ posts }: BlogFeedProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredPosts = activeFilter
    ? posts.filter((post) => post.data.type === activeFilter)
    : posts;

  const availableTypes = Array.from(new Set(posts.map((post) => post.data.type)));

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
            activeFilter === null
              ? 'bg-white/20 text-white border-white/40'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
          }`}
        >
          Todos
        </button>
        {availableTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeFilter === type
                ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/50'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            {typeLabels[type] || type}
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center text-slate-400 py-12 glass-panel rounded-xl">
          Nenhum artigo encontrado para esta categoria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <a
              key={post.id}
              href={getPath(`/blog/${post.id}`)}
              className="glass-card p-6 flex flex-col group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                    typeColors[post.data.type] || 'bg-white/10 text-slate-300 border-white/20'
                  }`}
                >
                  {typeLabels[post.data.type] || post.data.type}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(post.data.pubDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-50 group-hover:text-accent-cyan transition-colors">
                {post.data.title}
              </h3>
              <p className="text-slate-400 text-sm flex-grow mb-6 line-clamp-3">
                {post.data.description}
              </p>
              
              {post.data.tags && post.data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-auto">
                  {post.data.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs text-slate-500 bg-black/20 px-2 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                  {post.data.tags.length > 3 && (
                    <span className="text-xs text-slate-500 bg-black/20 px-2 py-1 rounded">
                      +{post.data.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
