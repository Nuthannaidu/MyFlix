import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-700 shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
        
        <h1 className="text-6xl font-bold text-red-600 mb-4 animate-pulse">
          ⚠️
        </h1>

        <h2 className="text-2xl font-semibold mb-2">
          Something went wrong
        </h2>

        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          We couldn't complete your request.  
          Please try again or return to the homepage.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 transition px-5 py-2 rounded-lg font-medium"
          >
            Go Home
          </button>

          <button
            onClick={() => window.location.reload()}
            className="border border-zinc-500 hover:bg-zinc-800 transition px-5 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
