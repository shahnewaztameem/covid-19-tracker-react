import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Select, Card, CardContent } from '@material-ui/core';
import "leaflet/dist/leaflet.css";

import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { prettyPrintStat, sortData } from './util';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapcountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState('cases');


  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then(response => response.json())
        .then(data => {
          console.log(data)
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2,
            flag: country.countryInfo.flag
          }));

          const sortedData = sortData(data);
          setCountries(countries);
          setTableData(sortedData);
          setMapcountries(data);
        });
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data)
      })
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);

        if(data.countryInfo) {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
        
      })
  }

  return (
    <div className="app">
      <div className="app__left">
        {/* header */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">🌎 Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>
                  <span className="app__countryFlag">
                    <img src={country.flag} alt={country.value} />
                  </span>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* info */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === 'cases'}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
            onClick={e => setCasesType('cases')}
          />
          <InfoBox
            active={casesType === 'recovered'}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
            onClick={e => setCasesType('recovered')}
          />
          <InfoBox
            isRed
            active={casesType === 'deaths'}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
            onClick={e => setCasesType('deaths')}
          />
        </div>

        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />

      </div>
      <Card className="app__right">
        <CardContent>
          <h3 className="app__liveCasesTitle">Live Cases By Country</h3>

          <Table countries={tableData} />

          <h3 className="app__graphTitle">Worldwide New {casesType}</h3>

          {/* graph */}
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
