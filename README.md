# HeruCRM - AI-Powered Immigration CRM Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC)](https://tailwindcss.com/)
[![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F)](https://www.electronjs.org/)

A comprehensive CRM platform designed specifically for immigration law firms, featuring AI-powered tools, document management, and client relationship management.

## 🚀 Features

### 🤖 AI-Powered Tools
- **Document Analysis**: AI-powered document review and summarization
- **Risk Assessment**: Automated risk analysis for client cases
- **Application Checker**: Intelligent application completeness verification
- **Cover Letter Generator**: AI-assisted cover letter creation
- **Resume Builder**: Smart resume optimization for immigration
- **Writing Assistant**: AI-powered content generation and editing
- **Success Predictor**: Predictive analytics for case outcomes
- **IRCC Chat Flow**: Intelligent immigration process guidance

### 👥 Multi-Role Support
- **Super Admin**: Platform-wide management and analytics
- **Lawyers**: Case management, client communication, AI tools
- **Clients**: Application tracking, document upload, progress monitoring

### 📊 Advanced Analytics
- **Real-time Dashboards**: Live metrics and performance tracking
- **Client Analytics**: Comprehensive client relationship insights
- **Revenue Tracking**: Financial performance and billing management
- **Team Performance**: Staff productivity and workload monitoring

### 🔐 Security & Compliance
- **Role-based Access Control**: Granular permissions system
- **Data Encryption**: End-to-end data protection
- **Audit Logging**: Complete activity tracking
- **GDPR Compliance**: Privacy and data protection standards

## 🛠 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: Beautiful, accessible component library
- **Framer Motion**: Smooth animations and transitions

### Backend & AI
- **Firebase**: Authentication, database, and storage
- **Google AI**: Advanced AI capabilities via Genkit
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation

### Desktop App
- **Electron**: Cross-platform desktop application
- **Electron Builder**: Automated packaging and distribution

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Turbopack**: Fast bundling and development

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/herucrm.git
   cd herucrm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GOOGLE_AI_API_KEY=your_google_ai_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

## 🖥 Desktop App

### Development Mode
```bash
# Start the desktop app in development mode
npm run electron-dev
```

### Build Desktop App
```bash
# Build for current platform
npm run electron-pack

# Build for specific platforms
npm run dist:mac    # macOS
npm run dist:win    # Windows
npm run dist:linux  # Linux
```

### Desktop App Features
- **Native Performance**: Optimized for desktop usage
- **Offline Capability**: Works without internet connection
- **System Integration**: Native notifications and file handling
- **Cross-platform**: Windows, macOS, and Linux support
- **Auto-updates**: Seamless application updates

## 🏗 Project Structure

```
herucrm/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (marketing)/        # Marketing pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── client/            # Client portal
│   │   ├── lawyer/            # Lawyer dashboard
│   │   ├── superadmin/        # Super admin portal
│   │   └── login/             # Authentication
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # ShadCN UI components
│   │   ├── layout/           # Layout components
│   │   └── pages/            # Page-specific components
│   ├── context/              # React Context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── firebase/             # Firebase configuration
│   └── ai/                   # AI flows and schemas
├── electron/                 # Desktop app files
│   ├── main.js              # Main Electron process
│   ├── preload.js           # Preload script
│   └── assets/              # App icons and assets
├── public/                  # Static assets
└── docs/                   # Documentation
```

## 👥 User Roles & Features

### Super Admin
- **Platform Analytics**: System-wide performance metrics
- **User Management**: Lawyer and client account management
- **Revenue Tracking**: Subscription and billing oversight
- **System Settings**: Platform configuration and maintenance
- **Support Management**: Ticket system and user support

### Lawyers
- **Client Management**: Comprehensive client relationship tools
- **Case Tracking**: Immigration application progress monitoring
- **Document Management**: Secure file storage and organization
- **AI Tools**: Intelligent assistance for case preparation
- **Billing & Invoicing**: Financial management and reporting
- **Team Collaboration**: Staff management and communication

### Clients
- **Application Tracking**: Real-time immigration status updates
- **Document Upload**: Secure file submission and management
- **Communication**: Direct messaging with legal team
- **Progress Monitoring**: Visual timeline of application stages
- **AI Assistance**: Intelligent guidance through immigration process

## 🤖 AI Features

### Document Analysis
- **Intelligent Review**: AI-powered document completeness checking
- **Risk Assessment**: Automated identification of potential issues
- **Compliance Verification**: Immigration regulation compliance checking

### Application Support
- **Cover Letter Generation**: AI-assisted professional letter creation
- **Resume Optimization**: Immigration-specific resume enhancement
- **Application Checker**: Intelligent completeness verification

### Client Communication
- **Smart Responses**: AI-powered communication assistance
- **Process Guidance**: Step-by-step immigration guidance
- **Timeline Prediction**: AI-driven application timeline estimates

## 🚀 Development

### Available Scripts
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript check
npm run electron-dev     # Start desktop app in dev mode
npm run electron-pack    # Build desktop app
npm run dist             # Build all platform distributions
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and standards
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for quality checks

## 🚀 Deployment

### Web Application
```bash
# Build for production
npm run build

# Deploy to Vercel (recommended)
vercel --prod

# Deploy to Netlify
netlify deploy --prod
```

### Desktop Application
```bash
# Build for distribution
npm run dist

# Build for specific platform
npm run dist:mac    # macOS
npm run dist:win    # Windows
npm run dist:linux  # Linux
```

## 🔧 Configuration

### Environment Variables
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# AI Configuration
GOOGLE_AI_API_KEY=

# Optional: Enable Firebase
NEXT_PUBLIC_ENABLE_FIREBASE=true
```

### Desktop App Configuration
```json
{
  "build": {
    "appId": "com.visafor.crm",
    "productName": "VisaFor CRM",
    "directories": {
      "output": "dist"
    }
  }
}
```

## 📱 PWA Features

- **Offline Support**: Works without internet connection
- **Push Notifications**: Real-time updates and alerts
- **App-like Experience**: Native mobile app feel
- **Background Sync**: Automatic data synchronization
- **Install Prompt**: Easy installation on mobile devices

## 🔒 Security

### Data Protection
- **End-to-End Encryption**: All sensitive data encrypted
- **Role-based Access**: Granular permission system
- **Audit Logging**: Complete activity tracking
- **GDPR Compliance**: Privacy and data protection

### Authentication
- **Firebase Auth**: Secure user authentication
- **Multi-factor Support**: Enhanced security options
- **Session Management**: Secure session handling
- **Password Policies**: Strong password requirements

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.visafor.com](https://docs.visafor.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/herucrm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/herucrm/discussions)
- **Email**: support@visafor.com

## 🗺 Roadmap

### Q1 2024
- [ ] Advanced AI document analysis
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced analytics dashboard

### Q2 2024
- [ ] Integration with immigration portals
- [ ] Automated form filling
- [ ] Video consultation features
- [ ] Advanced reporting tools

### Q3 2024
- [ ] AI-powered case prediction
- [ ] Advanced workflow automation
- [ ] Multi-tenant architecture
- [ ] API for third-party integrations

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing React framework
- **Vercel**: For hosting and deployment
- **ShadCN**: For the beautiful UI components
- **Firebase**: For backend services
- **Google AI**: For AI capabilities
- **Electron**: For desktop app framework

---

**Built with ❤️ for immigration professionals worldwide**
