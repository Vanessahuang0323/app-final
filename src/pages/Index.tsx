import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, Upload, Search, BarChart3, Mic, Languages } from 'lucide-react';
import { Logo } from '../components/Logo';

type ProcessingStep = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
};

interface MatchingJob {
  id: string;
  title: string;
  company: string;
  location: string;
}

interface AnalysisPreview {
  coreSkills: string[];
  experience: string[];
  education: string[];
  matchingJobs: MatchingJob[];
}

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    {
      id: 'upload',
      title: '上傳履歷',
      description: '正在上傳您的履歷...',
      status: 'pending'
    },
    {
      id: 'analyze',
      title: '分析內容',
      description: '正在分析履歷內容...',
      status: 'pending'
    },
    {
      id: 'match',
      title: '職位配對',
      description: '正在尋找適合的職位...',
      status: 'pending'
    }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('請上傳 PDF 格式的履歷');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!file) {
      setError('請選擇要上傳的履歷');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // 模擬上傳進度
      const uploadInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(uploadInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // 模擬上傳完成
      await new Promise(resolve => setTimeout(resolve, 5000));
      clearInterval(uploadInterval);
      setUploadProgress(100);

      // 更新處理步驟狀態
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'upload' ? { ...step, status: 'completed' } : step
      ));

      // 模擬分析過程
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'analyze' ? { ...step, status: 'completed' } : step
      ));

      // 模擬配對過程
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessingSteps(prev => prev.map(step => 
        step.id === 'match' ? { ...step, status: 'completed' } : step
      ));

      // 模擬分析結果
      const mockAnalysis: AnalysisPreview = {
        coreSkills: ['React', 'TypeScript', 'Node.js', 'UI/UX Design'],
        experience: ['前端開發工程師', '全端開發工程師'],
        education: ['資訊工程學系'],
        matchingJobs: [
          {
            id: '1',
            title: '資深前端工程師',
            company: '科技公司 A',
            location: '台北市'
          },
          {
            id: '2',
            title: '全端開發工程師',
            company: '科技公司 B',
            location: '新北市'
          }
        ]
      };

      dispatch({ type: 'SET_ANALYSIS', payload: mockAnalysis });
      navigate('/analysis');
    } catch (err) {
      setError('上傳失敗，請稍後再試');
      setProcessingSteps(prev => prev.map(step => 
        step.status === 'processing' ? { ...step, status: 'error' } : step
      ));
    } finally {
      setIsUploading(false);
    }
  }, [file, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-8 pb-16">
      {/* Header and Title */}
      <div className="w-full max-w-2xl flex justify-between items-center px-4 mb-8">
        <h1 className="text-4xl font-bold text-center flex-grow">Tagnova</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'zh' ? 'en' : 'zh' })}
        >
          <Languages className="h-4 w-4 mr-2" />
          {state.language === 'zh' ? 'English' : '中文'}
        </Button>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-2">歡迎使用 TagNova</h2>
      <p className="text-gray-600 text-center mb-8">您的職涯發展夥伴</p>

      {/* AI Resume Analyzer Section */}
      <Card className="w-full max-w-2xl shadow-lg rounded-lg mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center">
            <Upload className="h-6 w-6 mr-2 text-purple-600" /> AI Resume Analyzer
          </CardTitle>
          <CardDescription className="text-md text-gray-600">
            Upload your resume and get personalized job recommendations with detailed analysis!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
              <Label htmlFor="resume">選擇 PDF 檔案</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>錯誤</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {isUploading && (
              <div className="space-y-2 mt-4">
                <Progress value={uploadProgress} />
                <div className="space-y-2">
                  {processingSteps.map(step => (
                    <div key={step.id} className="flex items-center space-x-2">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : step.status === 'processing' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : step.status === 'error' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="text-sm">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-6 pt-0">
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                處理中...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                開始分析
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Feature Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        <Card className="flex flex-col items-center text-center p-6 shadow-lg rounded-lg">
          <Search className="h-12 w-12 text-blue-500 mb-4" />
          <CardTitle className="text-lg font-semibold mb-2">AI 履歷分析</CardTitle>
          <CardDescription className="text-sm text-gray-600">Deep learning extraction of skills and potential</CardDescription>
        </Card>
        <Card className="flex flex-col items-center text-center p-6 shadow-lg rounded-lg">
          <BarChart3 className="h-12 w-12 text-purple-500 mb-4" />
          <CardTitle className="text-lg font-semibold mb-2">智能職位配對</CardTitle>
          <CardDescription className="text-sm text-gray-600">Precisely match with semantic tag analysis</CardDescription>
        </Card>
        <Card className="flex flex-col items-center text-center p-6 shadow-lg rounded-lg">
          <Mic className="h-12 w-12 text-green-500 mb-4" />
          <CardTitle className="text-lg font-semibold mb-2">模擬面試練習</CardTitle>
          <CardDescription className="text-sm text-gray-600">AI-generated questions with real-time feedback</CardDescription>
        </Card>
      </div>

      {/* Company/Student Buttons */}
      <div className="w-full max-w-2xl space-y-4 mb-8 px-4">
        <Button
          className="w-full py-6 text-lg bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600 transition-all shadow-md"
          onClick={() => navigate('/company/register')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building mr-2"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9.5 16h5"/><path d="M9.5 12h5"/><path d="M9.5 8h5"/></svg>
          I'm a Company
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-auto"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Button>
        <Button
          className="w-full py-6 text-lg bg-gradient-to-r from-blue-400 to-green-500 text-white hover:from-blue-500 hover:to-green-600 transition-all shadow-md"
          onClick={() => navigate('/student/register')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap mr-2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v4c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-4"/><path d="M12 2v3"/><path d="M16.5 7.5L14 6"/><path d="M7.5 7.5 10 6"/></svg>
          I'm a Student
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right ml-auto"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Button>
      </div>

      {/* Platform Statistics Section */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg text-center mb-8">
        <h3 className="text-2xl font-bold mb-6">Platform Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-4xl font-extrabold text-purple-600">12K+</p>
            <p className="text-gray-500">Active Users</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-red-500">850+</p>
            <p className="text-gray-500">Companies</p>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-green-500">94%</p>
            <p className="text-gray-500">Match Rate</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center text-gray-500 text-sm mt-8">
        &copy; 2024 TagNova. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
