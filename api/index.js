const API_BASE = "https://api-am-six.vercel.app";
const API_KEY = process.env.XVOID_API_KEY || "XVoid-ashar";

function json(res, status, data) {
  res.status(status).setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(data, null, 2));
}

function apiUrl(path, params) {
  const url = new URL(path, API_BASE);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export default async function handler(req, res) {
  try {
    const query = req.query || {};

    // GET /api
    if (!query.action) {
      return json(res, 200, {
        status: true,
        message: "XYZ Email Verifier API is running",
        version: "1.0.1",
        endpoints: {
          send: "/api?action=send&email=",
          verif: "/api?action=verif&email=&link=&orderid="
        }
      });
    }

    const { action, email, link, orderid } = query;

    if (!email) {
      return json(res, 400, {
        status: false,
        message: "Parameter email wajib diisi"
      });
    }

    let target;

    if (action === "send") {
      target = apiUrl("/api-send", {
        email,
        key: API_KEY
      });
    } else if (action === "verif") {
      if (!link) {
        return json(res, 400, {
          status: false,
          message: "Parameter link wajib diisi"
        });
      }

      if (!orderid) {
        return json(res, 400, {
          status: false,
          message: "Parameter orderid wajib diisi"
        });
      }

      target = apiUrl("/api-verif", {
        email,
        key: API_KEY,
        link,
        orderid
      });
    } else {
      return json(res, 400, {
        status: false,
        message: "Action tidak dikenal",
        available: ["send", "verif"]
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

    return json(res, response.status, data);

  } catch (error) {
    return json(res, 500, {
      status: false,
      message: "Internal server error",
      error: error.message
    });
  }
}
