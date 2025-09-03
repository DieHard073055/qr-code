import QRCode from 'qrcode'

export interface GeneratedQRCode {
  dataUrl: string
  text: string
  size: number
}

export interface QRCodeInfo {
  category: string
  isUrl: boolean
}

export interface QuickExample {
  label: string
  value: string
}

export class QRCodeService {
  static async generateQRCode(options: {
    text: string
    size?: number
    margin?: number
    errorCorrectionLevel?: QRCode.QRCodeErrorCorrectionLevel
  }): Promise<GeneratedQRCode> {
    try {
      const canvas = document.createElement('canvas')
      
      await QRCode.toCanvas(canvas, options.text, {
        width: options.size || 300,
        margin: options.margin || 4,
        errorCorrectionLevel: options.errorCorrectionLevel || 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      return {
        dataUrl: canvas.toDataURL(),
        text: options.text,
        size: options.size || 300
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error)
      throw new Error('Failed to generate QR code. Please check your input text.')
    }
  }

  static getQRCodeInfo(text: string): QRCodeInfo {
    const isUrl = /^https?:\/\/.+/.test(text)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
    const isPhone = /^[+]?[1-9][\d\s\-()]{7,}$/.test(text)
    
    let category = 'Text'
    if (isUrl) category = 'URL'
    else if (isEmail) category = 'Email'
    else if (isPhone) category = 'Phone'

    return {
      category,
      isUrl
    }
  }

  static getQuickExamples(): QuickExample[] {
    return [
      {
        label: 'Website URL',
        value: 'https://www.example.com'
      },
      {
        label: 'Email Address',
        value: 'mailto:hello@example.com'
      },
      {
        label: 'Phone Number',
        value: 'tel:+1234567890'
      },
      {
        label: 'SMS Message',
        value: 'sms:+1234567890?body=Hello World'
      },
      {
        label: 'WiFi Network',
        value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;'
      },
      {
        label: 'Contact vCard',
        value: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Example Corp\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD'
      },
      {
        label: 'WhatsApp Message',
        value: 'https://wa.me/1234567890?text=Hello%20World'
      },
      {
        label: 'YouTube Video',
        value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    ]
  }
}