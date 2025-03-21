
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Challenge, ChallengeFormData } from '@/types/challenge';
import { useTeam } from '@/contexts/TeamContext';

export const useChallenges = () => {
  const { currentTeam, isTeamView } = useTeam();
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const savedChallenges = localStorage.getItem('challenges');
    return savedChallenges ? JSON.parse(savedChallenges) : [];
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading effect for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter challenges based on team view setting
  const filteredChallenges = isTeamView && currentTeam
    ? challenges.filter(challenge => challenge.teamId === currentTeam.id)
    : challenges;
  
  // Get selected challenges
  const selectedChallenges = filteredChallenges
    .filter(challenge => challenge.selected)
    .map(challenge => challenge.id);

  // Save to localStorage whenever challenges change
  useEffect(() => {
    localStorage.setItem('challenges', JSON.stringify(challenges));
  }, [challenges]);

  // Add a new challenge
  const addChallenge = (data: ChallengeFormData) => {
    const newChallenge: Challenge = {
      id: uuidv4(),
      title: data.title,
      category: data.category,
      impact: data.impact,
      scores: data.scores,
      status: data.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      selected: false,
      teamId: data.teamId || currentTeam?.id,
      teamName: data.teamName || currentTeam?.name
    };
    
    setChallenges(prev => [...prev, newChallenge]);
    return newChallenge;
  };

  // Update an existing challenge
  const updateChallenge = (id: string, data: Partial<ChallengeFormData>) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === id) {
        return {
          ...challenge,
          ...data,
          updatedAt: new Date()
        };
      }
      return challenge;
    }));
  };

  // Delete a challenge
  const deleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
  };

  // Auto-select challenges based on scores
  const autoSelectChallenges = (ids: string[]) => {
    // First, deselect all challenges
    setChallenges(prev => prev.map(challenge => ({
      ...challenge,
      selected: false
    })));
    
    // Then, select the challenges with the specified ids
    setChallenges(prev => prev.map(challenge => {
      if (ids.includes(challenge.id)) {
        return {
          ...challenge,
          selected: true
        };
      }
      return challenge;
    }));
  };

  return {
    challenges: filteredChallenges,
    allChallenges: challenges,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    autoSelectChallenges,
    selectedChallenges,
    isLoading
  };
};
