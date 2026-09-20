const API_BASE = "https://api-am-six.vercel.app";
const API_KEY = process.env.XVOID_API_KEY || "XVoid-ashar";

function buildUrl(path, params) {
  const url = new URL(path, API_BASE);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export default async function handler(req, res) {
  try {
    const { action, email, link, orderid } = req.query || {};

    if (!action) {
      return res.status(200).json({
        status: true,
        name: "XYZ Email Verifier",
        version: "1.0.0",
        endpoints: {
          send: "/api?action=send&email=",
          verif: "/api?action=verif&email=&link=&orderid="
        }
      });
    }

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Parameter email wajib diisi"
      });
    }

    let target;

    if (action === "send") {
      target = buildUrl("/api-send", {
        email,
        key: API_KEY
      });
    } else if (action === "verif") {
      if (!link || !orderid) {
        return res.status(400).json({
          status: false,
          message: "Parameter link dan orderid wajib diisi"
        });
      }

      target = buildUrl("/api-verif", {
        email,
        key: API_KEY,
        link,
        orderid
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Action tidak dikenal. Gunakan send atau verif."
      });
    }

    const response = await fetch(target);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        status: response.ok,
        response: text
      };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message
    });
  }
}
