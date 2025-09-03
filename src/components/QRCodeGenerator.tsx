import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Download, Copy, Check, ExternalLink, Palette, Image, Settings } from "lucide-react"
import { QRCodeService, type GeneratedQRCode } from "@/lib/qr-service"
import { 
  AdvancedQRService, 
  type CustomGeneratedQRCode, 
  type AdvancedQROptions,
  type DotStyle,
  type GradientType
} from "@/lib/advanced-qr-service"

export default function QRCodeGenerator() {
  // Quick Generator State
  const [quickText, setQuickText] = useState("")
  const [isGeneratingQuick, setIsGeneratingQuick] = useState(false)
  const [quickGeneratedQR, setQuickGeneratedQR] = useState<GeneratedQRCode | null>(null)
  const [quickError, setQuickError] = useState("")
  const [quickCopied, setQuickCopied] = useState(false)

  // Custom Generator State
  const [customText, setCustomText] = useState("")
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false)
  const [customGeneratedQR, setCustomGeneratedQR] = useState<CustomGeneratedQRCode | null>(null)
  const [customError, setCustomError] = useState("")
  const [customCopied, setCustomCopied] = useState(false)

  // Custom generator options
  const [selectedPreset, setSelectedPreset] = useState("default")
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [dotType, setDotType] = useState<DotStyle>("square")
  const [logoUrl, setLogoUrl] = useState("")
  const [gradientType, setGradientType] = useState<GradientType>("none")
  const [gradientColors, setGradientColors] = useState<[string, string]>(["#667eea", "#764ba2"])
  const [previewQR, setPreviewQR] = useState<CustomGeneratedQRCode | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [qrSize, setQrSize] = useState(400)
  const [qrMargin, setQrMargin] = useState(4)

  // Quick Generator Functions
  const handleQuickGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickText.trim()) {
      setQuickError("Please enter some text or URL")
      return
    }

    setIsGeneratingQuick(true)
    setQuickError("")

    try {
      const qrCode = await QRCodeService.generateQRCode({
        text: quickText.trim(),
        size: 300
      })
      setQuickGeneratedQR(qrCode)
    } catch (err) {
      setQuickError(err instanceof Error ? err.message : "Failed to generate QR code")
    } finally {
      setIsGeneratingQuick(false)
    }
  }

  const handleQuickDownload = () => {
    if (!quickGeneratedQR) return

    const link = document.createElement("a")
    link.href = quickGeneratedQR.dataUrl
    link.download = `qrcode-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleQuickCopyImage = async () => {
    if (!quickGeneratedQR) return

    try {
      const response = await fetch(quickGeneratedQR.dataUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
      setQuickCopied(true)
      setTimeout(() => setQuickCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy image:", err)
      try {
        await navigator.clipboard.writeText(quickGeneratedQR.dataUrl)
        setQuickCopied(true)
        setTimeout(() => setQuickCopied(false), 2000)
      } catch (fallbackErr) {
        console.error("Fallback copy also failed:", fallbackErr)
        setQuickError("Unable to copy image. Please try downloading instead.")
      }
    }
  }

  // Custom Generator Functions
  const handleCustomGenerate = async () => {
    if (!customText.trim()) {
      setCustomError("Please enter some text or URL")
      return
    }

    const options: AdvancedQROptions = {
      text: customText.trim(),
      size: qrSize,
      margin: qrMargin,
      foregroundColor,
      backgroundColor,
      dotStyle: dotType,
      logoUrl: logoUrl.trim() || undefined,
      gradientType,
      gradientColors: gradientType !== "none" ? gradientColors : undefined,
      preset: selectedPreset,
      errorCorrectionLevel: logoUrl ? "H" : "M"
    }

    setIsGeneratingCustom(true)
    setCustomError("")

    try {
      const qrCode = await AdvancedQRService.generateCustomQR(options)
      setCustomGeneratedQR(qrCode)
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : "Failed to generate custom QR code")
    } finally {
      setIsGeneratingCustom(false)
    }
  }

  const handleCustomDownload = () => {
    if (!customGeneratedQR) return

    const link = document.createElement("a")
    link.href = customGeneratedQR.dataUrl
    link.download = `custom-qrcode-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCustomCopyImage = async () => {
    if (!customGeneratedQR) return

    try {
      if (navigator.clipboard && navigator.clipboard.write) {
        const response = await fetch(customGeneratedQR.dataUrl)
        const blob = await response.blob()
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ])
        setCustomCopied(true)
        setTimeout(() => setCustomCopied(false), 2000)
      } else {
        await navigator.clipboard.writeText(customGeneratedQR.dataUrl)
        setCustomCopied(true)
        setTimeout(() => setCustomCopied(false), 2000)
      }
    } catch (err) {
      console.error("Failed to copy image:", err)
      setCustomError("Unable to copy image. Please try downloading instead.")
    }
  }

  const generatePreview = useCallback(async () => {
    setIsGeneratingPreview(true)
    
    try {
      const previewText = customText.trim() || "SAMPLE QR CODE - PREVIEW ONLY"
      
      const options: AdvancedQROptions = {
        text: previewText,
        size: 300,
        margin: qrMargin,
        foregroundColor,
        backgroundColor,
        dotStyle: dotType,
        logoUrl: logoUrl.trim() || undefined,
        gradientType,
        gradientColors: gradientType !== "none" ? gradientColors : undefined,
        preset: selectedPreset,
        errorCorrectionLevel: logoUrl ? "H" : "M"
      }

      const qrCode = await AdvancedQRService.generateCustomQR(options)
      setPreviewQR(qrCode)
    } catch (err) {
      console.error("Failed to generate preview:", err)
      setPreviewQR(null)
    } finally {
      setIsGeneratingPreview(false)
    }
  }, [customText, selectedPreset, foregroundColor, backgroundColor, dotType, logoUrl, gradientType, gradientColors, qrMargin])

  const applyPreset = (presetId: string) => {
    const preset = AdvancedQRService.getPresetById(presetId)
    if (preset && preset.options) {
      if (preset.options.foregroundColor) setForegroundColor(preset.options.foregroundColor)
      if (preset.options.backgroundColor) setBackgroundColor(preset.options.backgroundColor)
      if (preset.options.dotStyle) setDotType(preset.options.dotStyle)
      if (preset.options.gradientType) setGradientType(preset.options.gradientType)
      if (preset.options.gradientColors) setGradientColors(preset.options.gradientColors)
    }
    setSelectedPreset(presetId)
  }

  // Generate preview when settings change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      generatePreview()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [generatePreview])

  const qrInfo = quickText ? QRCodeService.getQRCodeInfo(quickText) : null
  const examples = QRCodeService.getQuickExamples()
  const presets = AdvancedQRService.getAvailablePresets()
  const dotTypes = AdvancedQRService.getAvailableDotTypes()

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 overflow-x-hidden">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">QR Code Generator</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Generate QR codes quickly or customize them to your needs</p>
      </div>

      <Tabs defaultValue="quick" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick">Quick Generate</TabsTrigger>
          <TabsTrigger value="custom">Custom Generate</TabsTrigger>
        </TabsList>

        {/* Quick Generator Tab */}
        <TabsContent value="quick" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
            {/* Generator Form */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Generate QR Code</CardTitle>
                <CardDescription>
                  Enter any text, URL, email, or phone number to generate a QR code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleQuickGenerate} className="space-y-4 sm:space-y-6">
                  <div>
                    <Textarea
                      value={quickText}
                      onChange={(e) => setQuickText(e.target.value)}
                      placeholder="Enter text, URL, email, or phone number..."
                      rows={3}
                      maxLength={2000}
                      className="text-sm sm:text-base"
                    />
                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between text-xs sm:text-sm text-muted-foreground mt-2">
                      <span>{quickText.length}/2000 characters</span>
                      {qrInfo && (
                        <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs w-fit">
                          {qrInfo.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {quickError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-destructive text-sm">{quickError}</p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full text-sm sm:text-base"
                    disabled={isGeneratingQuick || !quickText.trim()}
                  >
                    {isGeneratingQuick ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Generating...</span>
                        <span className="sm:hidden">Generating</span>
                      </div>
                    ) : 
                      "Generate QR Code"
                    }
                  </Button>
                </form>

                {/* Quick Examples */}
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3">
                    Quick Examples:
                  </h3>
                  <div className="space-y-2">
                    {examples.map((example) => (
                      <button
                        key={example.label}
                        onClick={() => setQuickText(example.value)}
                        className="w-full text-left p-2 sm:p-3 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <div className="font-medium text-xs sm:text-sm truncate">{example.label}</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground truncate">{example.value}</div>
                          </div>
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated QR Code */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Your QR Code</CardTitle>
                <CardDescription>
                  {quickGeneratedQR ? "Ready to download and use" : "Your generated QR code will appear here"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quickGeneratedQR ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* QR Code Display */}
                    <div className="flex justify-center p-4 sm:p-6 bg-muted rounded-lg">
                      <div className="p-3 sm:p-4 bg-white rounded-md shadow-sm">
                        <img 
                          src={quickGeneratedQR.dataUrl} 
                          alt="Generated QR Code"
                          className="w-32 h-32 sm:w-48 sm:h-48"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 sm:space-y-3">
                      <Button 
                        onClick={handleQuickDownload} 
                        size="lg"
                        className="w-full text-sm sm:text-base"
                      >
                        <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        Download PNG
                      </Button>
                      
                      <Button 
                        onClick={handleQuickCopyImage} 
                        variant="outline"
                        size="lg"
                        disabled={quickCopied}
                        className="w-full text-sm sm:text-base"
                      >
                        {quickCopied ? (
                          <>
                            <Check className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Copy to Clipboard
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Test URL */}
                    {qrInfo?.isUrl && (
                      <div className="pt-3 border-t">
                        <a 
                          href={quickGeneratedQR.text} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Test this URL
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-2xl text-muted-foreground">📱</div>
                    </div>
                    <p className="text-muted-foreground">Enter text above to generate your QR code</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Custom Generator Tab */}
        <TabsContent value="custom" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 xl:grid-cols-3">
            {/* Configuration Panel */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {/* Content Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Settings size={16} className="sm:w-5 sm:h-5" />
                    Content & Basic Settings
                  </CardTitle>
                  <CardDescription>
                    Enter the content for your QR code and basic settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="custom-text">Content</Label>
                    <Textarea
                      id="custom-text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      rows={3}
                      placeholder="Enter text, URL, email, or phone number..."
                      maxLength={2000}
                      className="resize-none"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{customText.length}/2000 characters</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Size: {qrSize}px</Label>
                      <Slider
                        value={[qrSize]}
                        onValueChange={([value]) => setQrSize(value)}
                        min={200}
                        max={800}
                        step={50}
                        className="w-full mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm">Margin: {qrMargin}</Label>
                      <Slider
                        value={[qrMargin]}
                        onValueChange={([value]) => setQrMargin(value)}
                        min={0}
                        max={10}
                        step={1}
                        className="w-full mt-2"
                      />
                    </div>
                  </div>

                  {/* Style Presets */}
                  <div>
                    <Label className="text-sm">Style Preset</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => applyPreset(preset.id)}
                          className={`p-2 sm:p-3 text-left border rounded-md hover:border-primary transition-colors ${
                            selectedPreset === preset.id ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <div className="font-medium text-xs sm:text-sm">{preset.name}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{preset.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Color & Style Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Palette size={16} className="sm:w-5 sm:h-5" />
                    Colors & Styling
                  </CardTitle>
                  <CardDescription>
                    Customize colors and dot styles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Foreground Color</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="w-10 h-10 sm:w-12 sm:h-10 border border-input rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="flex-1 text-xs sm:text-sm"
                          placeholder="#000000"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm">Background Color</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-10 h-10 sm:w-12 sm:h-10 border border-input rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 text-xs sm:text-sm"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dot Type */}
                  <div>
                    <Label className="text-sm">Dot Style</Label>
                    <Select value={dotType} onValueChange={(value) => setDotType(value as DotStyle)}>
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select dot style" />
                      </SelectTrigger>
                      <SelectContent>
                        {dotTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id} className="text-sm">
                            {type.name} - {type.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gradient Options */}
                  <div>
                    <Label className="text-sm">Gradient Type</Label>
                    <Select value={gradientType} onValueChange={(value) => setGradientType(value as GradientType)}>
                      <SelectTrigger className="w-full mt-2">
                        <SelectValue placeholder="Select gradient type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Gradient</SelectItem>
                        <SelectItem value="linear">Linear Gradient</SelectItem>
                        <SelectItem value="radial">Radial Gradient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {gradientType !== "none" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm">Gradient Start</Label>
                        <input
                          type="color"
                          value={gradientColors[0]}
                          onChange={(e) => setGradientColors([e.target.value, gradientColors[1]])}
                          className="w-full h-10 border border-input rounded cursor-pointer mt-2"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Gradient End</Label>
                        <input
                          type="color"
                          value={gradientColors[1]}
                          onChange={(e) => setGradientColors([gradientColors[0], e.target.value])}
                          className="w-full h-10 border border-input rounded cursor-pointer mt-2"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Logo Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Image size={16} className="sm:w-5 sm:h-5" />
                    Logo & Branding
                  </CardTitle>
                  <CardDescription>
                    Add your logo to the center of the QR code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm">Logo URL</Label>
                    <Input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="mt-2 text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      For best results, use a square logo (PNG with transparency recommended)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <div className="sticky bottom-4">
                {customError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md mb-4">
                    <p className="text-destructive text-sm">{customError}</p>
                  </div>
                )}

                <Button 
                  onClick={handleCustomGenerate}
                  size="lg"
                  className="w-full text-sm sm:text-base"
                  disabled={isGeneratingCustom || !customText.trim()}
                >
                  {isGeneratingCustom ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Generating...</span>
                      <span className="sm:hidden">Generating</span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Generate Custom QR Code</span>
                      <span className="sm:hidden">Generate QR Code</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Preview Panel */}
            <div>
              <Card className="xl:sticky xl:top-4">
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    {customGeneratedQR ? "Your final QR code is ready!" : "Live preview - generate unlimited QR codes"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Show live preview first */}
                  {!customGeneratedQR && previewQR && (
                    <div className="space-y-4 mb-6">
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-2 sm:p-3">
                        <p className="text-xs text-primary font-medium">📖 Live Preview Mode</p>
                        <p className="text-[10px] sm:text-xs text-primary/80">{customText.trim() ? "Showing your text with current settings" : "Enter text above to see live preview with your content"}</p>
                      </div>
                      
                      {/* Preview QR Code Display */}
                      <div className="flex justify-center">
                        <div className="p-2 sm:p-4 bg-white border-2 border-primary/30 rounded-lg shadow-sm">
                          <img 
                            src={previewQR.dataUrl} 
                            alt="QR Code Preview"
                            className="w-32 h-32 sm:w-auto sm:h-auto max-w-full"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </div>
                      </div>

                      {/* Preview Info */}
                      <div className="bg-secondary/30 rounded-lg p-2 sm:p-3 text-[10px] sm:text-xs space-y-1">
                        <p><span className="font-medium">Style:</span> {previewQR.options.preset}</p>
                        <p><span className="font-medium">Dots:</span> {previewQR.options.dotStyle}</p>
                        <p><span className="font-medium">Size:</span> {previewQR.size}×{previewQR.size}px</p>
                        <p className="text-primary break-all"><span className="font-medium">{customText.trim() ? "Your text:" : "Sample data:"}</span> {previewQR.text}</p>
                      </div>

                      <div className="border-t pt-3">
                        <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                          {customText.trim() ? "Click \"Generate\" to create the final high-resolution QR code" : "Enter your text above to see live preview with your content"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Loading state for preview */}
                  {!customGeneratedQR && isGeneratingPreview && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <div className="w-24 h-24 bg-secondary/30 rounded-lg flex items-center justify-center mb-4 animate-pulse">
                        <Palette className="w-8 h-8" />
                      </div>
                      <p className="text-center text-sm">
                        Generating preview...
                      </p>
                    </div>
                  )}

                  {/* Final generated QR code */}
                  {customGeneratedQR ? (
                    <div className="space-y-4">
                      {/* QR Code Display */}
                      <div className="flex justify-center">
                        <div className="p-2 sm:p-4 bg-white border-2 border-border rounded-lg shadow-sm">
                          <img 
                            src={customGeneratedQR.dataUrl} 
                            alt="Generated Custom QR Code"
                            className="w-48 h-48 sm:w-auto sm:h-auto max-w-full"
                            style={{ imageRendering: "pixelated" }}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button 
                          onClick={handleCustomDownload} 
                          size="lg"
                          className="w-full text-sm sm:text-base"
                        >
                          <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Download PNG
                        </Button>
                        <Button 
                          onClick={handleCustomCopyImage} 
                          variant="outline"
                          size="lg"
                          disabled={customCopied}
                          className="w-full text-sm sm:text-base"
                        >
                          {customCopied ? (
                            <>
                              <Check className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                              Copy to Clipboard
                            </>
                          )}
                        </Button>
                      </div>

                      {/* QR Info */}
                      <div className="bg-secondary/30 rounded-lg p-2 sm:p-3 text-[10px] sm:text-xs space-y-1">
                        <p><span className="font-medium">Style:</span> {customGeneratedQR.options.preset}</p>
                        <p><span className="font-medium">Dots:</span> {customGeneratedQR.options.dotStyle}</p>
                        <p><span className="font-medium">Size:</span> {customGeneratedQR.size}×{customGeneratedQR.size}px</p>
                      </div>
                    </div>
                  ) : !previewQR && !isGeneratingPreview ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <div className="w-24 h-24 bg-secondary/30 rounded-lg flex items-center justify-center mb-4">
                        <Palette className="w-8 h-8" />
                      </div>
                      <p className="text-center text-sm">
                        Configure your settings and generate a custom QR code
                      </p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}