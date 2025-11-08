import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Leaderboard from '../components/Leaderboard';
import ResizeHandle from '../components/ResizeHandle';
import { DataService, emptyEncounter, type Encounter } from '../services/DataService';
import { WindowService } from '../services/WindowService';
import { useStateWithRef } from '../utils/Utils';
import './App.css';

function App() {
  const [uid, setUid] = useState('');
  const [limit, setLimit] = useState(5);
  const [serverUrl, setServerUrl] = useState('');
  const [isLite, setIsLite, isLiteRef] = useStateWithRef(true);

  const [selected, setSelected] = useState(-1);
  const [encounter, setEncounter] = useState<Encounter>(emptyEncounter);
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  const dataService = useRef<DataService>(null);
  const windowService = useRef<WindowService>(null);

  const findUserUid = (args?: string[]) => {
    if (!args) return;
    const KEY = "--uid=";
    const arg = args.find((a) => a.startsWith(KEY));
    if (!arg) return;
    return arg.substring(KEY.length).trim();
  }

  useEffect(() => {
    if (windowService.current) return;
    const service = new WindowService((locked) => {
      document.body.classList.toggle("locked", locked);
    });
    windowService.current = service;
    service.load();
    service.apply(isLite);
    service.listen();
    return () => service.dispose();
  }, []);

  useEffect(() => {
    if (!serverUrl) return;
    if (dataService.current) return;

    console.log('Creating service');
    window.api.windowArgs().then((args) => {
      const uid = findUserUid(args);
      if (uid) setUid(uid);
      console.log('UID', uid, args);
      if (dataService.current) return;
      const service = new DataService(serverUrl, uid);
      dataService.current = service;
      service.start(
        (e) => setEncounter(e),
        (e) => setEncounters(e),
      );
    });


    return () => dataService.current?.stop();
  }, [serverUrl]);

  useEffect(() => {
    window.api.onReady(setServerUrl);
    return () => window.api.offReady(setServerUrl);
  }, [])

  const onClear = async () => {
    console.log('Clear');
    const service = dataService.current;
    if (!service) return;
    service.clear();
    setSelected(-1);
    setEncounter(emptyEncounter);
    setEncounters(service.getEncounters());
  }

  const onLimit = () => {
    console.log('Limit');
    setLimit(limit === 5 ? 20 : 5);
  }

  const onMode = () => {
    console.log('Mode', !isLiteRef.current);
    const nextMode = !isLiteRef.current;
    setIsLite(nextMode);
    windowService.current?.apply(nextMode);
  }

  const onResize = (size: WindowSize, completed: boolean) => {
    console.log("Resizing lite: ", isLiteRef.current);
    windowService.current?.resize(size, isLiteRef.current);
    if (completed) windowService.current?.save();
  };

  const getLeaderboardState = () => {
    if (!serverUrl) return (
      <div className='dps-state'>
        <span>Initializing...</span>
      </div>
    );
    const renderEncounter = selected !== -1 ? encounters[selected] : encounter;
    if (selected !== 1 && renderEncounter.response.totalDamage === 0) {
      return (
        <div className='dps-state'>
          <span>Waiting...</span>
        </div>
      );
    }
    return (<Leaderboard encounter={renderEncounter} limit={limit} isLite={isLite} uid={uid} />);
  }

  return (
    <div className='dps-window'>
      <Header
        limit={limit}
        isLite={isLite}
        selected={selected}
        encounters={encounters}
        onMode={onMode}
        onLimit={onLimit}
        onClear={onClear}
        onClose={() => windowService.current?.close()}
        onSelect={(e) => setSelected(e)}
      />
      <div>{getLeaderboardState()}</div>
      <ResizeHandle onResize={onResize} />
    </div>
  )
}

export default App
