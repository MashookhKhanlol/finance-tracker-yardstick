
# Personal Finance Visualizer

A comprehensive personal finance tracking application built with React, TypeScript, and modern web technologies. Track your income, expenses, set budgets, and gain insights into your spending patterns with beautiful visualizations.

## 🚀 Features

### Core Functionality
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Category Organization**: Organize transactions by predefined categories (Food & Dining, Transportation, Shopping, etc.)
- **Real-time Balance Tracking**: Monitor your net balance with live calculations

### Advanced Budgeting
- **Monthly Category Budgets**: Set spending limits for different categories each month
- **Budget vs Actual Comparison**: Visual charts showing budgeted vs actual spending
- **Budget Progress Tracking**: See how much of your budget remains in each category

### Visualizations & Insights
- **Monthly Trends Chart**: Track income and expenses over time
- **Category Breakdown**: Pie chart showing spending distribution across categories
- **Top Expense Categories**: Quick view of your biggest spending areas
- **Spending Insights**: AI-powered insights that warn about overspending and highlight patterns

### Data Persistence
- **Local Storage**: All data is saved locally in your browser
- **Export/Import Ready**: Data structure supports easy backup and restoration

## 🛠️ Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS for responsive design
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for beautiful icons
- **State Management**: React hooks and local storage
- **Form Handling**: React Hook Form with Zod validation

## 🎯 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📊 How to Use

### Adding Transactions
1. Use the transaction form on the left side of the dashboard
2. Select transaction type (Income or Expense)
3. Enter amount, description, category, and date
4. Click "Add Transaction" to save

### Setting Budgets
1. Use the budget form below the transaction form
2. Select a category and set your monthly budget limit
3. Track your progress with the budget comparison chart

### Viewing Insights
- Check the summary cards at the top for quick overview
- View spending insights for personalized recommendations
- Use charts to understand your financial patterns
- Monitor recent transactions in the transaction list

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── BudgetForm.tsx
│   ├── BudgetComparisonChart.tsx
│   ├── CategoryChart.tsx
│   ├── MonthlyChart.tsx
│   ├── SpendingInsights.tsx
│   ├── TransactionForm.tsx
│   └── TransactionList.tsx
├── pages/              # Page components
│   ├── Index.tsx       # Main dashboard page
│   └── NotFound.tsx
├── types/              # TypeScript type definitions
│   └── Transaction.ts
├── utils/              # Utility functions
│   └── financeUtils.ts
└── hooks/              # Custom React hooks
```

## 🎨 Customization

### Adding New Categories
Update the `EXPENSE_CATEGORIES` or `INCOME_CATEGORIES` arrays in `src/types/Transaction.ts`.

### Modifying Charts
Chart configurations can be found in their respective component files in the `src/components/` directory.

### Styling
The project uses Tailwind CSS. Modify styles directly in component files or update the Tailwind configuration.

## 🚀 Deployment

### Deploy with Lovable
1. Open your project in Lovable
2. Click the "Publish" button in the top right
3. Your app will be deployed automatically

### Deploy Elsewhere
The project builds to static files and can be deployed on any static hosting service:

```bash
npm run build
```

Then deploy the `dist` folder to your hosting provider.

## 🔒 Data Privacy

- All financial data is stored locally in your browser
- No data is sent to external servers
- Your financial information remains completely private

## 🤝 Contributing

This project was built with Lovable. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

For support and questions:
- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Join the [Lovable Discord Community](https://discord.com/channels/1119885301872070706/1280461670979993613)
- Review the codebase and component documentation

---

Built with ❤️ using [Lovable](https://lovable.dev)
