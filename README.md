# XYZ Email Verifier

Vercel-ready project with a static web page and a serverless API.

## Structure

```text
Tes-C--main/
├── api/
│   └── index.js
├── index.html
├── main.cpp
├── package.json
├── vercel.json
└── README.md
```

## Deploy Vercel

From this folder:

```bash
npm install
vercel login
vercel --prod
```

When Vercel asks whether to link an existing project, use a new project if the old project/deployment is the source of `DEPLOYMENT_NOT_FOUND`.

Optional environment variable:

```text
XVOID_API_KEY= MINTA SAMA DEVELOPER NYA YAKK 
```

## Endpoints

```text
GET /
GET /api
GET /api?action=send&email=EMAIL
GET /api?action=verif&email=EMAIL&link=LINK&orderid=ORDER_ID
```

The serverless function proxies requests to `https://api-am-six.vercel.app`.
