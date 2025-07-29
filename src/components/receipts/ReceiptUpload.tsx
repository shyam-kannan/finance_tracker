import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Loader } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { processReceipt } from '../../services/ocrService';
import { Transaction } from '../../types';

interface ReceiptUploadProps {
  onTransactionProcessed: (transaction: Partial<Transaction>) => void;
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ onTransactionProcessed }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
    
    for (const file of acceptedFiles) {
      setIsProcessing(true);
      try {
        const processedTransaction = await processReceipt(file);
        onTransactionProcessed(processedTransaction);
      } catch (error) {
        console.error('Error processing receipt:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  }, [onTransactionProcessed]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 5
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(files => files.filter(file => file !== fileToRemove));
  };

  return (
    <Card className="mb-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Receipt</h3>
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
            isDragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop your receipts here' : 'Drag & drop receipts'}
          </p>
          <p className="text-gray-500 mb-4">
            Support for JPG, PNG, and PDF files
          </p>
          <Button variant="outline">
            Choose Files
          </Button>
        </div>

        {isProcessing && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-2">
              <Loader className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-800 font-medium">Processing receipt with OCR...</span>
            </div>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-900">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(1)} MB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};