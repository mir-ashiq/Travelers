import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: NotificationType;
  title?: string;
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  dismissible = true,
}) => {
  const baseClasses = 'p-4 rounded-lg flex items-start gap-3';

  const typeClasses = {
    success: 'bg-green-50 border border-green-200',
    error: 'bg-red-50 border border-red-200',
    warning: 'bg-yellow-50 border border-yellow-200',
    info: 'bg-blue-50 border border-blue-200',
  };

  const iconClasses = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const titleClasses = {
    success: 'text-green-900',
    error: 'text-red-900',
    warning: 'text-yellow-900',
    info: 'text-blue-900',
  };

  const messageClasses = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700',
  };

  const icons = {
    success: <CheckCircle className={`w-5 h-5 flex-shrink-0 ${iconClasses[type]}`} />,
    error: <AlertCircle className={`w-5 h-5 flex-shrink-0 ${iconClasses[type]}`} />,
    warning: <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${iconClasses[type]}`} />,
    info: <Info className={`w-5 h-5 flex-shrink-0 ${iconClasses[type]}`} />,
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      {icons[type]}
      <div className="flex-1">
        {title && <h3 className={`font-medium ${titleClasses[type]}`}>{title}</h3>}
        <p className={`text-sm ${messageClasses[type]}`}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Alert;
