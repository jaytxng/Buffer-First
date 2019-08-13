# Buffer First
🧩[Chrome extension](https://chrome.google.com/webstore/detail/buffer-first/nfmmfalangpoddnbmpggkogocecengab?hl=en) that lets viewers have an uninterrupted viewing experience in slow connection environments.

## Tech Stack
This project is built with Typescript, PostgreSQL, React (including React Hooks), Node.JS, Fastify, and Redis. Deployed on AWS using a job queue system architecture. 

Note: this repo is the barebone codebase during the early phase of this project and serves to document the development journey - primary codebase is under development in a private repo.

## Existing workarounds

At a place with an inferior or unstable connection, YouTube's video player will autothrottle the video quality level down to reduce bandwidth to continue streaming the video (see [Dynamic Adaptive Streaming over HTTP](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP)). However, this presents a compromised experience as viewers are unwillingly switched to non-HD quality. If viewers force selects one of the HD quality levels, they are interrupted every few seconds due to the lack of sufficient bandwidth.

As of this writing, existing solutions work around this issue by switching to non-Chrome browsers, downloading the videos onto their computer, using another video player app like VLC, or installing Chrome extensions that haven't been updated in years.

## The start of a solution
The initial solution was a simple JS script that jumps the video player's seeker (the current spot in the progress bar, sometimes also called scrubber) ahead when it detects buffering has stopped. This forced YouTube API to respond with additional stream data to buffer more of the video. When the entire video has been buffered, the seeker will jump back to its original time in the video.

However, there were some downsides. From a user experience perspective, it was inconvenient to copy, paste, and run the script into the browser's console each time they wanted to buffer a video. From a technical perspective, if a video duration is longer than a certain time for a video quality level, the buffered segment will be dumped and the viewer has to re-buffer again.

## Two is better than one
Solving the first problem is straightforward - Chrome extensions allow users to trigger a programmatically injected script, enabling a one-click experience. Check.

For the buffer dump issue, further research was necessary. I went through many popular and trending videos on YouTube with different video quality selections and varying video duration to track how many seconds a video can buffer before its buffer is dumped. It was immediately apparent that while there is some effect tied to video quality and video duration, it's not consistent across multiple videos of the same combination. It makes sense, as two different videos with the same video resolution and same duration would not have the same data size.

The answer came in the form of a property on the [HTMLVideoElement](https://wiki.whatwg.org/wiki/Video_Metrics) that has been implemented by Webkit: webkitVideoDecodedByteCount. This metric gives a good proxy of the bitrate of the segment we're buffering. Plotting the decoded bitrate against the most number of seconds we can buffer before causing the buffer dump looks like this: ![](https://cl.ly/03c10b3d6aa0/Image%202019-08-10%20at%203.23.53%20PM.png)

There's a clear logarithmic relationship between the buffering bitrate and buffer dump. Performing a regression analysis based on our dataset yields a logarithmic model with a correlation coefficient of -0.9164. While it's a decent starting point, implementing the logarithmic formula showed issues with buffer dumping on both long tails of the bitrate chart. To make it more reliable, I took the inflection point near the midpoint of both tails (at 150kbps), split the dataset into two with one including bitrates under 150kbps the other above 150kbps, then built two logarithmic models according to their respective datasets.

The two formulas provided even better correlation coefficients: -0.9810 (for <150kbps) and -0.9708 (for >150kbps). With the implementation of these two formulas, the extension results have been able to hold at a 100% success rate, or read differently, 0% buffer dump. More improvements can be made in the future which I'll touch upon later. Finally, for now, check.

## Job Queue System Architecture

At the end of each buffer, a data log of the buffer session information is sent from the viewer's web browser client over to web servers and stored in a PostgreSQL database. An admin dashboard would display a dashboard of aggregated metrics as seen here:
![](https://cl.ly/7e8725dfcfd6/Monitoring%20Page.png)

The stereotypical [three-tier architecture](https://cl.ly/94243f5065b2/Image%202019-08-12%20at%209.00.29%20PM.png) of clients, web server, and database is simple and works pretty well. However, it placed a strain on web servers to execute the storage task to complete the request. During periods of high usage, some requests would conclude as errors and it'll fail to log the data entirely.

A Redis job queue was implemented to decouple and defer the data storage work from web requests. Some advantages of such a setup include higher error-free RPS (requests per second) and the freedom to scale web servers that produce jobs independently from job workers that consume the tasks. This is particularly beneficial from a cost perspective as we can scale job workers to dequeue jobs accordingly to the number of jobs enqueued and maintain a healthy equilibrium to make sure jobs don't stay in the queue for long and protect the infrastructure from the exhaustion of Redis memory.

As of this writing, a single T2.micro web server in such a setup handles 2500 RPS at peak while a single T2.nano job worker can dequeue 700 jobs per second.

## Where to next...
One low hanging fruit would be to expand the extension capabilities to other video platforms. Multiple requests from happy viewers have given great candidates to the rollout list.

While the two logarithmic formulas used to determine how many seconds to buffer for any particular video proves itself to be reliable, it does leave questions about futureproofing this extension. New compression algorithms may affect the decoding bitrate used as inputs or increased caching capabilities for video buffers may provide buffer duration. On this end, I'll be evaluating neural networks to absorb additional video data and explore factors that may not have been considered before.
