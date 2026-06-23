import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ArticleCard } from '@/components/ArticleCard'
import { PageHeader } from '@/components/Layout'
import { getAdminArticles, getErrorMessage } from '@/lib/api'
import type { Article } from '@/types'

export default function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAdminArticles()
      .then(setArticles)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-destructive py-20">{error}</p>
  }

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description={`Viewing all ${articles.length} articles including soft-deleted ones`}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
