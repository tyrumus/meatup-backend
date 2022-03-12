#!/bin/bash

# user.js tests
echo "user.js tests"
curl -X POST -c /tmp/meatup-cookiefile -d "key=12348765abcd&name=Yoooski" "http://localhost:9001/api/user"
curl -X PATCH -b /tmp/meatup-cookiefile -d "name=Yusk" "http://localhost:9001/api/user"
curl -b /tmp/meatup-cookiefile "http://localhost:9001/api/user"

# meatup.js tests
echo "meatup.js tests"
TIME=$(date +%s)
echo "add meatups"
curl -X POST -b /tmp/meatup-cookiefile -d "title=Your Mother&description=is super super gay and putin likes it&datetime_start=${TIME}&datetime_end=${TIME}&latitude=64.412608&longitude=-17.719234" "http://localhost:9001/api/meatup"
curl -X POST -b /tmp/meatup-cookiefile -d "title=Your Father&description=is very straight&datetime_start=${TIME}&datetime_end=${TIME}&latitude=32.41260842069&longitude=-17.6969420" "http://localhost:9001/api/meatup"
echo "list meatups"
curl -X POST -b /tmp/meatup-cookiefile -d "latitude_low=30&latitude_high=34&longitude_low=-18&longitude_high=-14" "http://localhost:9001/api/meatup/list"
curl -X POST -b /tmp/meatup-cookiefile -d "latitude_low=30&latitude_high=65&longitude_low=-18&longitude_high=-14" "http://localhost:9001/api/meatup/list"
curl -b /tmp/meatup-cookiefile "http://localhost:9001/api/meatup/2"
echo "interested test"
curl -X POST -b /tmp/meatup-cookiefile "http://localhost:9001/api/meatup/1/interested"
curl -b /tmp/meatup-cookiefile "http://localhost:9001/api/meatup/1"
curl -X DELETE -b /tmp/meatup-cookiefile "http://localhost:9001/api/meatup/1/interested"
curl -b /tmp/meatup-cookiefile "http://localhost:9001/api/meatup/1"
echo "update meatup"
curl -X PATCH -b /tmp/meatup-cookiefile -d "title=Your just gay&description=no really bruh&datetime_start=${TIME}&datetime_end=${TIME}&latitude=63&longitude=-16" "http://localhost:9001/api/meatup/2"
curl -X POST -b /tmp/meatup-cookiefile -d "latitude_low=30&latitude_high=65&longitude_low=-18&longitude_high=-14" "http://localhost:9001/api/meatup/list"
echo "delete meatup"
curl -X DELETE -b /tmp/meatup-cookiefile "http://localhost:9001/api/meatup/3"
curl -X POST -b /tmp/meatup-cookiefile -d "latitude_low=30&latitude_high=65&longitude_low=-18&longitude_high=-14" "http://localhost:9001/api/meatup/list"
