"use client"

import { useState, useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar as RechartsBar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { TrendingUp, Users, Package, Star, Filter, BarChart2, Target } from "lucide-react"

// Mock Sales Data
const monthlySalesData = [
  {
    month: "Jan",
    revenue: 45000,
    customers: 1200,
    newProducts: 3,
    profitMargin: 22,
    customerSatisfaction: 4.5,
    riskFactor: 0.3,
    competitorComparison: -5,
    salesBreakdown: [
      { category: "Electronics", value: 20000 },
      { category: "Clothing", value: 15000 },
      { category: "Accessories", value: 10000 },
    ],
  },
  {
    month: "Feb",
    revenue: 52000,
    customers: 1350,
    newProducts: 2,
    profitMargin: 25,
    customerSatisfaction: 4.7,
    riskFactor: 0.2,
    competitorComparison: 3,
    salesBreakdown: [
      { category: "Electronics", value: 22000 },
      { category: "Clothing", value: 18000 },
      { category: "Accessories", value: 12000 },
    ],
  },
  {
    month: "Dec",
    revenue: 75000,
    customers: 1800,
    newProducts: 6,
    profitMargin: 30,
    customerSatisfaction: 4.9,
    riskFactor: 0.1,
    competitorComparison: 8,
    salesBreakdown: [
      { category: "Electronics", value: 35000 },
      { category: "Clothing", value: 25000 },
      { category: "Accessories", value: 15000 },
    ],
  },
]

const SalesDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedMetric, setSelectedMetric] = useState("revenue")

  // Innovative Feature: Smart Metric Recommender
  const recommendMetric = (monthData:any) => {
    const metrics = [
      {
        icon: <TrendingUp className="text-green-500" />,
        key: "revenue",
        label: "Revenue Boost",
        value: monthData.revenue,
        description: "Highest potential for growth",
      },
      {
        icon: <Users className="text-blue-500" />,
        key: "customers",
        label: "Customer Expansion",
        value: monthData.customers,
        description: "Key focus for market penetration",
      },
      {
        icon: <Package className="text-purple-500" />,
        key: "newProducts",
        label: "Innovation Drive",
        value: monthData.newProducts,
        description: "Product diversity indicator",
      },
    ]

    return metrics.reduce((max, metric) => (metric.value > max.value ? metric : max))
  }

  // Get the currently selected month's data
  const currentMonthData = useMemo(() => {
    return selectedMonth
      ? monthlySalesData.find((item) => item.month === selectedMonth)
      : monthlySalesData[monthlySalesData.length - 1] // Default to last month
  }, [selectedMonth])

  // Sales Breakdown Visualization
  const SalesBreakdownChart = ( data:any ) => {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="mr-2 text-indigo-600" />
            Sales Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsBarChart data={data.salesBreakdown}>
              <RechartsCartesianGrid strokeDasharray="3 3" />
              <RechartsXAxis dataKey="category" />
              <RechartsYAxis />
              <RechartsTooltip />
              <RechartsBar dataKey="value" fill="#8884d8" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  // Performance Insights Component
  const PerformanceInsights = ({ data }) => {
    const recommendedMetric = recommendMetric(data)

    return (
      <Card className="bg-gradient-to-br from-blue-100 to-purple-100 mb-4">
        <CardContent className="flex items-center p-4">
          {recommendedMetric.icon}
          <div className="ml-4">
            <h3 className="font-bold text-lg">{recommendedMetric.label}</h3>
            <p className="text-sm text-gray-600">{recommendedMetric.description}</p>
            <p className="font-semibold">Current Value: {recommendedMetric.value}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Key Performance Indicators
  const PerformanceIndicators = ({ data }) => {
    const indicators = [
      {
        icon: <Target className="text-green-500" />,
        label: "Profit Margin",
        value: `${data.profitMargin}%`,
      },
      {
        icon: <Star className="text-yellow-500" />,
        label: "Satisfaction",
        value: data.customerSatisfaction,
      },
      {
        icon: <Package className="text-blue-500" />,
        label: "New Products",
        value: data.newProducts,
      },
    ]

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 text-indigo-600" />
            Performance Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="text-center p-3 bg-gray-100 rounded-lg">
              {indicator.icon}
              <p className="font-semibold mt-2">{indicator.label}</p>
              <p className="text-xl font-bold">{indicator.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sales Intelligence Dashboard</h1>

        {/* Month Selector */}
        <div className="mb-6 flex justify-center">
          <Select onValueChange={setSelectedMonth} value={selectedMonth || ""}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              {monthlySalesData.map((item) => (
                <SelectItem key={item.month} value={item.month}>
                  {item.month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recommended Metric Insight */}
        <PerformanceInsights data={currentMonthData} />

        {/* Performance Indicators */}
        <PerformanceIndicators data={currentMonthData} />

        {/* Sales Breakdown */}
        <SalesBreakdownChart data={currentMonthData} />

        {/* Main Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{currentMonthData.month} Sales Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={[currentMonthData]}>
                <RechartsCartesianGrid strokeDasharray="3 3" />
                <RechartsXAxis dataKey="month" />
                <RechartsYAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey={selectedMetric} stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SalesDashboard

