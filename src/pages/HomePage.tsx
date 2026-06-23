import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ArticleCard } from '@/components/ArticleCard'
import { PageHeader } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { getArticles } from '@/lib/api'
import type { Article } from '@/types'

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setLoading(true)
    getArticles(0, 10)
      .then((data) => {
        setArticles(data)
        setHasMore(data.length === 10)
        setPage(0)
      })
      .finally(() => setLoading(false))
  }, [])

  const loadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    try {
      const data = await getArticles(nextPage, 10)
      setArticles((prev) => [...prev, ...data])
      setPage(nextPage)
      setHasMore(data.length === 10)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Latest Articles"
        description="Browse knowledge shared by the community"
      />

      {articles.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No articles yet. Be the first to write one!
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load more'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
