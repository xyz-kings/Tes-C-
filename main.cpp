#include <iostream>
#include <string>
#include <curl/curl.h>
using namespace std;

const string API_BASE = "https://api-am-six.vercel.app";
const string API_KEY = "XVoid-ashar";

size_t writeCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

string encode(CURL* curl, const string& value) {
    char* p = curl_easy_escape(curl, value.c_str(), (int)value.size());
    if (!p) return "";
    string result(p);
    curl_free(p);
    return result;
}

string getRequest(const string& url) {
    CURL* curl = curl_easy_init();
    if (!curl) return R"({"status":false,"message":"CURL initialization failed"})";

    string response;
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, writeCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 60L);

    CURLcode result = curl_easy_perform(curl);
    if (result != CURLE_OK)
        response = string(R"({"status":false,"message":")") +
                   curl_easy_strerror(result) + "\"}";

    curl_easy_cleanup(curl);
    return response;
}

int main() {
    curl_global_init(CURL_GLOBAL_DEFAULT);

    string email, link, orderid;

    cout << "========================================\n";
    cout << "        XYZ EMAIL VERIFIER\n";
    cout << "========================================\n\n";

    cout << "Email : ";
    getline(cin, email);

    if (email.empty()) {
        cout << "Email tidak boleh kosong.\n";
        curl_global_cleanup();
        return 1;
    }

    CURL* curl = curl_easy_init();
    if (!curl) {
        cout << "Gagal initialize CURL.\n";
        curl_global_cleanup();
        return 1;
    }

    string sendUrl = API_BASE + "/api-send?email=" +
                     encode(curl, email) + "&key=" +
                     encode(curl, API_KEY);
    curl_easy_cleanup(curl);

    cout << "\n[+] Mengirim email...\n";
    cout << getRequest(sendUrl) << "\n";

    cout << "\nOrder ID : ";
    getline(cin, orderid);

    cout << "\nLink verifikasi : ";
    getline(cin, link);

    if (orderid.empty() || link.empty()) {
        cout << "Order ID dan link verifikasi wajib diisi.\n";
        curl_global_cleanup();
        return 1;
    }

    curl = curl_easy_init();
    if (!curl) {
        cout << "Gagal initialize CURL.\n";
        curl_global_cleanup();
        return 1;
    }

    string verifUrl = API_BASE + "/api-verif?email=" +
                      encode(curl, email) + "&key=" +
                      encode(curl, API_KEY) + "&link=" +
                      encode(curl, link) + "&orderid=" +
                      encode(curl, orderid);
    curl_easy_cleanup(curl);

    cout << "\n[+] Memverifikasi link...\n";
    cout << getRequest(verifUrl) << "\n";

    curl_global_cleanup();
    return 0;
}
