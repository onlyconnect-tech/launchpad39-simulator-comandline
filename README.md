# Drone simulator simple

Simulate drone moviments as GOTO commands

## CERTIFICATES

Put Amazon certificate into directory `./certs`

## examples

 * Drone route from Samarate, IT *(coord: 45.6043749 8.7938739)* to Piazza Duomo, Milan, IT *(coord: 45.4642314 9.189875)* - waiting *goto* commands:   
`node ./drone_simulator.js --queue /001/003 --start 45.6043749 8.7938739 --end 45.4642314 9.189875 --groundspeed 110`

* or, only start in Samarate - waiting *goto* commands:   
`node ./drone_simulator.js --queue /001/003 --start 45.6043749 8.7938739 --groundspeed 110`