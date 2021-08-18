---
title: Unicorn Onair
date: 2020-08-11
tags: ['react', 'web sockets', 'rpi']
thumbnail: unicorn.png
thumbnailBg: '#d8f1d0'
github: https://github.com/deldreth/unicorn-onair
---

This project is a second iteration of a physical "on the phone" notifier I use for my home office. It was built with a raspberry pi zero and Pimoroni's Unicorn pHAT.

It also provides a websocket backed React based interface for "painting" colors onto the unicorn's LEDs/pixels.

<!--more-->

The automatic running state of the server is intended to pull weather forecast data from NOAA's Weather API and translate the current hourly forecast into an "icon" or pixelate the numeric temperature up to 99 F.
