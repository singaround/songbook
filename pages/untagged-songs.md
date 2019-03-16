---
layout: layouts/songbook.njk
title: Untagged Songbook
navtitle: Untagged Songs
date: 2019-03-02
permalink: /untagged-songs/index.html
templateEngineOverride: njk
---
<h1>{{ title }}</h1>

{{ layoutContent | safe }}

{% set songslist = collections.untaggedSongs %}
{% include "components/songslist.njk" %}
