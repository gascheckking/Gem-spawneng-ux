import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  LayoutDashboard,
  Wallet,
  Coins,
  Gem,
  Swords,
  Users,
  Search,
  Settings,
  Menu,
  X,
  ShieldCheck,
  Flame,
  Activity,
  Heart,
  MessageSquare,
  ChevronsUp,
  ChevronsDown,
  Bell,
  Code,
  DollarSign,
  Briefcase,
  ExternalLink,
} from 'lucide-react';

// --- MOCK DATA FÖR ONE EVENT MESH (SEKTION 1) ---

const MOCK_USER_ID = "0x89C...4D2f";
const MOCK_APP_ID = "spawnengine-v1";
const MOCK_USERNAME = "MeshArchitect";

// Förenklad Event Shape för UI-demo
const generateMockEvent = (index) => {
  const kinds = [
    { kind: 'pack_open', label: 'Pack Öppnad', icon: <Gem size={16} />, color: 'text-indigo-400' },
    { kind: 'zora_buy', label: 'Zora Köp', icon: <DollarSign size={16} />, color: 'text-green-400' },
    { kind: 'burn', label: 'Fragment Burn', icon: <Flame size={16} />, color: 'text-red-400' },
    { kind: 'farcaster_cast', label: 'Farcaster Cast', icon: <MessageSquare size={16} />, color: 'text-blue-400' },
    { kind: 'whale_alert', label: 'Val Alert', icon: <Bell size={16} />, color: 'text-yellow-400' },
    { kind: 'treasure_hit', label: 'Relik Funnen', icon: <Coins size={16} />, color: 'text-purple-400' },
  ];
  const rarities = ['Fragment', 'Shard', 'Core', 'Artifact', 'Relic'];
  const actors = ['CreatorX', MOCK_USERNAME, 'SniperBot', 'WhaleA', 'NewUser'];
  const seriesIds = ['S001-ALPHA', 'S002-BETA', 'S003-ZORA'];
  const value = (Math.random() * 1000).toFixed(2);
  const selectedKind = kinds[index % kinds.length];

  return {
    id: `event-${1000 + index}`,
    timestamp: Date.now() - index * 60000 * (Math.random() * 5 + 1), // Några minuter tillbaka
    kind: selectedKind.kind,
    label: selectedKind.label,
    icon: selectedKind.icon,
    color: selectedKind.color,
    actor: actors[Math.floor(Math.random() * actors.length)],
    rarity: rarities[Math.floor(Math.random() * rarities.length)],
    seriesId: seriesIds[Math.floor(Math.random() * seriesIds.length)],
    value: parseFloat(value),
  };
};

const INITIAL_EVENTS = Array.from({ length: 30 }, (_, i) => generateMockEvent(i));

// --- GLOBAL STATE & CONTEXT ---

const views = {
  dashboard: { label: 'Dashboard / HUD', icon: LayoutDashboard },
  trading: { label: 'Trading Wall', icon: Activity },
  packs: { label: 'Packs & Inventory', icon: Briefcase },
  pull_lab: { label: 'Pull Lab / Luck Engine', icon: Gem },
  creator_forge: { label: 'Creator Forge', icon: Code },
  spawn_feed: { label: 'SpawnFeed / Reels', icon: MessageSquare },
  sup_cast: { label: 'SupCast / Support', icon: Users },
  settings: { label: 'Inställningar', icon: Settings },
};

const SeriesData = [
  { id: 'S001-ALPHA', name: 'Alpha Drop V1', spike: 'up', heat: 78, change: 12.3 },
  { id: 'S002-BETA', name: 'Base Beta Set', spike: 'down', heat: 22, change: -4.5 },
  { id: 'S003-ZORA', name: 'Zora Coin Rail', spike: 'up', heat: 95, change: 25.1 },
];

const GlobalState = ({ children }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isAuthReady, setIsAuthReady] = useState(true); // Mock auth ready
  const [alerts, setAlerts] = useState(3); // Mock Alerts Pulse

  // Simulerar realtidsuppdateringar till Mesh (sektion 1)
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prevEvents => {
        const newEvent = generateMockEvent(prevEvents.length);
        return [newEvent, ...prevEvents].slice(0, 30); // Behåll 30 senaste
      });
      setAlerts(prev => Math.min(5, prev + (Math.random() > 0.8 ? 1 : 0))); // Lägg till alerts ibland
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    activeView,
    setActiveView,
    isMenuOpen,
    setIsMenuOpen,
    events,
    isAuthReady,
    alerts,
  };

  return (
    <div className="bg-gray-900 min-h-screen font-inter text-gray-100 flex flex-col">
      {React.cloneElement(children, { ...contextValue })}
    </div>
  );
};

// --- KOMPONENTER FÖR GLOBAL SHELL (SEKTION 4) ---

const LiveTicker = ({ events }) => {
  // Filtrera ut de mest "intressanta" händelserna för Ticker
  const tickerEvents = useMemo(() =>
    events.filter(e => ['whale_alert', 'treasure_hit', 'series_spike', 'artifact'].some(k => e.kind.includes(k) || e.rarity.includes('Artifact') || e.rarity.includes('Relic')))
    , [events]);

  if (tickerEvents.length === 0) return null;

  const RarityIndicator = ({ rarity }) => {
    const colors = {
      Fragment: 'bg-gray-600',
      Shard: 'bg-indigo-600',
      Core: 'bg-purple-600',
      Artifact: 'bg-yellow-500 animate-pulse',
      Relic: 'bg-red-600 animate-ping',
      Omega: 'bg-white shadow-lg shadow-white/50',
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${colors[rarity] || 'bg-gray-700'} text-white`}>
        {rarity}
      </span>
    );
  };

  return (
    <div className="w-full overflow-hidden bg-gray-800 border-b border-indigo-900/50 py-2">
      <div className="flex animate-ticker whitespace-nowrap">
        {tickerEvents.map((event, index) => (
          <div
            key={event.id + index}
            className="flex items-center text-sm mx-4 space-x-2 p-1 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-all cursor-pointer shadow-inner"
          >
            <span className="text-gray-400">{new Date(event.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
            {event.icon}
            <span className="font-medium text-white">{event.actor}</span>
            <span className="text-indigo-400 font-bold">
              {event.kind === 'treasure_hit' ? 'Hittade' : event.kind === 'whale_alert' ? 'Köpte' : event.label}
            </span>
            <RarityIndicator rarity={event.rarity} />
            <span className="text-lg font-mono text-green-400">${event.value}</span>
            <ExternalLink size={14} className="text-gray-500" />
          </div>
        ))}
        {/* Duplicera för oändlig loop-effekt */}
        {tickerEvents.map((event, index) => (
          <div
            key={`dup-${event.id + index}`}
            className="flex items-center text-sm mx-4 space-x-2 p-1 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-all cursor-pointer shadow-inner"
          >
            <span className="text-gray-400">{new Date(event.timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
            {event.icon}
            <span className="font-medium text-white">{event.actor}</span>
            <span className="text-indigo-400 font-bold">
              {event.kind === 'treasure_hit' ? 'Hittade' : event.kind === 'whale_alert' ? 'Köpte' : event.label}
            </span>
            <RarityIndicator rarity={event.rarity} />
            <span className="text-lg font-mono text-green-400">${event.value}</span>
            <ExternalLink size={14} className="text-gray-500" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-ticker {
          animation: ticker 45s linear infinite;
        }
      `}</style>
    </div>
  );
};

const Header = ({ setActiveView, setIsMenuOpen, isAuthReady, alerts }) => {
  const [walletVisible, setWalletVisible] = useState(false);

  const StatusStrip = () => (
    <div className="flex items-center space-x-3 text-sm">
      {/* Status strip: Wallet State, Mode, Sync, Theme */}
      <div className="flex items-center space-x-1.5 p-1 px-3 bg-gray-800 rounded-full shadow-inner border border-gray-700">
        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" title="Mesh Sync: Live"></div>
        <span className="text-xs text-gray-400 font-mono">BASE | LIVE</span>
      </div>

      <button
        onClick={() => setWalletVisible(true)}
        className="relative flex items-center p-2 px-4 space-x-2 bg-indigo-700 hover:bg-indigo-600 transition-colors rounded-full font-semibold shadow-xl shadow-indigo-900/50"
      >
        <Wallet size={18} />
        <span>Ansluten</span>
        <span className="text-xs font-mono opacity-70">Vault 0.23 ETH</span>
      </button>

      <button
        onClick={() => { console.log('Show alerts'); setAlerts(0); }}
        className={`relative p-2 rounded-full transition-all ${alerts > 0 ? 'bg-red-600 animate-bounce' : 'bg-gray-800 hover:bg-gray-700'}`}
        title="Pulse Alerts"
      >
        <Bell size={18} />
        {alerts > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-900 ring-2 ring-gray-900">
            {alerts}
          </span>
        )}
      </button>
    </div>
  );

  return (
    <header className="flex justify-between items-center p-4 bg-gray-900 shadow-xl border-b border-gray-800 z-10">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors md:hidden"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Zap className="text-indigo-500 h-8 w-8" />
          <span>SpawnEngine</span>
        </h1>
      </div>
      <div className="hidden md:flex">
        {isAuthReady ? <StatusStrip /> : <button className="p-2 px-4 bg-indigo-700 rounded-full font-semibold">Anslut Plånbok</button>}
      </div>
    </header>
  );
};

const Navigation = ({ activeView, setActiveView, setIsMenuOpen, isMenuOpen }) => {
  const NavItem = ({ viewId, label, Icon }) => (
    <button
      onClick={() => { setActiveView(viewId); setIsMenuOpen(false); }}
      className={`flex items-center w-full p-3 my-1 rounded-xl transition-all font-medium text-left ${
        activeView === viewId
          ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-900/50'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      <Icon size={20} className="mr-3" />
      {label}
    </button>
  );

  const navClass = `fixed inset-y-0 left-0 w-64 bg-gray-900 p-6 z-20 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex md:flex-col transition-transform duration-300 ease-in-out border-r border-gray-800`;

  return (
    <nav className={navClass}>
      <button
        onClick={() => setIsMenuOpen(false)}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 md:hidden"
      >
        <X size={24} />
      </button>

      <div className="space-y-2 mb-8">
        <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Kärnvyer</h2>
        {Object.entries(views).slice(0, 4).map(([id, { label, icon }]) => (
          <NavItem key={id} viewId={id} label={label} Icon={icon} />
        ))}
      </div>

      <div className="space-y-2 mb-8">
        <h2 className="text-xs font-semibold uppercase text-gray-500 mb-2">Ekosystem</h2>
        {Object.entries(views).slice(4).map(([id, { label, icon }]) => (
          <NavItem key={id} viewId={id} label={label} Icon={icon} />
        ))}
        <NavItem viewId="leaderboard" label="Leaderboard" Icon={Swords} />
        <NavItem viewId="profile" label="Min Profil" Icon={Users} />
      </div>

      <div className="mt-auto pt-6 border-t border-gray-800">
        <div className="text-sm font-mono text-gray-500">
          <p>APP ID: {MOCK_APP_ID}</p>
          <p>Användare: {MOCK_USERNAME}</p>
        </div>
        <button className="flex items-center justify-center w-full mt-4 p-2 bg-red-700 hover:bg-red-600 rounded-xl transition-colors text-white font-semibold">
          <X size={16} className="mr-2" /> Logga Ut
        </button>
      </div>
    </nav>
  );
};

// --- KOMPONENTER FÖR KÄRNVYER (SEKTION 4) ---

const EventItem = ({ event }) => {
  const { kind, label, icon, color, actor, rarity, seriesId, value, timestamp } = event;

  const RarityColor = useMemo(() => {
    switch (rarity) {
      case 'Fragment': return 'bg-gray-700';
      case 'Shard': return 'bg-indigo-800';
      case 'Core': return 'bg-purple-800';
      case 'Artifact': return 'bg-yellow-800';
      case 'Relic': return 'bg-red-800';
      default: return 'bg-gray-800';
    }
  }, [rarity]);

  const ActionButton = () => {
    switch(kind) {
      case 'pack_open':
      case 'treasure_hit':
        return <button className="text-xs px-2 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500">Se Kort</button>;
      case 'burn':
        return <button className="text-xs px-2 py-1 rounded-full bg-red-600 hover:bg-red-500">Pull Lab</button>;
      case 'whale_alert':
        return <button className="text-xs px-2 py-1 rounded-full bg-green-600 hover:bg-green-500">Följ Val</button>;
      default:
        return <button className="text-xs px-2 py-1 rounded-full bg-gray-600 hover:bg-gray-500">Diskutera</button>;
    }
  };

  return (
    <div className="flex items-start p-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800 transition-colors">
      <div className={`p-2 rounded-full ${RarityColor} mr-4`}>
        {icon}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <div className="text-lg font-semibold flex items-center space-x-2">
            <span className={color}>{label}</span>
            <span className="text-xs font-mono text-gray-500">({new Date(timestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })})</span>
          </div>
          <span className={`text-sm font-bold px-2 py-0.5 rounded-full text-white ${RarityColor}`}>{rarity}</span>
        </div>
        <p className="text-sm text-gray-300">
          <span className="font-bold text-white">{actor}</span>
          {' '}interagerade med serie{' '}
          <span className="text-indigo-400 font-mono">{seriesId}</span>. Notional Value: <span className="text-green-400 font-mono">${value}</span>
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-xs text-gray-500 flex space-x-3">
            <button className="hover:text-white flex items-center"><Heart size={14} className="mr-1" /> 12</button>
            <button className="hover:text-white flex items-center"><MessageSquare size={14} className="mr-1" /> 5</button>
            <button className="hover:text-white flex items-center">#TAGS</button>
          </div>
          <ActionButton />
        </div>
      </div>
    </div>
  );
};

const DashboardHUD = ({ events }) => (
  <div className="p-4 space-y-6">
    <h2 className="text-2xl font-bold text-white">Mesh HUD / Översikt</h2>
    <p className="text-gray-400">En enda sammanhängande vy över all aktivitet i SpawnEngine-ekosystemet.</p>

    {/* Statistik kort */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-indigo-900/50">
        <p className="text-sm text-gray-400">Totala Packs Öppnade</p>
        <p className="text-3xl font-extrabold text-indigo-400">4,321</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-indigo-900/50">
        <p className="text-sm text-gray-400">Total Volym (24h)</p>
        <p className="text-3xl font-extrabold text-green-400">$1.2M</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-indigo-900/50">
        <p className="text-sm text-gray-400">Aktiva Skapare</p>
        <p className="text-3xl font-extrabold text-purple-400">18</p>
      </div>
      <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-indigo-900/50">
        <p className="text-sm text-gray-400">Mina XP / Nivå</p>
        <p className="text-3xl font-extrabold text-yellow-400">8,900 / 9</p>
      </div>
    </div>

    {/* Senaste aktivitet från Mesh */}
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
      <h3 className="text-xl font-semibold p-4 border-b border-gray-700 flex items-center">
        <Activity size={20} className="mr-2 text-indigo-400" /> Senaste Mesh Aktivitet
      </h3>
      <div className="max-h-[50vh] overflow-y-auto">
        {events.slice(0, 10).map(event => (
          <EventItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  </div>
);

const TradingWall = ({ events }) => {
  const [filter, setFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    if (filter === 'whales') {
      return events.filter(e => e.kind.includes('whale'));
    }
    if (filter === 'spikes') {
      return events.filter(e => e.rarity.includes('Artifact') || e.rarity.includes('Relic'));
    }
    return events;
  }, [events, filter]);

  const FilterButton = ({ id, label }) => (
    <button
      onClick={() => setFilter(id)}
      className={`px-4 py-2 rounded-full font-semibold transition-all ${
        filter === id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {label}
    </button>
  );

  const SeriesHeat = ({ series }) => {
    const isUp = series.spike === 'up';
    return (
      <div className="p-3 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition-colors cursor-pointer">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-white">{series.name}</span>
          <span className={`text-sm font-mono ${isUp ? 'text-green-400' : 'text-red-400'} flex items-center`}>
            {isUp ? <ChevronsUp size={16} /> : <ChevronsDown size={16} />} {series.change}%
          </span>
        </div>
        <div className="h-2 mt-2 rounded-full bg-gray-800">
          <div
            style={{ width: `${series.heat}%` }}
            className={`h-full rounded-full ${series.heat > 70 ? 'bg-red-500' : 'bg-indigo-500'}`}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Heat: {series.heat}</p>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-white">Trading Wall</h2>
      <p className="text-gray-400">Live feed av marknadshändelser, valar och serie-spikes.</p>

      {/* Heatmap (SEKTION 15) */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-white">Serie Heatmap</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SeriesData.map(series => <SeriesHeat key={series.id} series={series} />)}
        </div>
      </div>

      {/* Live Feed + Filter (SEKTION 15) */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div className="p-4 border-b border-gray-700 flex space-x-3 overflow-x-auto">
          <FilterButton id="all" label="All aktivitet" />
          <FilterButton id="whales" label="Valar" />
          <FilterButton id="spikes" label="Spikes / Sällsynta Pulls" />
          <FilterButton id="p2p" label="P2P Swaps (Mock)" />
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventItem key={event.id} event={event} />
            ))
          ) : (
            <div className="p-10 text-center text-gray-500">
              Ingen aktivitet matchar filter just nu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- HUVUDKOMPONENT ---

const App = ({ activeView, setActiveView, isMenuOpen, setIsMenuOpen, events, alerts }) => {
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardHUD events={events} />;
      case 'trading':
        return <TradingWall events={events} />;
      case 'packs':
        return <PlaceholderView title="Packs & Inventory" description="Här hanterar du dina öppnade och oöppnade packs, samt dina kort och rarities." />;
      case 'pull_lab':
        return <PlaceholderView title="Pull Lab / Luck Engine" description="Burn, Synth och den hårt bevakade Gamble-mekanismen (endast Fragment/Shard)." />;
      case 'creator_forge':
        return <PlaceholderView title="Creator Forge" description="Zero-code 'Roblox' för kontrakt: Ladda upp, definiera rarity, välj preset och deploya." />;
      case 'spawn_feed':
        return <PlaceholderView title="SpawnFeed / Onchain Reels" description="Vertikal feed av verifierade onchain-posts från Event Meshen." />;
      case 'sup_cast':
        return <PlaceholderView title="SupCast / Support as Gameplay" description="Community-drivna supportärenden belönade med XP och reputation." />;
      default:
        return <PlaceholderView title={views[activeView]?.label || 'Sektion'} description="Denna vy är under uppbyggnad, men dess plats i UX-huben är reserverad." />;
    }
  };

  const PlaceholderView = ({ title, description }) => (
    <div className="p-8 text-center h-full flex flex-col items-center justify-center">
      <h2 className="text-3xl font-extrabold text-indigo-400 mb-4">{title}</h2>
      <p className="text-lg text-gray-400 max-w-xl">{description}</p>
      <Code size={48} className="mt-8 text-gray-700" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        setActiveView={setActiveView}
        setIsMenuOpen={setIsMenuOpen}
        isAuthReady={true}
        alerts={alerts}
      />
      <LiveTicker events={events} />
      <div className="flex flex-grow overflow-hidden">
        <Navigation
          activeView={activeView}
          setActiveView={setActiveView}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
        />
        <main className="flex-grow overflow-y-auto w-full md:w-[calc(100%-16rem)]">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

// Wrappa App med GlobalState för att hantera Firebase/Auth och Mesh-simulering.
const AppWrapper = () => (
  <GlobalState>
    <App />
  </GlobalState>
);

export default AppWrapper;
