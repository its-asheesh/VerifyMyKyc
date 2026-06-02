import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-6 rounded-full shadow-xl">
                    <AlertCircle className="h-24 w-24 text-blue-600" />
                </div>
            </div>

            <h1 className="text-9xl font-black text-gray-200 tracking-tighter absolute select-none -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50">
                404
            </h1>

            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                Page not found
            </h2>

            <p className="mt-2 text-lg text-gray-600 max-w-md mx-auto mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFoundPage;
