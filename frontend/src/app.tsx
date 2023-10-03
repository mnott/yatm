import { Fragment, useCallback, ChangeEvent } from "react";
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

import { FileBrowser, FileBrowserType } from "./pages/file";
import { BackupBrowser, BackupType } from "./pages/backup";
import { RestoreBrowser, RestoreType } from "./pages/restore";
import { TapesBrowser, TapesType } from "./pages/tapes";
import { JobsBrowser, JobsType } from "./pages/jobs";

import "./app.less";
import { sleep } from "./tools";
import { Nullable } from "tsdef";
import { Job } from "./entity";
import { useEffect } from "react";
import { useState } from "react";

// import reactLogo from './assets/react.svg'
// <img src={reactLogo} className="logo react" alt="React logo" />

const theme = createTheme({});

const Delay = ({ inner }: { inner: JSX.Element }) => {
  const [ok, setOK] = useState(false);
  useEffect(() => {
    setOK(false);
    (async () => {
      await sleep(0);
      setOK(true);
    })();
    return () => {
      setOK(false);
    };
  }, [inner]);

  return ok ? inner : null;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleTabChange = useCallback(
    (_: ChangeEvent<{}>, newValue: string) => {
      navigate("/" + newValue);
    },
    [navigate],
  );

  return (
    <div id="app">
      <ThemeProvider theme={theme}>
        <Tabs className="tabs" value={location.pathname.slice(1)} onChange={handleTabChange} indicatorColor="secondary">
          <Tab label="File" value={FileBrowserType} />
          <Tab label="Backup" value={BackupType} />
          <Tab label="Restore" value={RestoreType} />
          <Tab label="Tapes" value={TapesType} />
          <Tab label="Jobs" value={JobsType} />
        </Tabs>
        <Routes>
          <Route path="/*">
            <Route path={FileBrowserType} element={<Delay inner={<FileBrowser />} />} />
            <Route path={BackupType} element={<Delay inner={<BackupBrowser />} />} />
            <Route path={RestoreType} element={<Delay inner={<RestoreBrowser />} />} />
            <Route path={TapesType} element={<Delay inner={<TapesBrowser />} />} />
            <Route path={JobsType} element={<Delay inner={<JobsBrowser />} />} />
            <Route path="*" element={<Navigate to={"/" + FileBrowserType} replace />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
