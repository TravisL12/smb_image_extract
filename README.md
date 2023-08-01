Download all the results from : https://drive.google.com/drive/u/0/folders/1RtlftwSAvzLRdTmpspko-ejrwEhGO6Rl

And the team photos I used are from: https://drive.google.com/drive/folders/12hVarUZZ0vGPNSmyXAUcjealuxE4EK4S?usp=sharing

Place all team photos in a `./teams` folder to pull from. It is required that a proper team photo have the first player (top-left) selected.

Make sure a `./updated` directory als exists for the final images.

The coordinates in the code are based on 4k image resolution images (3840 × 2160 pixels) of the teams.

Run `yarn install`, and then then run `yarn start` from command line to and visit `localhost:8080`

rename files from list:
`paste -d' ' <(ls *.png) ../teamslist.txt | xargs -n2 mv`
