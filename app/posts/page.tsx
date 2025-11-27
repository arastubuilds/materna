'use client';

import { useState, useEffect } from "react";
import { getPaginatedPosts } from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPosts(1);
  }, []);

  async function loadPosts(pageNum: number) {
    setLoading(true);
    const result = await getPaginatedPosts(pageNum);
    if (pageNum === 1) {
      setPosts(result.data);
    } else {
      setPosts(prev => [...prev, ...result.data]);
    }
    setHasMore(result.hasMore);
    setLoading(false);
  }

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    await loadPosts(nextPage);
    setPage(nextPage);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold text-center">Community Posts</h1>

      {posts.map((post) => (
        <Card key={post.id} className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 line-clamp-3">{post.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
            <div className="mt-4">
              <Link href={`/posts/${post.id}`}>
                <Button variant="outline" size="sm">
                  View Full Post
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        {hasMore ? (
          <Button onClick={handleLoadMore} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        ) : (
          <p className="text-gray-500 text-sm">No more posts</p>
        )}
      </div>
    </div>
  );
}
