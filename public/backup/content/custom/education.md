---
title: Education
description: "Education is what we are about"
layout: design/education.njk
pagination:
  data: collections.educations
  size: 6
  reverse: true
testdata:
 - item1
 - item2
 - item3
 - item4
image: /img/Early-Ford-V8-Foundation-Museum-A043.webp
show_ford_store: true
show_partner: true
show_motors: true
permalink: "education/{% if pagination.pageNumber > 0 %}{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---

