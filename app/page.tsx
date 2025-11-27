export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto text-center py-20">
      <h1 className="text-4xl text-gray-700 font-bold text-z-600 mb-4">
        Welcome to Materna
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Your personal maternal health companion. 
        You can chat with Materna, share your insights, and explore community posts.
      </p>

      <div className="flex justify-center gap-4">
        <a
          href="/chat"
          className="px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-700 transition"
        >
          Chat with Materna
        </a>
        <a
          href="/posts"
          className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 transition"
        >
          View Posts
        </a>
      </div>
    </div>
  );
}
