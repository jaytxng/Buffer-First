import React, { useState, useEffect } from 'react';

// interface Initial { initial: object; }

const Monitor = () => {
  const [data, setData] = useState({
    "id": null,
    "totalSessions": null,
    "totalForceBufferedMS": null,
    "totalBufferDurationMS": null,
    "totalSlowConnectionCount": null,
    "totalRestartBufferCount": null,
    "totalVideoDurationMS": null,
    "total2160pBuffers": null,
    "total1440pBuffers": null,
    "total1080pBuffers": null,
    "total720pBuffers": null,
    "total480pBuffers": null,
    "total360pBuffers": null,
    "total240pBuffers": null,
    "total144pBuffers": null,
    "totalSucceed": null,
    "totalFailed": null,
    "createdAt": null,
    "updatedAt": null
  });

  const [date, setDate] = useState({
    datetime: null
  })
  
  let t, d;
  useEffect(() => {
    // Update the document title using the browser API
    fetch('https://replace.me')
    .then((result) => {
      return result.json();
    })
    .then((resultjson) => {
      console.log(resultjson);
      // Split timestamp into [ Y, M, D, h, m, s ]
      t = resultjson.createdAt.split(/[- :TZ]/);
      console.log(t);
      // convert into JS' date format
      d = Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
      setDate({ datetime: d });
      setData(resultjson);
    });
  }, []);

  return (
    <>
      <p>ID: {JSON.stringify(data.id)}</p>
      <p>Total Sessions: {JSON.stringify(data.totalSessions)}</p>
      <p>Total Force Buffered (ms): {JSON.stringify(data.totalForceBufferedMS)}</p>
      <p>Total Buffer Duration (ms): {JSON.stringify(data.totalBufferDurationMS)}</p>
      <p>Total Slow Connection Count: {JSON.stringify(data.totalSlowConnectionCount)}</p>
      <p>Total Restart Buffer Count: {JSON.stringify(data.totalRestartBufferCount)}</p>
      <p>Total Video Duration (ms): {JSON.stringify(data.totalVideoDurationMS)}</p>
      <p>Total videos in 2160p: {JSON.stringify(data.total2160pBuffers)}</p>
      <p>Total videos in 1440p: {JSON.stringify(data.total1440pBuffers)}</p>
      <p>Total videos in 1080p: {JSON.stringify(data.total1080pBuffers)}</p>
      <p>Total videos in 720p: {JSON.stringify(data.total720pBuffers)}</p>
      <p>Total videos in 480p: {JSON.stringify(data.total480pBuffers)}</p>
      <p>Total videos in 360p: {JSON.stringify(data.total360pBuffers)}</p>
      <p>Total videos in 240p: {JSON.stringify(data.total240pBuffers)}</p>
      <p>Total videos in 144p: {JSON.stringify(data.total144pBuffers)}</p>
      <p>Total Succeeded: {JSON.stringify(data.totalSucceed)}</p>
      <p>Total Failed: {JSON.stringify(data.totalFailed)}</p>
      <p>Last updated on {new Date(date.datetime).toString()}</p>
    </>
  );
}

Monitor.displayName = 'Monitor';

export default Monitor;