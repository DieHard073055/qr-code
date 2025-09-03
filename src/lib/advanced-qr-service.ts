import QRCode from 'qrcode'
import QRCodeStyling from 'qr-code-styling'

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
    const size = options.size || 400
    
    // Map our dot styles to qr-code-styling format
    const getDotType = (style: DotStyle) => {
      switch (style) {
        case 'square': return 'square'
        case 'circle': return 'dots'  
        case 'rounded': return 'rounded'
        case 'dots': return 'classy'
        default: return 'square'
      }
    }

    // Configure QR code styling options
    const qrCodeConfig = {
      width: size,
      height: size,
      type: 'canvas' as const,
      data: options.text,
      margin: options.margin || 4,
      qrOptions: {
        errorCorrectionLevel: options.errorCorrectionLevel || 'M'
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0,
        crossOrigin: 'anonymous' as const,
      },
      dotsOptions: {
        color: options.foregroundColor || '#000000',
        type: getDotType(options.dotStyle || 'square')
      },
      backgroundOptions: {
        color: options.backgroundColor || '#FFFFFF',
      },
      image: options.logoUrl || undefined,
      cornersSquareOptions: {
        type: getDotType(options.dotStyle || 'square'),
        color: options.foregroundColor || '#000000'
      },
      cornersDotOptions: {
        type: getDotType(options.dotStyle || 'square'),
        color: options.foregroundColor || '#000000'
      }
    }

    // Apply gradient if specified
    if (options.gradientType && options.gradientType !== 'none' && options.gradientColors) {
      (qrCodeConfig.dotsOptions as any).gradient = {
        type: options.gradientType,
        rotation: options.gradientType === 'linear' ? 0 : undefined,
        colorStops: [
          { offset: 0, color: options.gradientColors[0] },
          { offset: 1, color: options.gradientColors[1] }
        ]
      };
      
      (qrCodeConfig.cornersSquareOptions as any).gradient = {
        type: options.gradientType,
        rotation: options.gradientType === 'linear' ? 0 : undefined,
        colorStops: [
          { offset: 0, color: options.gradientColors[0] },
          { offset: 1, color: options.gradientColors[1] }
        ]
      };
      
      (qrCodeConfig.cornersDotOptions as any).gradient = {
        type: options.gradientType,
        rotation: options.gradientType === 'linear' ? 0 : undefined,
        colorStops: [
          { offset: 0, color: options.gradientColors[0] },
          { offset: 1, color: options.gradientColors[1] }
        ]
      }
    }

    // Create and render QR code
    const qrCodeStyling = new QRCodeStyling(qrCodeConfig)
    
    // Get the canvas using proper qr-code-styling API
    const dataUrl = await new Promise<string>((resolve, reject) => {
      qrCodeStyling.getRawData('png').then(buffer => {
        if (buffer) {
          const blob = new Blob([buffer], { type: 'image/png' })
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(blob)
        } else {
          reject(new Error('Failed to generate QR code'))
        }
      }).catch(reject)
    })

    return {
      dataUrl,
      text: options.text,
      size,
      options
    }
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