import { useState } from "react";
import { CreateTournamentStep1 } from "./create-tournament-step1";
import { CreateTournamentStep2 } from "./create-tournament-step2";
import { CreateTournamentStep3 } from "./create-tournament-step3";
import { CreateTournamentStep4 } from "./create-tournament-step4";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "expo-router";

interface Team {
  id: string;
  name: string;
  shieldUrl?: string;
}

export default function CreateTournamentFlow() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [tournamentData, setTournamentData] = useState({
    name: "",
    description: "",
    format: "league" as "league" | "groups" | "playoffs" | "combined",
  });
  const [teams, setTeams] = useState<Team[]>([]);
  const [settings, setSettings] = useState({
    pointsWin: 3,
    pointsDraw: 1,
    pointsLoss: 0,
    rounds: 1,
  });

  const handleStep1Next = (data: any) => {
    setTournamentData(data);
    setStep(2);
  };

  const handleStep2Next = (teamsData: Team[]) => {
    setTeams(teamsData);
    setStep(3);
  };

  const handleStep3Next = (settingsData: any) => {
    setSettings(settingsData);
    setStep(4);
  };

  const handleStep4Confirm = async () => {
    if (!user) {
      alert("Usuario no autenticado");
      return;
    }

    try {
      // TODO: Call API to create tournament
      // const tournament = await trpc.tournaments.create.mutate({
      //   userId: user.id,
      //   name: tournamentData.name,
      //   description: tournamentData.description,
      //   format: tournamentData.format,
      // });

      // TODO: Add teams
      // for (const team of teams) {
      //   await trpc.tournaments.addTeam.mutate({
      //     tournamentId: tournament.id,
      //     name: team.name,
      //     shieldUrl: team.shieldUrl,
      //   });
      // }

      // TODO: Create settings
      // await trpc.tournaments.createSettings.mutate({
      //   tournamentId: tournament.id,
      //   ...settings,
      // });

      // TODO: Generate fixture
      // await trpc.tournaments.generateFixture.mutate(tournament.id);

      // Navigate to tournament detail
      router.back();
    } catch (error) {
      console.error("Error creating tournament:", error);
      throw error;
    }
  };

  if (step === 1) {
    return (
      <CreateTournamentStep1
        onNext={handleStep1Next}
        onBack={() => router.back()}
      />
    );
  }

  if (step === 2) {
    return (
      <CreateTournamentStep2
        onNext={handleStep2Next}
        onBack={() => setStep(1)}
        initialTeams={teams}
      />
    );
  }

  if (step === 3) {
    return (
      <CreateTournamentStep3
        format={tournamentData.format}
        onNext={handleStep3Next}
        onBack={() => setStep(2)}
        initialData={settings}
      />
    );
  }

  if (step === 4) {
    return (
      <CreateTournamentStep4
        tournamentName={tournamentData.name}
        format={tournamentData.format}
        teams={teams}
        pointsWin={settings.pointsWin}
        pointsDraw={settings.pointsDraw}
        pointsLoss={settings.pointsLoss}
        rounds={settings.rounds}
        onConfirm={handleStep4Confirm}
        onBack={() => setStep(3)}
      />
    );
  }

  return null;
}
