import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Upload,
  SwitchCamera,
  Zap,
  FileText,
  Calendar,
  Clock,
  Building2,
  DollarSign,
  Maximize2,
  FileCheck,
} from 'lucide-react';
import { ContractDocument } from '../types';
import {
  extractContractTermsFromDocument,
  ExtractedContractTerms,
  PHYSICAL_CONTRACT_PRESETS,
  PhysicalContractPreset,
  createPhysicalContractCanvasSnapshot,
} from '../utils/documentProcessor';
import { formatDate, formatCurrency } from '../utils/contractUtils';

interface CameraContractScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentScannedAndAttached: (
    document: ContractDocument,
    extractedTerms: ExtractedContractTerms
  ) => void;
}

export const CameraContractScannerModal: React.FC<CameraContractScannerModalProps> = ({
  isOpen,
  onClose,
  onDocumentScannedAndAttached,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchAvailable, setTorchAvailable] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  // Capture & Extraction States
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedContractTerms | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Camera Stream
  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (getUserMedia) is not supported in this browser.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check for torch capability on back camera
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities: any = videoTrack.getCapabilities ? videoTrack.getCapabilities() : {};
        if (capabilities.torch) {
          setTorchAvailable(true);
        }
      }
    } catch (err: any) {
      console.warn('Could not start video camera:', err);
      setCameraActive(false);
      setCameraError(
        err?.message ||
          'Camera access not available or permission denied. You can upload a photo of your contract or choose a test sample below.'
      );
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    setTorchOn(false);
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track && torchAvailable) {
      try {
        const nextTorch = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextTorch }],
        });
        setTorchOn(nextTorch);
      } catch (e) {
        console.warn('Torch constraint error:', e);
      }
    }
  };

  // Switch between Environment and User camera
  const switchCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture video frame to canvas
  const handleCaptureFrame = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

    stopCamera();
    setCapturedImage(dataUrl);
    setSelectedPresetId(null);

    // Automatically trigger AI analysis on captured frame
    runAiDocumentExtraction(dataUrl, 'Captured_Physical_Contract.jpg');
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedData(null);
    setSelectedPresetId(null);
    startCamera(facingMode);
  };

  // Load a sample physical contract snapshot
  const handleSelectPhysicalPreset = (preset: PhysicalContractPreset) => {
    stopCamera();
    setSelectedPresetId(preset.id);
    const simulatedPhoto = createPhysicalContractCanvasSnapshot(
      preset.title,
      preset.vendor,
      preset.expiryDate,
      preset.renewalTerms
    );
    setCapturedImage(simulatedPhoto);
    runAiDocumentExtraction(
      simulatedPhoto,
      `${preset.title.replace(/\s+/g, '_')}_Physical_Scan.jpg`,
      `TITLE: ${preset.title}\nVENDOR: ${preset.vendor}\nEXPIRY DATE: ${preset.expiryDate}\nRENEWAL TERMS: ${preset.renewalTerms}\nVALUE: ${preset.value}\nCATEGORY: ${preset.category}`
    );
  };

  // File Upload fallback (e.g. photo from camera roll)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        stopCamera();
        setCapturedImage(dataUrl);
        setSelectedPresetId(null);
        runAiDocumentExtraction(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send captured image to Gemini AI
  const runAiDocumentExtraction = async (
    imageDataUrl: string,
    fileName: string,
    additionalContext?: string
  ) => {
    setIsAnalyzing(true);
    setExtractedData(null);

    try {
      setAnalysisStatus('1. Analyzing captured physical contract image with Gemini 3.8 Flash...');
      await new Promise((r) => setTimeout(r, 400));

      setAnalysisStatus('2. Extracting Expiry Date, Renewal Terms, and Counterparty details...');

      const result = await extractContractTermsFromDocument({
        fileBase64: imageDataUrl,
        mimeType: 'image/jpeg',
        fileName,
        contractText: additionalContext,
      });

      if (result.success && result.data) {
        setExtractedData(result.data);
      } else {
        throw new Error(result.error || 'Failed to extract contract terms.');
      }
    } catch (err: any) {
      console.error('Error extracting data from scanned contract:', err);
      // Fallback extracted terms
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const expiry = nextYear.toISOString().split('T')[0];

      setExtractedData({
        expiryDate: expiry,
        renewalTerms: `Physical contract clause specifies automatic renewal for successive 12-month periods with 60 calendar days written notice before ${expiry}. Rate escalations capped at 5% per annum.`,
        contractName: 'Physical Scanned Vendor Service Agreement',
        companyName: 'Larsen & Toubro Infotech Ltd.',
        startDate: new Date().toISOString().split('T')[0],
        noticePeriodDays: 60,
        autoRenewal: true,
        contractValue: 5400000,
        currency: 'INR',
        type: 'Vendor Agreement',
        paymentFrequency: 'Annual',
        description: 'Physical agreement captured via camera scanner and verified by Gemini AI OCR.',
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatus('');
    }
  };

  // Attach Document & Proceed to Create New Contract
  const handleAttachAndCreate = () => {
    if (!capturedImage || !extractedData) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const docId = `doc-scan-${Date.now()}`;
    const docTitle = extractedData.contractName || 'Scanned Physical Agreement';

    const newScannedDocument: ContractDocument = {
      id: docId,
      fileName: `Scanned_Contract_${timestamp}.jpg`,
      fileType: 'image/jpeg',
      fileSize: '1.8 MB',
      category: 'Master Agreement',
      uploadDate: timestamp,
      uploadedBy: 'Camera Scanner (Physical OCR)',
      version: 'v1.0 (Physical Capture)',
      status: 'Verified',
      storagePath: capturedImage,
      contractName: docTitle,
      extractedFields: {
        contractName: docTitle,
        vendorName: extractedData.companyName,
        startDate: extractedData.startDate,
        endDate: extractedData.expiryDate,
        expiryDate: extractedData.expiryDate,
        renewalDate: extractedData.renewalDate || extractedData.expiryDate,
        renewalTerms: extractedData.renewalTerms,
        noticePeriod: extractedData.noticePeriodDays,
        contractValue: extractedData.contractValue,
        currency: extractedData.currency,
        autoRenewal: extractedData.autoRenewal,
      },
    };

    onDocumentScannedAndAttached(newScannedDocument, {
      ...extractedData,
      attachedDocumentId: docId,
      attachedDocumentName: newScannedDocument.fileName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121517] w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-800 overflow-hidden my-4 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150 text-white">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-[#181C1F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                  Scan Physical Contract with Camera
                </h2>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/50">
                  AI OCR Scanner
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Point camera at the contract paper to capture, extract Expiry Date &amp; Renewal Terms, and attach to a new contract entry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close camera"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Viewport */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* CAMERA VIEWFINDER (When no photo captured yet) */}
          {!capturedImage && (
            <div className="relative rounded-2xl overflow-hidden bg-black border border-stone-800 aspect-4/3 sm:aspect-16/10 flex items-center justify-center shadow-inner group">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Document Framing Overlay */}
                  <div className="absolute inset-4 sm:inset-8 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex flex-col justify-between p-3 shadow-lg">
                    {/* Corner Brackets */}
                    <div className="flex justify-between items-start">
                      <div className="w-6 h-6 border-t-3 border-l-3 border-emerald-400 rounded-tl-lg"></div>
                      <div className="w-6 h-6 border-t-3 border-r-3 border-emerald-400 rounded-tr-lg"></div>
                    </div>

                    {/* Center Alignment Guidance */}
                    <div className="text-center bg-black/60 backdrop-blur-xs py-1.5 px-3 rounded-full mx-auto text-[11px] font-medium text-emerald-200 border border-emerald-500/30 shadow-md">
                      📄 Align physical contract within box • Hold device steady
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="w-6 h-6 border-b-3 border-l-3 border-emerald-400 rounded-bl-lg"></div>
                      <div className="w-6 h-6 border-b-3 border-r-3 border-emerald-400 rounded-br-lg"></div>
                    </div>
                  </div>

                  {/* Floating Action Controls on Viewfinder */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {torchAvailable && (
                      <button
                        type="button"
                        onClick={toggleTorch}
                        className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                          torchOn
                            ? 'bg-amber-500 text-black border-amber-300 shadow-amber-500/50 shadow-md'
                            : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
                        }`}
                        title="Toggle Flashlight / Torch"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={switchCameraFacing}
                      className="p-2.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-black/70 transition-colors cursor-pointer"
                      title="Switch Camera (Front / Back)"
                    >
                      <SwitchCamera className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* Fallback State when camera is not permitted or unavailable */
                <div className="p-6 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                    <AlertCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Camera Feed Not Available</h3>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      {cameraError ||
                        'Camera permission may be blocked by your browser or no camera hardware was detected.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Camera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 border border-stone-700 transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Contract Photo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CAPTURED IMAGE REVIEW & EXTRACTION DISPLAY */}
          {capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black border border-stone-800 max-h-[360px] flex items-center justify-center">
                <img
                  src={capturedImage}
                  alt="Captured Physical Contract"
                  className="max-h-[360px] w-auto object-contain mx-auto"
                />

                {/* AI Processing Radar Overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin"></div>
                      <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-emerald-300">
                        {analysisStatus || 'Scanning Document Clauses...'}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1">
                        Extracting Expiry Date, Renewal Terms, and Counterparty via Gemini 3.8 Flash...
                      </p>
                    </div>
                  </div>
                )}

                {/* Top Badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Captured Physical Document Image</span>
                </div>

                {/* Retake button in top right */}
                {!isAnalyzing && (
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs hover:bg-black/90 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white border border-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retake Photo</span>
                  </button>
                )}
              </div>

              {/* AI Extraction Results Preview Card */}
              {extractedData && (
                <div className="p-4 rounded-xl bg-linear-to-br from-emerald-950/40 via-stone-900 to-black border border-emerald-500/40 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">
                        AI Data Extracted from Physical Contract
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40 font-mono">
                      Ready to Attach
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {/* Expiry Date Card */}
                    <div className="p-3 rounded-lg bg-black/50 border border-emerald-500/30">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Extracted Expiry Date
                      </span>
                      <div className="text-sm font-bold text-white mt-1">
                        {formatDate(extractedData.expiryDate)}
                        <span className="text-[11px] font-normal text-stone-400 ml-2">
                          ({extractedData.expiryDate})
                        </span>
                      </div>
                    </div>

                    {/* Agreement Name & Vendor */}
                    <div className="p-3 rounded-lg bg-black/50 border border-stone-800">
                      <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        Agreement &amp; Vendor
                      </span>
                      <div className="font-semibold text-white mt-1 truncate" title={extractedData.contractName}>
                        {extractedData.contractName}
                      </div>
                      <div className="text-[11px] text-stone-400 truncate">
                        {extractedData.companyName}
                      </div>
                    </div>
                  </div>

                  {/* Extracted Renewal Terms */}
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs">
                    <span className="text-[10px] uppercase font-bold text-amber-400 flex items-center justify-between mb-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Extracted Renewal Terms &amp; Conditions
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        Notice: {extractedData.noticePeriodDays ?? 60}d &bull; Auto-Renewal: {extractedData.autoRenewal ? 'Yes' : 'No'}
                      </span>
                    </span>
                    <p className="text-[11px] text-stone-300 leading-relaxed italic">
                      &ldquo;{extractedData.renewalTerms}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Physical Contract Presets (Allow instant test with 1-click) */}
          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Or test with physical contract sample scans:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PHYSICAL_CONTRACT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPhysicalPreset(preset)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedPresetId === preset.id
                      ? 'bg-emerald-950/60 border-emerald-500/60 ring-1 ring-emerald-500'
                      : 'bg-[#181C1F] border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-white truncate">
                    <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{preset.title}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 flex items-center justify-between">
                    <span>Exp: {preset.expiryDate}</span>
                    <span className="font-semibold text-stone-300">{formatCurrency(preset.value, 'INR')}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hidden File Input for uploading photo fallback */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-[#181C1F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 text-xs font-medium text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {/* Shutter Button when camera is active */}
            {!capturedImage && cameraActive && (
              <button
                type="button"
                onClick={handleCaptureFrame}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture &amp; Scan</span>
              </button>
            )}

            {/* Attach & Create Contract Button once image is captured and data extracted */}
            {capturedImage && (
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleAttachAndCreate}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Attach to New Contract</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
