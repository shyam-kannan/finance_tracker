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
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles);
    setError('');
    
    for (const file of acceptedFiles) {
      setIsProcessing(true);
      setProcessingStatus('Analyzing receipt with AI...');
      
      try {
        const processedTransaction = await processReceipt(file);
        onTransactionProcessed(processedTransaction);
        setProcessingStatus('Receipt processed successfully!');
      } catch (error) {
        console.error('Error processing receipt:', error);
        setError(error instanceof Error ? error.message : 'Failed to process receipt');
      } finally {
        setIsProcessing(false);
        setTimeout(() => {
          setProcessingStatus('');
          setError('');
        }, 3000);
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
              <span className="text-blue-800 font-medium">{processingStatus}</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}
        
        {processingStatus && !isProcessing && !error && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-green-800 font-medium">{processingStatus}</span>
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
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="text-sm font-medium text-yellow-900 mb-2">Setup Required</h4>
        <p className="text-sm text-yellow-800">
          To use AI-powered receipt analysis, add your OpenAI API key to the environment variables:
        </p>
        <code className="block mt-2 p-2 bg-yellow-100 rounded text-xs text-yellow-900">
          VITE_OPENAI_API_KEY=your_api_key_here
        </code>
      </div>
    </Card>
  );
};