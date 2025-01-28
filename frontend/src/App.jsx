import React, { useState } from 'react';
import Grid from "./components/Grid";
import Toolbar from './components/NavBar';

function App() {
  return(
    <>
      <Toolbar />
      <Grid sheetId = 'main' initialRows={10} initalCols={10} />
    </>
  )
}

export default App
