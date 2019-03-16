---
layout: layouts/songbook.njk
title: Unfiltered Songbook
navtitle: Unfiltered Songs
date: 2019-03-02
permalink: /unfiltered-songs/index.html
templateEngineOverride: njk
---
<h1>{{ title }}</h1>

{{ layoutContent | safe }}

{% set songslist = collections.song %}
{% include "components/songslist.njk" %}
