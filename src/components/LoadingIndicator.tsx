interface LoadingIndicatorProps {
  'data-testid'?: string;
}

export const LoadingIndicator = ({ 'data-testid': testId }: LoadingIndicatorProps) => {
  return (
    <div className="loading-indicator" data-testid={testId}>
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}; 