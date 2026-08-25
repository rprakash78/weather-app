export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cityInput =
    typeof req.body?.cityInput === "string" ? req.body.cityInput.trim() : "";

  if (!cityInput || cityInput.length > 100) {
    return res.status(400).json({ message: "Invalid city name" });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "Weather API key is not configured" });
  }

  const weatherUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  weatherUrl.searchParams.set("q", cityInput);
  weatherUrl.searchParams.set("units", "metric");
  weatherUrl.searchParams.set("appid", apiKey);

  const getWeatherData = await fetch(weatherUrl);
  const data = await getWeatherData.json();
  return res.status(getWeatherData.ok ? 200 : getWeatherData.status).json(data);
}
