'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchQuizById, saveQuiz, fetchQuizAnalytics } from '@/store/quizSlice';
import DashboardLayout from '@/components/templates/DashboardLayout';
import QuizEditor from '@/components/organisms/QuizEditor';
import AnalyticsOverview from '@/components/organisms/AnalyticsOverview';
import Button from '@/components/atoms/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuizDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;

  const { currentQuiz, analytics, loading } = useAppSelector((state) => state.quiz);
  const [activeTab, setActiveTab] = useState<'analytics' | 'edit'>('analytics');

  useEffect(() => {
    if (quizId) {
      dispatch(fetchQuizById(quizId));
      dispatch(fetchQuizAnalytics(quizId));
    }
  }, [dispatch, quizId]);

  const handleSave = async (quizData: any) => {
    try {
      await dispatch(saveQuiz(quizData)).unwrap();
      setActiveTab('analytics');
      dispatch(fetchQuizAnalytics(quizId)); // Refresh stats
    } catch (err: any) {
      alert(err || 'Failed to save updates');
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (loading && !currentQuiz) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-32">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!currentQuiz) {
    return (
      <DashboardLayout>
        <div className="glass-panel text-center py-20 rounded-2xl border border-gray-800/85">
          <span className="text-4xl block mb-4">⚠️</span>
          <h2 className="text-xl font-bold text-white mb-2">Quiz not found</h2>
          <p className="text-gray-400 text-sm mb-6">
            The quiz you are looking for does not exist or you do not have permission to view it.
          </p>
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-800/60">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {currentQuiz.title}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Configure question details or inspect past run results.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            ← Back
          </Button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`
              px-6 py-3 font-bold text-sm tracking-wide transition-all border-b-2 cursor-pointer
              ${activeTab === 'analytics' ? 'border-violet-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}
            `}
          >
            📊 Performance Analytics
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`
              px-6 py-3 font-bold text-sm tracking-wide transition-all border-b-2 cursor-pointer
              ${activeTab === 'edit' ? 'border-violet-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}
            `}
          >
            ✏️ Edit Questions
          </button>
        </div>

        {/* Tab Panel */}
        <div className="mt-4">
          {activeTab === 'analytics' ? (
            <AnalyticsOverview analyticsData={analytics || []} />
          ) : (
            <QuizEditor
              initialQuiz={currentQuiz}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
