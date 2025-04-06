// AuthProtectedTutor.tsx
'use client';

import PersonalizedTutor, { LearningModule } from './PersonalizedTutor';
import { useAuth } from '@/context/AuthContext';

interface AuthProtectedTutorProps {
  selectedModule: LearningModule | null;
}

export default function AuthProtectedTutor({ selectedModule }: AuthProtectedTutorProps) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="p-4 text-center text-red-400">
        Please sign in to use the tutor
      </div>
    );
  }

  return (
    <PersonalizedTutor
      onClose={() => {}}
      selectedModule={selectedModule}
      authToken={user.uid} // Or get the actual token
    />
  );
}