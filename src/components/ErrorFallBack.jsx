
import PropTypes from 'prop-types';
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="p-4 text-red-600">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
        Try again
      </button>
    </div>
  );
};
ErrorFallback.propTypes = {
  error: PropTypes.object.isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

export default ErrorFallback;
