import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "100K+",
    label: "Active Users",
  },
  {
    value: "$2M+",
    label: "Transactions Tracked",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-green-400" />,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into your spending patterns with AI-powered analytics",
  },
  {
    icon: <Receipt className="h-8 w-8 text-green-500" />,
    title: "Smart Receipt Scanner",
    description:
      "Extract data automatically from receipts using advanced AI technology",
  },
  {
    icon: <PieChart className="h-8 w-8 text-green-400" />,
    title: "Budget Planning",
    description: "Create and manage budgets with intelligent recommendations",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Account Support",
    description: "Manage multiple accounts and credit cards in one place",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-400" />,
    title: "Multi-Currency",
    description: "Support for multiple currencies with real-time conversion",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Insights",
    description: "Get automated financial insights and recommendations",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Track Your Spending",
    description:
      "Automatically categorize and track your transactions in real-time",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

// Testimonials Data
export const testimonialsData = [
  {
    name: "Ayush Mishra",
    role: "Freelance Developer", // Changed to better suit a tech-savvy user in India
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    quote:
      "This app is a gem! The **automatic SMS-based expense tracking** is flawless—it reads my bank and UPI messages instantly. No more manual entry, and the AI categorization is spot-on for Indian spending.",
  },
  {
    name: "Aniket Gupta",
    role: "MBA Student", // Changed to a role focused on tight budgeting and modern tools
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    quote:
      "As a student, saving is everything. The **budgeting feature with real-time alerts** has helped me cut my 'chai-sutta' expenses by 20%. It’s simple, fast, and actually helps you stick to your limits.",
  },
  {
    name: "Ashutosh Yadav",
    role: "Small Business Owner",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    quote:
      "I use it to separate my business and personal spending. The **clean reports and visual charts** give me a quick monthly overview. For a tool built by a student, the sheer utility and ease of use are truly impressive.",
  },
];
