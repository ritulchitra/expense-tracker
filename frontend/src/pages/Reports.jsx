import React, { useState } from 'react'
import { Download, FileText } from 'lucide-react'

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')

  const reports = [
    {
      id: 1,
      title: 'Monthly Expense Report',
      description: 'Comprehensive report of all expenses for the selected month',
      period: 'monthly',
      generated: '2024-02-20',
    },
    {
      id: 2,
      title: 'Quarterly Analysis',
      description: 'Summary of expenses trends over the past quarter',
      period: 'quarterly',
      generated: '2024-02-19',
    },
    {
      id: 3,
      title: 'Annual Summary',
      description: 'Complete financial overview for the entire year',
      period: 'annual',
      generated: '2024-02-15',
    },
    {
      id: 4,
      title: 'Category Breakdown',
      description: 'Detailed analysis of expenses by category',
      period: 'monthly',
      generated: '2024-02-20',
    },
  ]

  const filteredReports = selectedPeriod
    ? reports.filter((r) => r.period === selectedPeriod)
    : reports

  const handleGenerateReport = (reportId) => {
    alert(`Generating report #${reportId}...`)
  }

  const handleDownloadReport = (reportId) => {
    alert(`Downloading report #${reportId}...`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">
          Generate and download detailed expense reports
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Report Type</h2>
        <div className="flex gap-3 flex-wrap">
          {['monthly', 'quarterly', 'annual'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(selectedPeriod === period ? '' : period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{report.title}</h3>
                  <p className="text-xs text-gray-500">
                    Generated on {report.generated}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{report.description}</p>

            <div className="flex gap-3">
              <button
                onClick={() => handleGenerateReport(report.id)}
                className="btn-secondary flex-1 text-sm"
              >
                Regenerate
              </button>
              <button
                onClick={() => handleDownloadReport(report.id)}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Custom Report Builder
        </h2>
        <p className="text-gray-600 mb-4">
          Create a custom report with specific date ranges and filters
        </p>
        <button className="btn-primary">Create Custom Report</button>
      </div>
    </div>
  )
}

export default Reports
