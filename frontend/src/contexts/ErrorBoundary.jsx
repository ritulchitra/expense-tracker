import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  onReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Oops! Something went wrong
            </h1>

            <p className="text-gray-600 text-center mb-4">
              An unexpected error occurred. Please try refreshing the page or contact support.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-gray-100 rounded p-4 mb-4 text-sm text-gray-700 overflow-auto max-h-40">
                <summary className="font-semibold cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs">{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre className="text-xs mt-2">{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.onReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
