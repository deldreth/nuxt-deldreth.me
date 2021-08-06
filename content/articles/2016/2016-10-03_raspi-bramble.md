---
title: Cluster computing with a raspberry pi bramble
date: 2016-10-03
tags: ['project', 'rpi', 'cluster computing']
thumbnail: berries.jpg
---

My goal here was to simply create a cluster of raspberry pi 3s (colloquially
referred to as a bramble).

<!--more-->

Why? It seems like a pretty cheap way to build a
test bed for deploying to distributed systems (such as AWS). Overall this
setup cost around $240 but could be made much cheaper by using Raspberry Pi
Zeros and using USB OTG.

## Pretty straight forward equipment list:

![](https://lh3.googleusercontent.com/53Ch0rh3mhOL_vWvQ0sdLF-mxV551iJ1LNNBvDmSvOGfSm0mCIUujNVCAj9Vs-oWULKMXBf0LDGzAPQ6rtdbXGFiWT1RZ8yT3JzKkXK9xnI7B8zZeAC9alD2lDIYuC5tYnFfUDfapnJqXK77aoOR6_Xh47mPJxM-amqSPSBbJh6LwtmK11MiDx90Fsl_8e4w8z9KNpNRVc1U1q7_tKpcjpxliAUzO4LtEkroyh-L38sarccpYvrRMtik8jXFC3d0EJLFCNbQwdKB0-XIo0aPdLqv2yHXdVbbtiZCXQPc_4KH9wmsqcq2fmX4tmbfve80_tcrKYHRWL5BJmJlZJ5yA9mct_Eb2GOnlGuk57DqSi1Z1redJSyeo1J8gIL6qKi3jESeXkuaTzY_Og62Ybkvc8DELGbmscxoyaa4z708ghJX-DTHB_y30vKGHQ3yQc6ojvZjprQ0LoakwZ1JvWnafs3iZfdQm2bXKk68J-vHs24mVjIDRWDMLBU0K9pcYBTvsaob1fM8r54M4HGDahrAsZBdF0UXHtMUN3JLklKyzBNspWAmwZfK5d7a8dApzJTEdXToJkgz=s847-w634-h847-no)

- 4x Raspberry Pi 3
- 5 Port Switch
- 4x 16 GB Micro SD Cards
- 4x USB cables
- 4x Patch Cables
- And one neat stackable case to house them all

The result:

![](https://lh3.googleusercontent.com/GWOY8MkpBVF_rT5vPqFIlmIx402xq-rQebr-VWX21GFYOs_pi-Z2SaXvfngjd5vUtvRbEe2kAJ9k1tX-UPHRa2GzzJon4Oyyj-9B4nHryL6WcajcMTJP-CjqzZ_WDnXYIRicfOD6BMQGi5UArFSPD3JOL2Wm09Dip8UJdv4mKDKHkM794SbCNc52UAhg_En4y4mKebzDrrK7Ldyak_KFhkqsmMn3EwR5TGI6xC6KdXB_nJrOkjZEraq4k0FsdrQ2CJe9W_0dnL9_W3No5u9uFkxj4yQY1TcaBzsojyAFeiSKEyn-9YxiPpZSs8nbyTT3MMSwjMGsiIivaK7UU-jBGBdK2efEqZYmFd6Xj8HfUoIjy3W_SwBGjtKEGMMMe8BPgyufDSFe5stqNEfcQgwgNLPf8_6nupd9-o1hMBpHOaBrtr7dDX7NkJf89lJHL3VA_0tLDOYsHxfxiYKH6ON9dLHz9jDeip1T2wm_YGLspsWGSsNQpyh3EMENaxqyvAG1atNNCA1rGs6i5k2KfcaHBE654CbclvDySog19SbvrpIJNRi0UDhWKEqib_tcdvfqrutmKQvD1BJFE0rLvhFojE2-0JAZ-65zCt5b4cxF9FbRKZ7RlA=w1133-h847-no)

## OS

Initially I went with HypriotOS 1.0.1. Partially because of the awesome work
they've done into getting Docker (specifically 1.12) to run well on this
Raspbian derivitive. My understanding now is that Raspbian has good support
for Docker 1.12 out of the box (with a kernel update).

## First Steps To a Distributed Task Queue

My first goal was to create distributed compute task queue using Celery and
Redis. All running under Docker swarm mode such that I could easily spin up
containers of celery workers in the cloud. You can checkout my armv7
compatible docker image at https://hub.docker.com/r/deldreth/. The
hypriot/redis image works well enough out of the box (for testing purposes).
I will have another article at a later point detailing more information about
the rpi-python-celery image.

The good news is that everything works well enough considering the clock
speeds of the rpi3. Redis is a bit of memory hog (it tends to consume
everything it can--immediately). I've yet to try building an image for a
celery task broker using rabbitmq.

I'll have further updates on this project shortly. Right now I've been playing
around with running Apache Spark on a single master:three slave setup with the
cluster, but I want to continue working on the distributed task queue.

## Further Comments

If this is something that really interests you then I strongly suggest
checking out Docker Captain Alex Ellis' talk for
[Container Camp](https://www.youtube.com/watch?v=-qRUsuevKj4).
