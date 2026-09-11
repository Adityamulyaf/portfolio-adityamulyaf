# Tool marks

Logos for tools that no icon set publishes — most of the ROS ecosystem has no
standalone brand mark, so these are dropped in by hand.

Put SVG here where possible (crisp at any size, tiny file). PNG with a
transparent background also works.

Wire a file up by adding `image: "/logos/<file>"` to the matching entry in
`src/components/Skills.tsx`.

Expected files:

| file            | tool                        | where to get it                    |
|-----------------|-----------------------------|------------------------------------|
| ardupilot.svg   | ArduPilot (and SITL)        | ardupilot.org press / GitHub org   |
| mavlink.svg     | MAVROS, pymavlink           | mavlink.io                         |
| protobuf.svg    | Protocol Buffers            | protobuf.dev                       |
| tensorrt.svg    | TensorRT, PyCUDA            | NVIDIA brand assets                |
| zbar.svg        | ZBar                        | may not exist — leave as text      |

RViz and rqt are ROS packages and use the ROS mark already in simple-icons, so
they need no file.

"Path Planning" and "Multi-Object Tracking" are techniques rather than products
and have no mark anywhere; they stay as text.
