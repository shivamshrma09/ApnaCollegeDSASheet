import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DSASheet from './DSASheet';

const CPDashboard = () => {
  const { isDark } = useTheme();
  const [selectedSheet, setSelectedSheet] = useState('striver-cp');

  const handleSheetChange = (sheetType) => {
    setSelectedSheet(sheetType);
  };

  return (
    <div>
      {selectedSheet === 'striver-cp' && (
        <DSASheet 
          sheetType="cp" 
          onSheetChange={handleSheetChange}
        />
      )}
    </div>
  );
};

export default CPDashboard;