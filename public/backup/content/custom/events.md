---
title: Events
description: Stay up to date on the latest museum events.
layout: design/events.njk
pagination:
  data: collections.events
  size: 6
  reverse: true
testdata:
 - item1
 - item2
 - item3
 - item4
show_ford_store: true
show_partner: true
show_motors: true
permalink: "events/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---

