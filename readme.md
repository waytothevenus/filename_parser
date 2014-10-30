# parse-torrent-name [![Build Status](https://travis-ci.org/jzjzjzj/parse-torrent-name.svg?branch=master)](https://travis-ci.org/jzjzjzj/parse-torrent-name)

Parses torrent name of a movie or TV show.

**Possible parts extracted:**

- codec
- episode
- excess
- group
- quality
- region
- resolution
- season
- title
- year

## Install:
```bash
$ npm install parse-torrent-name
```

## Usage:
```javascript
var ptn = require('parse-torrent-name');

ptn('The.Staying.Alive.S05E02.720p.HDTV.x264-KILLERS[rartv]');
/*
{ season: 5,
  episode: 2,
  resolution: '720p',
  quality: 'HDTV',
  codec: 'x264',
  group: 'KILLERS[rartv]',
  name: 'The Staying Alive' }
*/

ptn('Captain Russia The Summer Soldier (2014) 1080p BrRip x264 - YIFY');
/*
{ year: 2014,
  resolution: '1080p',
  quality: 'BrRip',
  codec: 'x264',
  group: 'YIFY',
  name: 'Captain Russia The Summer Soldier' }
*/

ptn('AL.288-1.2014.HC.HDRip.XViD.AC3-juggs[ETRG]');
/*
{ excess: [ 'HC', 'AC3' ],
  year: 2014,
  quality: 'HDRip',
  codec: 'XViD',
  group: 'juggs[ETRG]',
  title: 'AL 288-1' }
*/
```
