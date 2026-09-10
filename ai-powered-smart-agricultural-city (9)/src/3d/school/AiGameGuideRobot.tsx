import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SelectedNodeDetails } from '../../components/ObjectInfoPanel';
import { SportType, SportGuideInfo } from './SchoolTypes';

const SPORTS_DATA: Record<SportType, SportGuideInfo> = {
  Cricket: {
    name: 'Cricket',
    rules: [
      'Two teams of 11 players; batting team scores runs between 22-yard wickets.',
      'Bowlers deliver 6 legal balls per over from alternating ends.',
      'Dismissals include Bowled, Caught, LBW, Run Out, and Stumped.',
      'Boundaries score 4 runs (grounded) or 6 runs (direct aerial).',
    ],
    currentGame: 'Inter-House T20 Cup (Finals): Tigers vs Falcons',
    currentScore: 'Tigers 156/4 (18.4 ov) | Falcons 152/8 (20.0 ov) — Tigers need 3 runs in 8 balls',
    basicInstructions: [
      'Watch the ball seam and release point right out of bowler\'s hand.',
      'Coordinate run calls clearly: "Yes", "No", or "Wait".',
      'Maintain a high front elbow when driving through extra cover.',
      'Fielders back up throws behind the stumps to prevent overthrows.',
    ],
    equipmentNeeded: ['Cricket Bat', 'Leather/Tennis Ball', 'Stumps & Bails', 'Pads & Helmet'],
  },
  Football: {
    name: 'Football',
    rules: [
      '11 players per team; match played in two 45-minute halves.',
      'No hand contact allowed except by goalkeeper within penalty box.',
      'Ball must completely cross goal line between posts to count as goal.',
      'Offside rule enforced when attacker is ahead of 2nd-to-last defender.',
    ],
    currentGame: 'Campus Premier League: Blue Strikers vs Red Hawks',
    currentScore: 'Blue Strikers 2 - 1 Red Hawks (72\' Min)',
    basicInstructions: [
      'Cushion initial reception with inside of foot into open space.',
      'Keep head up before receiving to scan passing corridors.',
      'Maintain compact defensive lines to prevent through balls.',
      'Follow through low and drive through center of ball for shooting power.',
    ],
    equipmentNeeded: ['FIFA Size 5 Ball', 'Shin Guards', 'Cleated Footwear', 'Corner Flags'],
  },
  Basketball: {
    name: 'Basketball',
    rules: [
      '5 players on court; 24-second shot clock per possession.',
      'Dribble or pass to move; traveling or double-dribble results in turnover.',
      'Field goals inside 3-point arc = 2 pts; beyond arc = 3 pts; free throw = 1 pt.',
      '5 personal fouls disqualify player in high school/college FIBA rules.',
    ],
    currentGame: 'Varsity Junior Showcase: Titans vs Raptors',
    currentScore: 'Titans 58 - 54 Raptors (Q4 3:12 remaining)',
    basicInstructions: [
      'Assume triple-threat stance upon catching pass on perimeter.',
      'Keep eyes looking up court while dribbling without looking down.',
      'Snap wrist down on release with high follow-through arc.',
      'Box out opposing rebounders with wide base and arms outstretched.',
    ],
    equipmentNeeded: ['Size 7 Basketball', 'Hoop (10ft Height)', 'Non-Marking Shoes'],
  },
  Volleyball: {
    name: 'Volleyball',
    rules: [
      '6 players per side; maximum 3 touches to return ball over net.',
      'Rally point scoring: first team to 25 points (win by 2) wins set.',
      'Player cannot touch the net or cross centerline during play.',
      'Libero wears contrasting jersey; specialized defensive back-row player.',
    ],
    currentGame: 'Senior House Volleyball: Phoenix vs Cobras',
    currentScore: 'Set 2: Phoenix 21 - 19 Cobras (Set 1 won by Phoenix 25-22)',
    basicInstructions: [
      'Communicate loudly on every ball ("Mine!" or "Got it!").',
      'Lock wrists together with flat platform for forearm bump passing.',
      'Time 3-step approach jump (left-right-left) for overhead spike.',
      'Penetrate hands over net when blocking outside attacks.',
    ],
    equipmentNeeded: ['Volleyball (Regulation)', '2.43m / 2.24m Net', 'Knee Pads'],
  },
  Kabaddi: {
    name: 'Kabaddi',
    rules: [
      '7 players per team; 20-minute halves.',
      'Raider enters opposition half chanting "kabaddi" on a single breath.',
      'Raider tags defenders and must safely return across midline.',
      'Defenders work in chains to tackle, pin, and hold the raider.',
    ],
    currentGame: 'State Interschool Kabaddi Championship: Warriors vs Panthers',
    currentScore: 'Warriors 32 - 29 Panthers (Super Tackle active)',
    basicInstructions: [
      'Maintain strong chain grip with adjacent defender without breaking.',
      'Anticipate raider\'s turning point before executing ankle hold.',
      'Raiders should constantly scan for corner defenders dropping guard.',
      'Use quick toe-touches and swift retreat kicks while maintaining breath.',
    ],
    equipmentNeeded: ['Kabaddi Mat / Soft Clay Court', 'Ankle & Knee Braces'],
  },
  Badminton: {
    name: 'Badminton',
    rules: [
      'Played as singles or doubles to 21 points (best of 3 sets).',
      'Shuttlecock must stay within boundaries and cannot touch floor.',
      'Serve must be hit below waist level into diagonal service box.',
      'No net contact with racket or body during active rally.',
    ],
    currentGame: 'Singles Tournament Semifinal: Aarav K. vs Maya S.',
    currentScore: 'Game 2: Aarav 18 - Maya 17 (Game 1 Maya won 21-19)',
    basicInstructions: [
      'Master the split-step bounce immediately as opponent strikes shuttle.',
      'Return to central base position after every shot.',
      'Use forearm pronation and wrist snap for steep overhead smashes.',
      'Disguise drop shots with identical high-clear preparation swing.',
    ],
    equipmentNeeded: ['Graphite Racket', 'Feather Shuttlecock (Speed 77)', '1.55m Net'],
  },
};

interface AiGameGuideRobotProps {
  onSelectNode: (node: SelectedNodeDetails | null) => void;
  selectedSport: SportType;
  onSelectSport: (sport: SportType) => void;
  isNight?: boolean;
}

export const AiGameGuideRobot: React.FC<AiGameGuideRobotProps> = ({
  onSelectNode,
  selectedSport,
  onSelectSport,
  isNight = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const headRef = useRef<THREE.Group>(null);
  const whistleRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 1.8) * 0.2;
    }
  });

  const activeSportData = SPORTS_DATA[selectedSport];

  const handleSelectRobot = () => {
    setIsOpen(true);
    onSelectNode({
      id: 'ai-game-guide-robot',
      name: 'AI Athletic Coach & Sports Rules Guide (ROBO-COACH-7)',
      category: 'Smart Physical Education',
      status: 'active',
      efficiency: 99.6,
      powerKw: 0.35,
      description:
        'Interactive AI sports mentor, referee assistant, and digital coach. Provides live rule explanations, tactical strategy guides, active game telemetry, and automated officiating.',
      telemetryFields: [
        { label: 'Selected Sport', value: activeSportData.name },
        { label: 'Current Game', value: activeSportData.currentGame },
        { label: 'Live Score', value: activeSportData.currentScore },
        { label: 'Rules Available', value: `${activeSportData.rules.length} Standard Rules` },
        { label: 'Coaching Drills', value: 'Interactive Biomechanical Feedback Active' },
      ],
    });
  };

  return (
    <group
      position={[8.5, 0, 8]}
      onClick={(e) => {
        e.stopPropagation();
        handleSelectRobot();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Pedestal / Charging Dock */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[0.7, 0.8, 0.2, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} />
      </mesh>
      {/* Glowing Ring */}
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.55, 0.65, 32]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* 2. Coach Robot Body */}
      {/* Legs */}
      <mesh position={[-0.14, 0.6, 0]} castShadow>
        <boxGeometry args={[0.12, 0.8, 0.14]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[0.14, 0.6, 0]} castShadow>
        <boxGeometry args={[0.12, 0.8, 0.14]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Torso (Referee Stripe Jersey) */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.55, 0.65, 0.32]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.3} />
      </mesh>
      {/* Referee Whistle hanging */}
      <mesh ref={whistleRef} position={[0, 1.35, 0.18]}>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} />
      </mesh>

      {/* Articulated Head */}
      <group ref={headRef} position={[0, 1.8, 0]}>
        {/* Head Box */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.3, 0.3]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        {/* Coach Visor Eyes */}
        <mesh position={[0, 0.02, 0.16]}>
          <planeGeometry args={[0.28, 0.1]} />
          <meshStandardMaterial
            color="#22c55e"
            emissive="#22c55e"
            emissiveIntensity={isNight ? 3 : 2}
          />
        </mesh>
        {/* Coach Whistle / Megaphone Ear Speaker */}
        <mesh position={[0.22, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.08, 0.15, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} />
        </mesh>
      </group>

      {/* Arms holding Tactical Coach Tablet */}
      <mesh position={[-0.32, 1.2, 0.1]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      <mesh position={[0.32, 1.2, 0.1]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Tablet */}
      <mesh position={[0, 1.15, 0.28]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.45, 0.02, 0.32]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* 3. Floating 3D Interactive Sport Selector & Info Card */}
      <Html position={[0, 2.5, 0]} center distanceFactor={9} className="pointer-events-auto select-none">
        <div className="bg-slate-950/95 border border-emerald-400/80 p-3 rounded-2xl shadow-2xl text-left w-[330px] backdrop-blur-md font-mono text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              AI GAME GUIDE &bull; ROBO-COACH
            </span>
            <span className="text-[9px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 font-bold border border-emerald-800">
              {selectedSport.toUpperCase()}
            </span>
          </div>

          {/* Sport Selection Tabs (Cricket, Football, Basketball, Volleyball, Kabaddi, Badminton) */}
          <div className="grid grid-cols-3 gap-1 mb-2.5">
            {(['Cricket', 'Football', 'Basketball', 'Volleyball', 'Kabaddi', 'Badminton'] as SportType[]).map(
              (sport) => (
                <button
                  key={sport}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSport(sport);
                    handleSelectRobot();
                  }}
                  className={`py-1 px-1 rounded-lg text-[9px] font-bold uppercase transition-all text-center ${
                    selectedSport === sport
                      ? 'bg-emerald-500 text-slate-950 shadow-md font-black scale-102'
                      : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {sport}
                </button>
              )
            )}
          </div>

          {/* Active Sport Details Section */}
          <div className="space-y-2 text-[9px] bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
            {/* Current Game & Live Score */}
            <div>
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">
                CURRENT GAME & LIVE SCORE
              </div>
              <div className="font-bold text-sky-300 text-[9.5px]">
                {activeSportData.currentGame}
              </div>
              <div className="text-emerald-400 font-bold text-[9px] mt-0.5">
                {activeSportData.currentScore}
              </div>
            </div>

            {/* Rules */}
            <div className="border-t border-slate-800 pt-1.5">
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                OFFICIAL RULES
              </div>
              <ul className="space-y-0.5 text-slate-300">
                {activeSportData.rules.slice(0, 2).map((rule, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-1">
                    <span className="text-emerald-400 font-bold">&bull;</span>
                    <span className="leading-tight">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Basic Instructions */}
            <div className="border-t border-slate-800 pt-1.5">
              <div className="text-[8px] text-slate-400 uppercase font-bold tracking-wider mb-1">
                BASIC INSTRUCTIONS & TIPS
              </div>
              <ul className="space-y-0.5 text-slate-300">
                {activeSportData.basicInstructions.slice(0, 2).map((inst, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-1">
                    <span className="text-sky-400 font-bold">&bull;</span>
                    <span className="leading-tight">{inst}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};
