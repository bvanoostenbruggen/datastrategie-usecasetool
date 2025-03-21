
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Team {
  id: string;
  name: string;
}

interface TeamContextType {
  currentTeam: Team | null;
  allTeams: Team[];
  setCurrentTeam: (team: Team) => void;
  addTeam: (name: string) => Team;
  isTeamView: boolean;
  toggleTeamView: (value: boolean) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

interface TeamProviderProps {
  children: ReactNode;
}

export const TeamProvider = ({ children }: TeamProviderProps) => {
  const [currentTeam, setCurrentTeamState] = useState<Team | null>(() => {
    const saved = localStorage.getItem('currentTeam');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing current team:", e);
        return null;
      }
    }
    return null;
  });

  const [allTeams, setAllTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('allTeams');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing all teams:", e);
        return [];
      }
    }
    // Default teams
    return [
      { id: uuidv4(), name: 'Data Science' },
      { id: uuidv4(), name: 'Analytics' },
      { id: uuidv4(), name: 'Engineering' }
    ];
  });

  const [isTeamView, setIsTeamView] = useState<boolean>(() => {
    const saved = localStorage.getItem('isTeamView');
    return saved ? saved === 'true' : false;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('currentTeam', JSON.stringify(currentTeam));
  }, [currentTeam]);

  useEffect(() => {
    localStorage.setItem('allTeams', JSON.stringify(allTeams));
  }, [allTeams]);

  useEffect(() => {
    localStorage.setItem('isTeamView', isTeamView.toString());
  }, [isTeamView]);

  // If no current team is set, set the first one as default
  useEffect(() => {
    if (!currentTeam && allTeams.length > 0) {
      setCurrentTeamState(allTeams[0]);
    }
  }, [currentTeam, allTeams]);

  const setCurrentTeam = (team: Team) => {
    setCurrentTeamState(team);
  };

  const addTeam = (name: string): Team => {
    const newTeam = { id: uuidv4(), name };
    setAllTeams(prev => [...prev, newTeam]);
    return newTeam;
  };

  const toggleTeamView = (value: boolean) => {
    setIsTeamView(value);
  };

  return (
    <TeamContext.Provider value={{
      currentTeam,
      allTeams,
      setCurrentTeam,
      addTeam,
      isTeamView,
      toggleTeamView
    }}>
      {children}
    </TeamContext.Provider>
  );
};
