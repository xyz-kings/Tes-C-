# XYZ Email Verifier

```text
xyz-email-verifier/
├── api/
│   └── index.js
├── main.cpp
├── package.json
├── vercel.json
└── README.md
```

## Vercel

Deploy langsung:

```bash
vercel --prod
```

Tidak perlu `build` dan tidak perlu runtime manual.

Setelah deploy:

```text
GET /
```

Root akan menampilkan 404 bawaan Vercel karena Function berada di `/api`.
Gunakan:

```text
GET /api
```

Contoh send:

```text
/api?action=send&email=user@example.com
```

Contoh verifikasi:

```text
/api?action=verif&email=user@example.com&link=https%3A%2F%2Fexample.com%2Fverify&orderid=XVoid-123
```

## C++ lokal

Termux:

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

C++ langsung menggunakan API:

```text
https://api-am-six.vercel.app
```

## API Key

Default:

```text
XVoid-ashar
```

Untuk Vercel bisa dibuat environment variable:

```bash
vercel env add XVOID_API_KEY
```

lalu isi:

```text
XVoid-ashar
```
