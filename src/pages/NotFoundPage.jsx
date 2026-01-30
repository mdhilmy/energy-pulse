import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ExclamationTriangleIcon className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-6xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            The page you are looking for does not exist. It might have been
            moved or deleted, or the URL might be incorrect.
          </p>
          <Link to="/" className="ep-btn-primary inline-flex items-center">
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
