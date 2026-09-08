
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const generateHLS = (inputPath, outputDir) => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(outputDir, { recursive: true });
    const playlistPath = path.join(outputDir, "playlist.m3u8");

    ffmpeg(inputPath)
      .output(playlistPath)
      .outputOptions([
        "-c:v libx264",
        "-c:a aac",
        "-f hls",
        "-hls_time 6",
        "-hls_list_size 0",
      ])
      .on("start", command => {
        console.log("FFmpeg started:");
        console.log(command);
      })
      .on("end", () => {
        console.log("HLS generated!");
        resolve(playlistPath);
      })
      .on("error", error => {
        console.error("FFmpeg error:", error);
        reject(error);
      })
      .run();
  });
};