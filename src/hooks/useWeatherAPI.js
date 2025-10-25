import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getMoment } from './../utils/helpers';

const fetchCurrentWeather = ( {authorizationKey, locationName} ) => {
  // setWeatherElement((prevState) => ({...prevState, isLoading: true,}));
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
  )
  .then((response) => response.json())
  .then((data) => {
    const locationData = data.records.Station[0];
    console.log('觀測站資料', data);
    return {
      observationTime: locationData.ObsTime.DateTime,
      locationName: locationData.GeoInfo.CountyName,
      temperature: locationData.WeatherElement.AirTemperature,
      windSpeed: locationData.WeatherElement.WindSpeed,
      isLoading: false,
    };
  });
};

const fetchWeatherForecast = ({authorizationKey, cityName}) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}`
  )
  .then((response) => response.json())
  .then((data) => {
    const locationData = data.records.location[1];
    console.log('三十六小時天氣預報', locationData);

    const weatherElements = locationData.weatherElement.reduce(
      (neededElements, item) => {
        if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
          neededElements[item.elementName] = item.time[0].parameter;
        }
        return neededElements;
      }, 
      {}
    );
    return {
      description: weatherElements.Wx.parameterName,
      weatherCode: weatherElements.Wx.parameterValue,
      rainPossibility: weatherElements.PoP.parameterName,
      comfortability: weatherElements.CI.parameterName,
    };
  });
};

const useWeatherAPI = ({authorizationKey, locationName, cityName}) => {
  const [currentTheme, setCurrentTheme] = useState('light');
  const moment = useMemo(() => getMoment(locationName), [locationName]);
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: '',
    description: '',
    windSpeed: 0,
    temperature: 0,
    rainPossibility: 0,
    comfortability: '',
    weatherCode: 0,
    isLoading: true,
  });

  const fetchData = async () => {
    const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather({authorizationKey, locationName}), fetchWeatherForecast({authorizationKey, cityName})]);   //5-7 取得所有API資料才更新畫面
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  };

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
    console.log('execute useEffect');
    console.log('moment', moment);
    fetchData();
  }, [moment]);

  return [weatherElement, fetchData];

};

export default useWeatherAPI;
