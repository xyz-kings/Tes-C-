# XYZ Email Verifier

```text
xyz-email-verifier/
├── api/
│   └── index.js
├── index.html
├── main.cpp
├── package.json
├── vercel.json
└── README.md
```

## Web

Root domain langsung menampilkan form:

- Email
- Link Verifikasi
- Order ID
- Send Email
- Verify Link

Web memanggil `/api` milik project Vercel, kemudian `/api` meneruskan request ke:

`https://api-am-six.vercel.app/`

## Deploy

```bash
vercel --prod
```

Tidak perlu build command khusus.

## C++ lokal

Termux:

```bash
pkg install clang curl
clang++ main.cpp -o xyz-email-verifier -lcurl
./xyz-email-verifier
```
