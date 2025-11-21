import FormData from "form-data";
import fetch from "node-fetch";
import { env } from "../config/environment.js";

const GROQ_TRANSCRIBE_URL =
  "https://api.groq.com/openai/v1/audio/transcriptions";

const MAX_DOWNLOAD_BYTES = 40 * 1024 * 1024; // 40MB safety limit

const groqTranscribe = async (buffer, filename, mimetype) => {
  if (!env.groqApiKey || !buffer) return null;

  try {
    const formData = new FormData();
    formData.append("model", "whisper-large-v3");
    formData.append("response_format", "json");
    formData.append("temperature", "0");
    formData.append("file", buffer, {
      filename,
      contentType: mimetype || "application/octet-stream",
      knownLength: buffer.length,
    });

    const response = await fetch(GROQ_TRANSCRIBE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.groqApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.warn("Groq transcription failed:", error);
      return null;
    }

    const data = await response.json();
    return data.text?.trim() || null;
  } catch (error) {
    console.warn("Transcription error", error.message);
    return null;
  }
};

export const transcribeVideoBuffer = async (buffer, filename, mimetype) => {
  return groqTranscribe(buffer, filename, mimetype);
};

export const transcribeVideoUrl = async (url) => {
  if (!env.groqApiKey || !url) return null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(
        "Failed to download video for transcription",
        response.status
      );
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_DOWNLOAD_BYTES) {
      console.warn("Video exceeds download limit for transcription");
      return null;
    }
    const buffer = Buffer.from(arrayBuffer);
    return groqTranscribe(
      buffer,
      "remote-video.mp4",
      response.headers.get("content-type") || "video/mp4"
    );
  } catch (error) {
    console.warn("Transcription download error", error.message);
    return null;
  }
};
