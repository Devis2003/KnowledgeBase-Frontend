import { Link } from 'react-router-dom'
import { BookOpen, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Article } from '@/types'

interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const preview = article.content.slice(0, 160) + (article.content.length > 160 ? '...' : '')

  return (
    <Link to={`/articles/${article.id}`} className="block group">
      <Card className="h-full transition-shadow hover:shadow-md group-hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
              {article.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">{preview}</p>
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-primary/5 text-primary border-primary/10 font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {formatDate(article.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.viewCount} views
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
