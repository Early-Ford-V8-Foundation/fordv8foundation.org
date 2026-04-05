---
title: News Update
description: Updates Early Ford V-8 Foundation Museum
layout: design/news.njk
pagination:
  data: collections.news
  size: 8
  reverse: true
testdata:
 - item1
 - item2
 - item3
 - item4
show_ford_store: true
show_partner: true
show_motors: true
permalink: "news/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---

