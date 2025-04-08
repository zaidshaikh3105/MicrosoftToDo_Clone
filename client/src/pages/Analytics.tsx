import StatsSection from '@/components/StatsSection';

const Analytics = () => {
  return (
    <div className="page-container flex flex-col items-center min-h-screen">
      <div className="section-container w-full max-w-4xl p-4">
        <div className="section-header text-center mb-6">
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        <StatsSection />
      </div>
    </div>
  );
};

export default Analytics;