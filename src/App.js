import styled from '@emotion/styled';
import React, { useState, useEffect, useCallback, useMemo, use } from 'react';
import { ThemeProvider } from '@emotion/react'
import WeatherCard from './views/WeatherCard'
import WeatherSetting from './views/WeatherSetting';
import useWeatherAPI from './hooks/useWeatherAPI';
import {getMoment, findLocation } from './utils/helpers';

const AUTHORIZATION_KEY = 'CWA-E17C389E-75B4-42FC-988C-DC19C666A466';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const App = () => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };
  const storageCity = localStorage.getItem('cityName')||'臺北市';
  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName, sunriseCityName } = currentLocation;
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  const [weatherElement, fetchData] = useWeatherAPI({
    authorizationKey: AUTHORIZATION_KEY,
    locationName: cityName,
    cityName: locationName,
  });
  const handleCurrentCityChange = (CurrentCity) => {
    setCurrentCity(CurrentCity);
  };
  

  return (
    console.log('cityName', cityName, 'locationName', locationName, 'sunriseCityName', sunriseCityName),
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard 
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />          
        )}
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting cityName={cityName} handleCurrentCityChange={handleCurrentCityChange} handleCurrentPageChange={handleCurrentPageChange} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;