import React from 'react';
import './App.css';
import "preline/preline";
import { IStaticMethods } from "preline/preline";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Workout } from '@src/pages/Workout';
import { Dashboard } from '@src/pages/Dashboard';
import { CategoryManagement } from '@src/pages/Categories';
import { ExerciseManagement } from '@src/pages/Exercises';
import { History } from '@src/pages/History';
import { Calendar } from '@src/pages/Calendar';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/workout' element={<Workout />}></Route>
        <Route path='/history' element={<History />}></Route>
        <Route path='/calendar' element={<Calendar />}></Route>
        <Route path='/categories' element={<CategoryManagement />}></Route>
        <Route path='/exercises' element={<ExerciseManagement />}></Route>
        <Route path='/login' element={<Workout />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
