import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const generateHLS = (inputPath, outputDir) => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(outputDir, { recursive: true });

    const qualities = [
      { name: "360p", height: 360, bitrate: "800k", bandwidth: 900000 },
      { name: "720p", height: 720, bitrate: "2500k", bandwidth: 2800000 },
      { name: "1080p", height: 1080, bitrate: "5000k", bandwidth: 5500000 },
    ];
      const commands = qualities.map((quality) => {
      const qualityDir = path.join(outputDir, quality.name);

      fs.mkdirSync(qualityDir, { recursive: true });

      const playlistPath = path.join(qualityDir, "playlist.m3u8");
       return new Promise((resolveQuality, rejectQuality) => {
        ffmpeg(inputPath)
          .videoFilters(`scale=-2:${quality.height}`)
          .output(playlistPath)
          .outputOptions([
            "-c:v libx264",
            `-b:v ${quality.bitrate}`,
            "-c:a aac",
            "-b:a 128k",
            "-f hls",
            "-hls_time 6",
            "-hls_list_size 0",
            "-hls_playlist_type vod",
          ])
          .on("start", (command) => {
            console.log(`${quality.name} FFmpeg started:`);
            console.log(command);
          })
          .on("end", () => {
            console.log(`${quality.name} generated!`);
            resolveQuality();
          })
          .on("error", (error) => {
            console.error(`${quality.name} FFmpeg error:`, error);
            rejectQuality(error);
          })
          .run();
      });
    });

    Promise.all(commands)
      .then(() => {
      
        const masterPlaylistPath = path.join(outputDir, "master.m3u8");

        let masterPlaylist = "#EXTM3U\n\n";

        qualities.forEach((quality) => {
          masterPlaylist +=
            `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bandwidth},RESOLUTION=${quality.height === 360 ? "640x360" : quality.height === 720 ? "1280x720" : "1920x1080"}\n` +
            `${quality.name}/playlist.m3u8\n\n`;
        });

        fs.writeFileSync(masterPlaylistPath, masterPlaylist);

        console.log("Master playlist generated!");

        resolve(masterPlaylistPath);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
