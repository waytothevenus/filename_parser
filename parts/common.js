'use strict';

var core = require('../core');

/**
 * Pattern should contain either none or two capturing groups.
 * In case of two groups - 1st is raw, 2nd is clean.
 */
var patterns = {
  season: /([Ss]?([0-9]{1,2}))[Eex]/,
  episode: /([Eex]([0-9]{2})(?:[^0-9]|$))/,
  year: /([\[\(]?((?:19[0-9]|20[01])[0-9])[\]\)]?)/,
  resolution: /(([0-9]{3,4}(?:p|i)))[^M]/,
  quality: /hdtv|bluray|(?:b[dr]|dvd|hd|tv)rip|web-?(?:dl|rip)/i,
  codec: /divx|xvid|(?:x|h)[-\. ]?26(?:4|5)|avc|hevc/i,
  audio: /MP3|DD5\.?1|Dual[\- ]Audio|LiNE|DTS|AAC(?:\.?2\.0)?|AC3(?:\.5\.1)?/,
  group: /(- ?([^-]+))$/,
  region: /R[0-9]/,
  extended: /EXTENDED/,
  hardcoded: /HC/,
  proper: /PROPER/,
  repack: /REPACK/,
  container: /MKV|AVI|MP4|mkv|avi|mp4/,
  website: /^(\[ ?([^\]]+?) ?\])/,
  language: /(?:TRUE)?FR(?:ENCH)?|EN(?:G(?:LISH)?)?|VOST(?:FR)?|MULTI(?:Lang|Truefrench|\-VF2)?|SUBFRENCH/gi
};
var types = {
  season: 'integer',
  episode: 'integer',
  year: 'integer',
  extended: 'boolean',
  hardcoded: 'boolean',
  proper: 'boolean',
  repack: 'boolean'
};
var torrent;

core.on('setup', function (data) {

  torrent = data;
});

core.on('start', function() {
  var key, match, index, clean, part;

  for(key in patterns) {
    if(patterns.hasOwnProperty(key)) {
      if(!(match = torrent.name.match(patterns[key]))) {
        continue;
      }

      index = {
        raw:   match[1] ? 1 : 0,
        clean: match[1] ? 2 : 0
      };

      if(types[key] && types[key] === 'boolean') {
        clean = true;
      }
      else {
        clean = match[index.clean];

        if(types[key] && types[key] === 'integer') {
          clean = parseInt(clean, 10);
        }
      }

      if(key === 'group') {
        if(clean.match(patterns.codec) || clean.match(patterns.quality)) {
          continue;
        }


        if(clean.match(/[^ ]+ [^ ]+ .+/)) {
          key = 'episodeName';
        }
        clean = clean.replace(/ *\([^)]*\) */, "");
        clean = clean.replace(/ *\[[^)]*\] */, "");
      }

      if(key === 'language') {

        var i = 0;
        while( match = patterns.language.exec(torrent.name) ) {

          var separator = torrent.name.charAt(match.index-1); // separators are usually - + _ . \s
          if(match.index == 0 || !/[-+_.\s]/.test(separator) || separator !== torrent.name.charAt(match.index + match[0].length)) { // & language usually not in first
            continue;
          }

          part = {
            name: 'language' + (++i),
            match: match,
            raw: match[0],
            clean: match[0].toUpperCase()
          };
          part.name = i == 1 ? 'language' : part.name; // ensure sustainability
          core.emit('part', part);
        }

        continue;
      }

      part = {
        name: key,
        match: match,
        raw: match[index.raw],
        clean: clean
      };

      if(key === 'episode') {
        core.emit('map', torrent.name.replace(part.raw, '{episode}'));
      }

      core.emit('part', part);
    }
  }

  core.emit('common');
});

core.on('late', function (part) {
  if(part.name === 'group') {
    core.emit('part', part);
  }
  else if(part.name === 'episodeName') {
    part.clean = part.clean.replace(/[\._]/g, ' ');
    part.clean = part.clean.replace(/_+$/, '').trim();
    core.emit('part', part);
  }
});
