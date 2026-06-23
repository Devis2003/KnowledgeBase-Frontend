import { FormEvent, useState } from 'react'
import { Loader2, Search } from 'lucide-react'
import { ArticleCard } from '@/components/ArticleCard'
import { PageHeader } from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getErrorMessage, searchArticles } from '@/lib/api'
import type { Article } from '@/types'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError('')
    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      const data = await searchArticles(query.trim(), tagList.length ? tagList : undefined)
      setResults(data)
      setSearched(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Search Articles"
        description="Find articles by keyword and optional tags"
      />

      <form onSubmit={handleSearch} className="max-w-xl space-y-4 mb-10">
        <div className="space-y-2">
          <Label htmlFor="query">Search query</Label>
          <Input
            id="query"
            placeholder="e.g. spring boot, authentication..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
          <Input
            id="tags"
            placeholder="e.g. java, spring"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </Button>
      </form>

      {searched && (
        results.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No articles found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
