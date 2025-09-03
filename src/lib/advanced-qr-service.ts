import QRCode from 'qrcode'

export type DotStyle = 'square' | 'circle' | 'rounded' | 'dots'
export type GradientType = 'none' | 'linear' | 'radial'

export interface AdvancedQROptions {
  text: string
  size?: number
  foregroundColor?: string
  backgroundColor?: string
  dotStyle?: DotStyle
  logoUrl?: string
  gradientType?: GradientType
  gradientColors?: [string, string]
  preset?: string
  errorCorrectionLevel?: QRCode.QRCodeErrorCorrectionLevel
  margin?: number
}

export interface CustomGeneratedQRCode {
  dataUrl: string
  text: string
  size: number
  options: AdvancedQROptions
}

export interface StylePreset {
  id: string
  name: string
  description: string
  options?: Partial<AdvancedQROptions>
}

export interface DotTypeOption {
  id: DotStyle
  name: string
  description: string
}

export class AdvancedQRService {
  static async generateCustomQR(options: AdvancedQROptions): Promise<CustomGeneratedQRCode> {
    const canvas = document.createElement('canvas')
    const size = options.size || 400
    
    // Generate basic QR code first
    await QRCode.toCanvas(canvas, options.text, {
      width: size,
      margin: options.margin || 4,
      errorCorrectionLevel: options.errorCorrectionLevel || 'M',
      color: {
        dark: options.foregroundColor || '#000000',
        light: options.backgroundColor || '#FFFFFF'
      }
    })

    // Apply advanced styling if needed
    if (options.gradientType && options.gradientType !== 'none' && options.gradientColors) {
      await this.applyGradient(canvas, options.gradientType, options.gradientColors)
    }

    if (options.dotStyle && options.dotStyle !== 'square') {
      await this.applyDotStyle(canvas, options.dotStyle)
    }

    if (options.logoUrl) {
      await this.addLogo(canvas, options.logoUrl, size)
    }

    return {
      dataUrl: canvas.toDataURL(),
      text: options.text,
      size,
      options
    }
  }

  private static async applyGradient(
    canvas: HTMLCanvasElement, 
    gradientType: GradientType, 
    colors: [string, string]
  ) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    const imageData = ctx.getImageData(0, 0, width, height)
    const data = imageData.data

    let gradient: CanvasGradient
    if (gradientType === 'linear') {
      gradient = ctx.createLinearGradient(0, 0, width, height)
    } else {
      gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.min(width, height) / 2)
    }
    
    gradient.addColorStop(0, colors[0])
    gradient.addColorStop(1, colors[1])

    // Create a temporary canvas to render the gradient
    const gradientCanvas = document.createElement('canvas')
    gradientCanvas.width = width
    gradientCanvas.height = height
    const gradientCtx = gradientCanvas.getContext('2d')
    if (!gradientCtx) return

    gradientCtx.fillStyle = gradient
    gradientCtx.fillRect(0, 0, width, height)
    const gradientData = gradientCtx.getImageData(0, 0, width, height).data

    // Apply gradient only to dark pixels
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Check if this is a dark pixel (QR code dot)
      const brightness = (r + g + b) / 3
      if (brightness < 128) {
        data[i] = gradientData[i]
        data[i + 1] = gradientData[i + 1]
        data[i + 2] = gradientData[i + 2]
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }

  private static async applyDotStyle(canvas: HTMLCanvasElement, dotStyle: DotStyle) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // This is a simplified implementation
    // In a real implementation, you'd need more sophisticated pattern detection
    // For now, we'll apply a basic transformation based on the dot style
    switch (dotStyle) {
      case 'circle':
      case 'rounded':
      case 'dots':
        // Apply slight blur for rounded effect
        ctx.filter = 'blur(0.5px)'
        ctx.drawImage(canvas, 0, 0)
        ctx.filter = 'none'
        break
    }
  }

  private static async addLogo(canvas: HTMLCanvasElement, logoUrl: string, qrSize: number) {
    return new Promise<void>((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve()

        const logoSize = qrSize * 0.2 // 20% of QR code size
        const x = (qrSize - logoSize) / 2
        const y = (qrSize - logoSize) / 2

        // Add white background for logo
        ctx.fillStyle = 'white'
        ctx.fillRect(x - 5, y - 5, logoSize + 10, logoSize + 10)
        
        // Draw logo
        ctx.drawImage(img, x, y, logoSize, logoSize)
        resolve()
      }
      img.onerror = () => resolve() // Continue without logo if it fails
      img.src = logoUrl
    })
  }

  static getAvailablePresets(): StylePreset[] {
    return [
      {
        id: 'default',
        name: 'Classic',
        description: 'Traditional black and white',
        options: {
          foregroundColor: '#000000',
          backgroundColor: '#FFFFFF',
          dotStyle: 'square',
          gradientType: 'none'
        }
      },
      {
        id: 'modern',
        name: 'Modern Blue',
        description: 'Clean blue gradient',
        options: {
          foregroundColor: '#1e40af',
          backgroundColor: '#f8fafc',
          dotStyle: 'rounded',
          gradientType: 'linear',
          gradientColors: ['#3b82f6', '#1e40af']
        }
      },
      {
        id: 'sunset',
        name: 'Sunset',
        description: 'Warm gradient colors',
        options: {
          foregroundColor: '#dc2626',
          backgroundColor: '#fef2f2',
          dotStyle: 'circle',
          gradientType: 'radial',
          gradientColors: ['#f59e0b', '#dc2626']
        }
      },
      {
        id: 'nature',
        name: 'Nature',
        description: 'Earth tone colors',
        options: {
          foregroundColor: '#166534',
          backgroundColor: '#f0fdf4',
          dotStyle: 'rounded',
          gradientType: 'linear',
          gradientColors: ['#22c55e', '#166534']
        }
      },
      {
        id: 'purple',
        name: 'Purple Magic',
        description: 'Mystical purple gradient',
        options: {
          foregroundColor: '#7c3aed',
          backgroundColor: '#faf5ff',
          dotStyle: 'circle',
          gradientType: 'radial',
          gradientColors: ['#a855f7', '#7c3aed']
        }
      },
      {
        id: 'monochrome',
        name: 'Monochrome',
        description: 'Subtle gray tones',
        options: {
          foregroundColor: '#374151',
          backgroundColor: '#f9fafb',
          dotStyle: 'square',
          gradientType: 'linear',
          gradientColors: ['#6b7280', '#374151']
        }
      }
    ]
  }

  static getPresetById(id: string): StylePreset | undefined {
    return this.getAvailablePresets().find(preset => preset.id === id)
  }

  static getAvailableDotTypes(): DotTypeOption[] {
    return [
      {
        id: 'square',
        name: 'Square',
        description: 'Classic square dots'
      },
      {
        id: 'circle',
        name: 'Circle',
        description: 'Rounded circular dots'
      },
      {
        id: 'rounded',
        name: 'Rounded',
        description: 'Square dots with rounded corners'
      },
      {
        id: 'dots',
        name: 'Dots',
        description: 'Small circular dots'
      }
    ]
  }
}