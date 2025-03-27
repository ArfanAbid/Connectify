import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-6xl font-bold text-gray-800 dark:text-white">404</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">Page Not Found (Custom 404)</p>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg transition"
      >
        Return Home
      </Link>
    </div>
  );
}
