
import { useState } from 'react';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { useChallenges } from '@/hooks/useChallenges';
import { ChallengeForm } from '@/components/ChallengeForm';
import { ChallengeList } from '@/components/ChallengeList';
import { ChallengeAutoSelector } from '@/components/ChallengeAutoSelector';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { TeamViewToggle } from '@/components/TeamViewToggle';
import { useTeam } from '@/contexts/TeamContext';

const Challenges = () => {
  const { 
    challenges, 
    addChallenge, 
    updateChallenge, 
    deleteChallenge, 
    autoSelectChallenges,
    selectedChallenges,
    isLoading 
  } = useChallenges();
  
  const { isTeamView, toggleTeamView } = useTeam();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container max-w-7xl px-4 py-6 md:py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
              <p className="text-muted-foreground mt-2">
                Step 1: Define the challenges your organization faces before selecting use cases.
              </p>
            </div>
            
            <Button asChild size="lg" className="gap-2" variant="purple">
              <Link to="/">
                Continue to Use Cases <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 gap-6">
            <ChallengeForm onSubmit={addChallenge} />
            
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <h2 className="text-xl font-semibold">Your Challenges</h2>
                  <span className="text-sm text-muted-foreground ml-4">
                    {challenges.length} {challenges.length === 1 ? 'challenge' : 'challenges'}, 
                    {' '}{selectedChallenges.length} selected
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <TeamViewToggle 
                    isTeamView={isTeamView}
                    onToggle={toggleTeamView}
                  />
                  
                  {!isLoading && challenges.length > 0 && (
                    <ChallengeAutoSelector 
                      challenges={challenges}
                      onAutoSelect={autoSelectChallenges}
                    />
                  )}
                </div>
              </div>
              
              {isLoading ? (
                <Card className="p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded-md mb-4 w-2/3"></div>
                  <div className="h-4 bg-muted rounded-md mb-3 w-full"></div>
                  <div className="h-4 bg-muted rounded-md mb-3 w-5/6"></div>
                  <div className="h-4 bg-muted rounded-md w-4/6"></div>
                </Card>
              ) : (
                <ChallengeList 
                  challenges={challenges} 
                  onEdit={updateChallenge}
                  onDelete={deleteChallenge}
                  selectedChallenges={selectedChallenges}
                  onToggleSelection={(id) => {
                    // Update selected state in the challenge
                    const challenge = challenges.find(c => c.id === id);
                    if (challenge) {
                      updateChallenge(id, { selected: !challenge.selected });
                    }
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Challenges;
