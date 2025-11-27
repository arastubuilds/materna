"use client";

import { useState } from "react";
import { createPost } from "@/lib/actions/posts";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PostsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await createPost({ title, content });

    if (result.success) {
      setTitle("");
      setContent("");
    }
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <div className="py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-md border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Create a Post
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  type="text"
                  placeholder="Enter a title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Content</label>
                <Textarea
                  placeholder="Write your post..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={loading}
                  className="min-h-[150px]"
                />
              </div>

              <CardFooter className="px-0">
                <Button
                  type="submit"
                  disabled={loading || !title || !content}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Post"
                  )}
                </Button>
              </CardFooter>
            </form>

            {message && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`mt-4 text-sm ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
