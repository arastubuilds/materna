import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema/posts";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: postId } = await params;

  if (!postId) {
    throw new Error("Post ID missing from route params");
  }

  const result = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  const post = result[0];

  if (!post) {
    return <div className="text-center py-10 text-gray-500">Post not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <Card className="shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{post.title}</CardTitle>
          <p className="text-sm text-gray-400 mt-1">
            Posted on {new Date(post.createdAt).toLocaleString()}
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-6">
        <Link href="/posts">
          <Button variant="outline">← Back to Posts</Button>
        </Link>
      </div>
    </div>
  );
}
