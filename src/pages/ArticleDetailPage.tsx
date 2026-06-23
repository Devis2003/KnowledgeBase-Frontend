import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Calendar, Eye, Loader2, Pencil, Trash2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { PageHeader } from '@/components/Layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { deleteArticle, getArticle, getErrorMessage } from '@/lib/api'
import { formatDate } from '@/lib/utils'

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [article, setArticle] = useState<Awaited<ReturnType<typeof getArticle>> | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getArticle(Number(id))
      .then(setArticle)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id])

  const canEdit = user && article && user.id === article.authorId
  const canDelete = user && article && (user.id === article.authorId || user.role === 'ADMIN')

  const handleDelete = async () => {
    if (!article || !confirm('Delete this article?')) return
    setDeleting(true)
    try {
      await deleteArticle(article.id)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error || 'Article not found'}</p>
        <Button asChild variant="outline">
          <Link to="/">Back to articles</Link>
        </Button>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto">
      <PageHeader title={article.title} />

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          {formatDate(article.createdAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye className="h-4 w-4" />
          {article.viewCount} views
        </span>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <Badge key={tag} className="bg-primary/5 text-primary border-primary/10 font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {(canEdit || canDelete) && (
        <div className="flex gap-2 mb-6">
          {canEdit && (
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link to={`/articles/${article.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-2"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </Button>
          )}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>
        </CardContent>
      </Card>
    </article>
  )
}
