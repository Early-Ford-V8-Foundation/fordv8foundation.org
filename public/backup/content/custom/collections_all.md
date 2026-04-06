---
title: All Collections Gallery
description: Sneak Peek at Our Collections
layout: design/gallery.njk
pagination:
  data: collections.galleries
  size: 50
  reverse: true
testdata:
 - item1
 - item2
 - item3
 - item4
 - item5
 - item6
show_event_article: false
show_ford_store: false
show_partner: false
show_nearby: false
permalink: "collections/all/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---

