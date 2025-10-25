
import React from 'react';

interface TaskSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const TaskSection: React.FC<TaskSectionProps> = ({ title, description, children }) => {
  return (
    <section className="bg-card p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      <p className="text-muted mt-1 mb-4">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
};
