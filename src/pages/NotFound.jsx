const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
    <h1 className="text-4xl font-bold mb-4 text-destructive">404 - Page Not Found</h1>
    <p className="mb-6">The page you’re looking for doesn’t exist or might have been moved.</p>
    <a href="/" className="text-primary underline">Return Home</a>
  </div>
);

export default NotFound;
