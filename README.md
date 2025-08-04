# 🎯 AI Interview Generator

> Generate premium user interviews in minutes, not hours. Define your ideal customer profile and let AI create targeted interview questions to uncover user needs.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF)](https://stripe.com/)

## ✨ Features

- **🤖 AI-Powered Interview Generation**: Create customized interview questions based on role, industry, and experience
- **📊 Multiple Export Formats**: Download interviews in TXT, CSV, XLSX, JSON, or HTML formats
- **💳 Secure Payment Processing**: Stripe integration for premium interview generation
- **🎨 Modern UI**: Beautiful, responsive design with dark mode support
- **📱 Mobile Friendly**: Optimized for all device sizes
- **⚡ Real-time Status**: Live updates during interview generation process
- **🔧 Configurable**: Adjust number of interviews (5-20) and customer profiles

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Stripe account (for payment processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/user-interviews.git
   cd user-interviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_POSTHOG_KEY=phc_... # Optional: for analytics
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com # Optional
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3500](http://localhost:3500) to see the application.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── checkout/      # Stripe checkout handling
│   │   └── tables/        # Export functionality
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # App providers
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── interview-form.tsx # Main interview form
│   ├── interview-table.tsx # Results display
│   ├── video-hero.tsx    # Landing hero
│   └── error-boundary.tsx # Error handling
├── context/              # React Context
│   ├── AppProvider.tsx   # Global state
│   └── ThemeProvider.tsx # Theme management
├── constants/            # App constants
├── data/                # Static data
├── hooks/               # Custom hooks
├── lib/                 # Utilities
│   ├── export-utils.ts  # Export functionality
│   ├── validation.ts    # Form validation
│   └── utils.ts         # General utilities
└── types/               # TypeScript definitions
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server on port 3500
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run codebase` - Generate codebase prompt for AI

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui
- **Payments**: Stripe
- **Analytics**: PostHog (optional)
- **State Management**: React Context
- **Data Fetching**: SWR

### Code Quality

The project includes:
- TypeScript with strict mode
- ESLint configuration
- Comprehensive JSDoc documentation
- Error boundaries for graceful error handling
- Input validation and sanitization

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:

- Form inputs with validation
- Interactive sliders and dropdowns  
- Progress indicators
- Toast notifications
- Responsive tables
- Context menus and tooltips

## 💳 Payment Integration

The app uses Stripe for secure payment processing:

1. **Checkout Flow**: Users define their ideal customer profile
2. **Payment Processing**: Secure redirect to Stripe Checkout
3. **Interview Generation**: AI processes the request post-payment
4. **Results Delivery**: Generated interviews available for download

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog analytics key | No |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host URL | No |

### Customization

- **Interview Count**: Modify slider range in `src/constants/app.ts`
- **Export Formats**: Add new formats in `src/lib/export-utils.ts`
- **Styling**: Customize themes in `tailwind.config.ts`
- **Analytics**: Configure PostHog events in components

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed on any platform that supports Next.js:

- **Netlify**: Use the Next.js runtime
- **AWS**: Deploy with AWS Amplify or Lambda
- **Docker**: Use the included Dockerfile (if added)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the existing code style
4. **Add tests**: Ensure your changes are tested
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Add JSDoc comments for new functions
- Include tests for new features
- Ensure responsive design
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Stripe](https://stripe.com/) - Payment processing
- [Lucide](https://lucide.dev/) - Icon library

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/user-interviews/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/user-interviews/discussions)
- **Email**: your-email@example.com

---

<p align="center">
  Made with ❤️ for better user research
</p>