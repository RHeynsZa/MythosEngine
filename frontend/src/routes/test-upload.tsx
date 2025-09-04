import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ConversionResult } from '@/lib/imageConverter';

export const Route = createFileRoute('/test-upload')({
  component: TestUploadPage,
});

function TestUploadPage() {
  const [conversionResults, setConversionResults] = useState<ConversionResult[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleUpload = async (files: File[]) => {
    setUploadStatus(`Would upload ${files.length} files to the server...`);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUploadStatus(`Successfully "uploaded" ${files.length} files (demo mode)`);
    
    // Clear status after delay
    setTimeout(() => setUploadStatus(''), 3000);
  };

  const handleConversion = (results: ConversionResult[]) => {
    setConversionResults(results);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Image Upload & WebP Conversion Test</h1>
        <p className="text-muted-foreground">
          Test the client-side image conversion to WebP format. Upload images to see the compression results.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onUpload={handleUpload}
              onConvert={handleConversion}
              multiple={true}
              maxFiles={5}
              maxFileSize={10}
              convertToWebP={true}
              conversionOptions={{
                quality: 0.8,
                maxWidth: 1920,
                maxHeight: 1080
              }}
            />
            {uploadStatus && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">{uploadStatus}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Results</CardTitle>
          </CardHeader>
          <CardContent>
            {conversionResults.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Upload some images to see conversion results...
              </p>
            ) : (
              <div className="space-y-4">
                {conversionResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Image {index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.width} × {result.height}px
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {result.compressionRatio.toFixed(1)}% smaller
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Original</p>
                        <p className="font-medium">{formatBytes(result.originalSize)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">WebP</p>
                        <p className="font-medium">{formatBytes(result.convertedSize)}</p>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.max(5, result.compressionRatio)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Average Compression</p>
                    <p className="text-lg font-bold text-green-600">
                      {(conversionResults.reduce((acc, r) => acc + r.compressionRatio, 0) / conversionResults.length).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>WebP Benefits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">Better Compression</h3>
              <p className="text-sm text-green-600 mt-1">
                25-35% smaller than JPEG with same quality
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">Faster Loading</h3>
              <p className="text-sm text-blue-600 mt-1">
                Reduced bandwidth usage and load times
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800">Modern Support</h3>
              <p className="text-sm text-purple-600 mt-1">
                Supported by 95%+ of modern browsers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}