#!/bin/bash

echo "Deploying to Super Mega Image slicer"
scp -r build/* redunda@redundantrobot.com:/home/redunda/domains/redundantrobot.com/public_html/baseball_images
