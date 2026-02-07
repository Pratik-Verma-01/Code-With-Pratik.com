import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@utils/cn';

const PageHeader = ({
  title,
  description,
  breadcrumbs = [], // [{ label, href }]
  actions,
  className,
}) => {
  return (
    <div className={cn("mb-8", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center text-sm text-dark-400 mb-4 overflow-x-auto whitespace-nowrap scrollbar-none">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <ChevronRight size={14} className="mx-2 flex-shrink-0" />}
              {crumb.href ? (
                <Link 
                  to={crumb.href} 
                  className="hover:text-neon-blue transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-dark-300 max-w-2xl text-lg">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
