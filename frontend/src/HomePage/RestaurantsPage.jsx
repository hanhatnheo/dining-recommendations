import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  Slider,
  TextField,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import config from '../../../server/config.json';

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState([60, 660]);
  const [plays, setPlays] = useState([0, 1000000000]);
  const [danceability, setDanceability] = useState([0, 1]);
  const [energy, setEnergy] = useState([0, 1]);
  const [valence, setValence] = useState([0, 1]);
  const [explicit, setExplicit] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs`)
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map(song => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_songs?title=${title}` +
      `&duration_low=${duration[0]}&duration_high=${duration[1]}` +
      `&plays_low=${plays[0]}&plays_high=${plays[1]}` +
      `&danceability_low=${danceability[0]}&danceability_high=${danceability[1]}` +
      `&energy_low=${energy[0]}&energy_high=${energy[1]}` +
      `&valence_low=${valence[0]}&valence_high=${valence[1]}` +
      `&explicit=${explicit}`
    )
      .then(res => res.json())
      .then(resJson => {
        const songsWithId = resJson.map(song => ({ id: song.song_id, ...song }));
        setData(songsWithId);
      });
  }

  const columns = [
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'duration', headerName: 'Duration', width: 110, valueFormatter: ({ value }) => `${Math.floor(value / 60)}:${value % 60 < 10 ? '0' : ''}${value % 60}` },
    { field: 'plays', headerName: 'Plays', width: 130 },
    { field: 'danceability', headerName: 'Danceability', width: 130 },
    { field: 'energy', headerName: 'Energy', width: 110 },
    { field: 'valence', headerName: 'Valence', width: 110 },
    { field: 'explicit', headerName: 'Explicit', width: 100, renderCell: (params) => params.value ? 'Yes' : 'No' },
  ];

  return (
    <Container>
      <h2>Search Songs</h2>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={explicit} onChange={(e) => setExplicit(e.target.checked)} />}
            label="Explicit"
          />
        </Grid>
        <Grid item xs={4}>
          <Slider
            value={duration}
            onChange={(e, newValue) => setDuration(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${Math.floor(value / 60)}m ${value % 60}s`}
            min={60}
            max={660}
            aria-labelledby="duration-slider"
          />
          <p>Duration Range</p>
        </Grid>
        <Grid item xs={4}>
          <Slider
            value={plays}
            onChange={(e, newValue) => setPlays(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `${(value / 1000000).toFixed(1)}M`}
            min={0}
            max={1100000000}
            aria-labelledby="plays-slider"
          />
          <p>Plays Range (Millions)</p>
        </Grid>
        <Grid item xs={4}>
          <Slider
            value={danceability}
            onChange={(e, newValue) => setDanceability(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={1}
            step={0.1}
            aria-labelledby="danceability-slider"
          />
          <p>Danceability</p>
        </Grid>
        <Grid item xs={4}>
          <Slider
            value={energy}
            onChange={(e, newValue) => setEnergy(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={1}
            step={0.1}
            aria-labelledby="energy-slider"
          />
          <p>Energy</p>
        </Grid>
        <Grid item xs={4}>
          <Slider
            value={valence}
            onChange={(e, newValue) => setValence(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={1}
            step={0.1}
            aria-labelledby="valence-slider"
          />
          <p>Valence</p>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={search} style={{ marginTop: 20 }}>
            Search
          </Button>
        </Grid>
      </Grid>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight
      />
    </Container>
  );
}
