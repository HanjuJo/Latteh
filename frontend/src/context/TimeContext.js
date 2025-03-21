import React from 'react';

const TimeContext = React.createContext({
  timeOfDay: 'morning' // 기본값
});

export default TimeContext; 