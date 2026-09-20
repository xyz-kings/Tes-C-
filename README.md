# XYZ Email Verifier

Struktur:

```text
xyz-email-verifier/
├── api/
│   └── index.js
├── main.cpp
├── package.json
├── vercel.json
└── README.md
```

## Lokal - Vercel API

Install Vercel CLI:

```bash
npm install -g vercel
```

Jalankan:

```bash
npm install
vercel dev
```

Endpoint:

```text
http://localhost:3000/api
```

Kirim email:

```text
http://localhost:3000/api?action=send&email=user@example.com
```

Verifikasi:

```text
http://localhost:3000/api?action=verif&email=user@example.com&link=https%3A%2F%2Fexample.com%2Fverify&orderid=XVoid-123
```

## Deploy

```bash
vercel --prod
```

Jika ingin menyimpan API key sebagai environment variable:

```bash
vercel env add XVOID_API_KEY
```

Isi:

```text
XVoid-ashar
```

## C++ lokal

Linux/Termux:

```bash
pkg install clang curl
clang++ main.cpp -o xyz-email-verifier -lcurl
./xyz-email-verifier
```

Ubuntu/Debian:

```bash
sudo apt install g++ libcurl4-openssl-dev
g++ main.cpp -o xyz-email-verifier -lcurl
./xyz-email-verifier
```

C++ lokal langsung menggunakan:

```text
https://api-am-six.vercel.app
```

Flow:

1. Input email
2. Request `/api-send`
3. Input order ID
4. Input link verifikasi
5. Request `/api-verif`
