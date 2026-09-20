const API_BASE = "https://api-am-six.vercel.app";

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(data, null, 2));
}

function getQuery(req) {
  if (req.query && typeof req.query === "object") return req.query;

  const url = new URL(req.url || "/", "http://localhost");
  return Object.fromEntries(url.searchParams.entries());
}

function buildUrl(path, params) {
  const url = new URL(path, API_BASE);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return sendJson(res, 405, {
        status: false,
        message: "Method Not Allowed",
        allowed: ["GET"]
      });
    }

    const query = getQuery(req);
    const action = String(query.action || "").trim().toLowerCase();

    if (!action) {
      return sendJson(res, 200, {
        status: true,
        message: "XYZ Email Verifier API is running",
        version: "1.1.1",
        endpoints: {
          send: "/api?action=send&email=EMAIL",
          verif: "/api?action=verif&email=EMAIL&link=LINK",
          verif_with_orderid: "/api?action=verif&email=EMAIL&link=LINK&orderid=ORDER_ID"
        },
        parameters: {
          email: "Wajib",
          link: "Wajib untuk action verif",
          orderid: "Opsional untuk action verif"
        }
      });
    }

    const email = String(query.email || "").trim();
    const link = String(query.link || "").trim();
    const orderid = String(query.orderid || "").trim();
    const apiKey = process.env.XVOID_API_KEY || "XVoid-ashar";

    if (!email) {
      return sendJson(res, 400, {
        status: false,
        message: "Parameter email wajib diisi"
      });
    }

    let target;

    if (action === "send") {
      target = buildUrl("/api-send", {
        email,
        key: apiKey
      });

    } else if (action === "verif") {
      if (!link) {
        return sendJson(res, 400, {
          status: false,
          message: "Parameter link wajib diisi"
        });
      }
      target = buildUrl("/api-verif", {
        email,
        key: apiKey,
        link,
        orderid
      });

    } else {
      return sendJson(res, 400, {
        status: false,
        message: "Action tidak dikenal",
        available: ["send", "verif"]
      });
    }
    const upstream = await fetch(target, {
      method: "GET",
      headers: {
        "User-Agent": "XYZ-Email-Verifier/1.1.1"
      }
    });

    const text = await upstream.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        status: upstream.ok,
        response: text
      };
    }

    return sendJson(res, upstream.status, data);

  } catch (error) {
    console.error("XYZ API ERROR:", error);

    return sendJson(res, 500, {
      status: false,
      message: "Internal server error",
      error: error instanceof Error
        ? error.message
        : String(error)
    });
  }
}
