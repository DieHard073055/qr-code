# QR Code Generator

A modern, responsive QR code generator built with React, TypeScript, and shadcn/ui. Generate QR codes quickly with preset examples or create custom QR codes with advanced styling options.

![QR Code Generator Screenshot](https://img.shields.io/badge/React-18+-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue) ![Vite](https://img.shields.io/badge/Vite-7+-purple) ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-green)

## ✨ Features

### 🚀 Quick Generator
- **Instant QR Generation**: Enter text and generate QR codes immediately
- **Smart Content Detection**: Automatically detects URLs, emails, phone numbers, and text
- **Quick Examples**: 8 pre-built examples for common use cases:
  - Website URLs
  - Email addresses
  - Phone numbers
  - SMS messages
  - WiFi network credentials
  - Contact vCards
  - WhatsApp links
  - YouTube videos
- **One-Click Examples**: Click any example to instantly populate the generator

### 🎨 Custom Generator
- **Live Preview**: Real-time QR code preview as you adjust settings
- **Style Presets**: 6 beautiful pre-configured styles:
  - Classic (Traditional black & white)
  - Modern Blue (Clean blue gradient)
  - Sunset (Warm gradient colors)
  - Nature (Earth tone colors)
  - Purple Magic (Mystical purple gradient)
  - Monochrome (Subtle gray tones)
- **Advanced Customization**:
  - Custom foreground and background colors
  - Gradient support (linear and radial)
  - Multiple dot styles (Square, Circle, Rounded, Dots)
  - Adjustable size (200-800px) and margin (0-10)
  - Logo integration with center placement
  - Error correction level optimization

### 📱 Mobile-First Design
- **Responsive Layout**: Perfect on all screen sizes from mobile to desktop
- **Touch-Friendly**: Optimized for touch interactions
- **No Horizontal Scrolling**: Proper mobile layout without overflow
- **Fast Performance**: Optimized for mobile devices

### 💾 Export Options
- **Download as PNG**: High-quality PNG downloads
- **Copy to Clipboard**: Direct clipboard copying with fallback support
- **URL Testing**: Direct links to test generated URLs
- **Timestamped Filenames**: Automatic filename generation

## 🛠 Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Full type safety and developer experience
- **Vite** - Lightning-fast build tool and dev server
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **QRCode.js** - Reliable QR code generation
- **Lucide React** - Beautiful icon library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd qr-code-gen-shadcn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── QRCodeGenerator.tsx # Main QR generator component
├── lib/
│   ├── qr-service.ts       # Quick QR generation service
│   ├── advanced-qr-service.ts # Custom QR generation service
│   └── utils.ts           # Utility functions
├── App.tsx                # Main application component
└── main.tsx              # Application entry point
```

## 🎯 Usage Examples

### Quick Generation
```typescript
// Generate a simple QR code
const qrCode = await QRCodeService.generateQRCode({
  text: "https://example.com",
  size: 300
});
```

### Custom Generation
```typescript
// Generate a custom styled QR code
const customQR = await AdvancedQRService.generateCustomQR({
  text: "Custom QR Code",
  size: 400,
  foregroundColor: "#1e40af",
  backgroundColor: "#f8fafc",
  dotStyle: "circle",
  gradientType: "radial",
  gradientColors: ["#3b82f6", "#1e40af"]
});
```

## 🎨 Available Styles

| Style | Description | Colors |
|-------|-------------|---------|
| Classic | Traditional black and white | `#000000` / `#FFFFFF` |
| Modern Blue | Clean blue gradient | `#3b82f6` → `#1e40af` |
| Sunset | Warm gradient colors | `#f59e0b` → `#dc2626` |
| Nature | Earth tone colors | `#22c55e` → `#166534` |
| Purple Magic | Mystical purple gradient | `#a855f7` → `#7c3aed` |
| Monochrome | Subtle gray tones | `#6b7280` → `#374151` |

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality

The project includes:
- **ESLint** for code linting
- **TypeScript** for type checking
- **Prettier** configuration
- **Git hooks** for pre-commit validation

## 🚀 Deployment

This project can be deployed to any static hosting service:

- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **AWS S3**: Upload the `dist` folder to an S3 bucket

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [QRCode.js](https://github.com/davidshimjs/qrcode-js) for QR code generation
- [Lucide](https://lucide.dev/) for the icon set
- [Tailwind CSS](https://tailwindcss.com/) for the styling system

---

Made with ❤️ using React, TypeScript, and shadcn/ui