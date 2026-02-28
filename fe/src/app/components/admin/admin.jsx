import { useState } from 'react';
import { AdminLayout } from './admin-layout';
import { DashboardPage } from './dashboard-page';
import { UsersPage } from './users-page';
import { CarsPage } from './cars-page';
import { RolesPage } from './roles-page';
import { TransactionsPage } from './transactions-page';
import { PricingPage } from './pricing-page';
import { SettingsPage } from './settings-page';
import { ReportsPage } from './reports-page';
import { ApprovalsPage } from './approval-page'
import { FeedbackPage } from './feedback-page'


export function Admin({ onBackToSite }) {
  const [currentPage, setCurrentPage] = useState('reports');

  const getBreadcrumbs = () => {
    const breadcrumbMap = {
      reports: ['Admin', 'Dashboard'],
      users: ['Admin', 'User List'],
      cars: ['Admin', 'Car List'],
      roles: ['Admin', 'Role Management'],
      transactions: ['Admin', 'Transactions'],
      pricing: ['Admin', 'Pricing Settings'],
      feedback: ['Staff', 'Feedback'],
      settings: ['Admin', 'System Configuration'],
      approval: ['Staff', 'Request Moderation'],
    };
    return breadcrumbMap[currentPage] || ['Admin'];
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <UsersPage />;
      case 'cars':
        return <CarsPage />;
      case 'roles':
        return <RolesPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'pricing':
        return <PricingPage />;
      case 'settings':
        return <SettingsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'approval':
        return <ApprovalsPage />;
      case 'feedback':
        return <FeedbackPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      breadcrumbs={getBreadcrumbs()}
      onBackToSite={onBackToSite}
    >
      {renderPage()}
    </AdminLayout>
  );
}
