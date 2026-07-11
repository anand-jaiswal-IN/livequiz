'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchQuizzes, deleteQuiz, fetchOverallAnalytics } from '@/store/quizSlice';
import { MockAPI } from '@/lib/api';
import DashboardLayout from '@/components/templates/DashboardLayout';
import QuizCard from '@/components/molecules/QuizCard';
import StatsCard from '@/components/molecules/StatsCard';
import Button from '@/components/atoms/Button';

export default function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { quizzes, overallAnalytics, loading } = useAppSelector((state) => state.quiz);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchQuizzes());
      dispatch(fetchOverallAnalytics());
    }
  }, [dispatch, user]);

  const handleCreateQuiz = () => {
    router.push('/dashboard/quizzes/create');
  };

  const handleEditQuiz = (id: string) => {
    router.push(`/dashboard/quizzes/${id}`);
  };

  const handleDeleteQuiz = (id: string) => {
    if (confirm('Are you sure you want to delete this quiz set?')) {
      dispatch(deleteQuiz(id));
    }
  };

  const handleLaunchQuiz = async (id: string) => {
    try {
      const quiz = quizzes.find((q) => q.id === id);
      if (quiz && quiz.isPublished && quiz.joinCode) {
        // If already active, go directly to leaderboard
        router.push(`/dashboard/leaderboards/${quiz.joinCode}`);
      } else {
        // Publish and get code
        const code = await MockAPI.publishQuiz(id);
        dispatch(fetchQuizzes()); // Reload list to reflect active status
        router.push(`/dashboard/leaderboards/${code}`);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to launch quiz');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 animate-slide-up">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Host Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Welcome back, <span className="text-violet-400 font-bold">{user?.username}</span>! Manage your quizzes and inspect stats.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleCreateQuiz}
            className="flex items-center gap-2 py-3 px-6 shadow-md"
          >
            ✨ Create New Quiz
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="Total Quizzes"
            value={quizzes.length}
            icon="📚"
            description="Created quiz collections"
            color="primary"
          />
          <StatsCard
            title="Sessions Hosted"
            value={overallAnalytics?.totalPlays || 0}
            icon="🎮"
            description="Quizzes launched live"
            color="secondary"
          />
          <StatsCard
            title="Avg Players"
            value={overallAnalytics?.avgParticipants || 0}
            icon="👥"
            description="Players per active run"
            color="accent"
          />
        </div>

        {/* Quizzes List */}
        <div className="flex flex-col gap-4 mt-4">
          <h2 className="text-xl font-bold text-white px-1">Your Quizzes</h2>

          {loading && quizzes.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="glass-panel text-center py-20 rounded-2xl border border-gray-800/80">
              <span className="text-5xl block mb-4">📝</span>
              <h3 className="text-lg font-bold text-white mb-1">No quizzes found</h3>
              <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                You haven't created any quizzes yet. Click the button below to compose your first quiz!
              </p>
              <Button variant="outline" size="sm" onClick={handleCreateQuiz}>
                Create a Quiz
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  onEdit={handleEditQuiz}
                  onDelete={handleDeleteQuiz}
                  onLaunch={handleLaunchQuiz}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
