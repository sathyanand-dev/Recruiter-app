import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    // You could log this to an error reporting service
    // console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded">
          <h3 className="text-lg font-semibold text-red-700">Something went wrong rendering this component.</h3>
          <p className="text-sm text-gray-700 mt-2">An error occurred. For development, details are shown below.</p>
          <pre className="mt-3 p-3 bg-white rounded text-xs text-red-600 overflow-auto" style={{maxHeight: 240}}>
            {String(this.state.error && (this.state.error.stack || this.state.error))}
          </pre>
          <div className="mt-3">
            <button onClick={() => window.location.reload()} className="py-1 px-3 bg-gray-200 rounded">Reload page</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
