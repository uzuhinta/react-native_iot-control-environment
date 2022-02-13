#include "FirebaseESP8266.h"
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <DHT.h>

//WIFI
//#define WIFI_SSID "NarutoHintna"
//#define WIFI_PWD "19721965"
#define WIFI_SSID "NarutoHintna"
#define WIFI_PWD "19721965"

//Firebase
#define FIREBASE_HOST "https://esp8266-1708.firebaseio.com/"
#define FIREBASE_AUTH "mBzlM30qRFfEEQiOWKcV47o7zSHRCt6fIIhwvjyJ"

//DHT + LDR
#define DHTPIN D5
#define LEDPIN D6
#define PUMPPIN D7
#define LEDPINERROR D8
#define DHTTYPE DHT11
#define PHOTOPIN A0

//API time
const char* host = "worldtimeapi.org";
String date;
int hour;
int minute;
int second;
int timePoint;

//Store string json from server
String line = "";
String TOPIC = "/agriculture_hust_2021_control_topic_5b211e19-d4b3-4fa7-b096-e134796756ae";

//Initialization: temperturate, humidity, light rate
float t = 0;
float h = 0;
int l = 0;
int statusLed = 0;
int statusPump = 0;
int countError = -1;
int isError = 0;
int period = 10;
unsigned long prevSecond = 0;
int mode = 0; // 1: auto
int day = 1;

//

//Define Firebase Data Object
FirebaseData firebaseData;
FirebaseData firebaseControlLed;
FirebaseData firebaseControlPump;
FirebaseData firebaseControlMode;
FirebaseData firebaseControlPeriod;

String path;

DHT dht(DHTPIN, DHTTYPE);

//Update state of device and period after change.
void updateStatePeriLedPump() {
  if (Firebase.set(firebaseData, TOPIC + "/response-device1" , statusLed)) {
    Serial.println("SUCCESS IN UPDATE STATUS DEVICE TO FIREBASE");
    Serial.println("------------------------------------");
    Serial.println();
  }

  if (Firebase.set(firebaseData, TOPIC + "/response-device2" , statusPump)) {
    Serial.println("SUCCESS IN UPDATE STATUS DEVICE TO FIREBASE");
    Serial.println("------------------------------------");
    Serial.println();
  }

  //  if (Firebase.set(firebaseData, TOPIC + "/control-device1" , statusLed)) {
  //    Serial.println("SUCCESS IN UPDATE STATUS DEVICE TO FIREBASE");
  //    Serial.println("------------------------------------");
  //    Serial.println();
  //  }
  //
  //  if (Firebase.set(firebaseData, TOPIC + "/control-device2" , statusPump)) {
  //    Serial.println("SUCCESS IN UPDATE STATUS DEVICE TO FIREBASE");
  //    Serial.println("------------------------------------");
  //    Serial.println();
  //  }

  if (Firebase.set(firebaseData, TOPIC + "/response-period" , period)) {
    Serial.println("SUCCESS IN UPDATE PERIOD TO FIREBASE");
    Serial.println("------------------------------------");
    Serial.println();
  }

  if (Firebase.set(firebaseData, TOPIC + "/response-mode" , mode)) {
    Serial.println("SUCCESS IN UPDATE MODE TO FIREBASE");
    Serial.println("------------------------------------");
    Serial.println();
  }
}

//Change count error
void updateStateError() {
  //  countError++;
  if (Firebase.set(firebaseData, TOPIC + "/response-error" , isError)) {
    Serial.println("SUCCESS IN UPDATE COUNT ERROR TO FIREBASE");
    Serial.println("------------------------------------");
    Serial.println();
  }
}

//Get time and set path of environment information.
void getTimeAndSetPath() {
  day += 1;
  WiFiClient client;
  Serial.printf("\n[Connecting to %s ... ", host);
  if (client.connect(host, 80))
  {
    Serial.println("connected]");

    Serial.println("[Sending a request]");
    client.print(String("GET /api/timezone/Asia/Ho_Chi_Minh") + " HTTP/1.1\r\n" +
                 "Host: " + host + "\r\n" +
                 "Connection: close\r\n" +
                 "\r\n"
                );

    Serial.println("[Response:]");
    while (client.connected() || client.available())
    {
      if (client.available())
      {
        line = client.readStringUntil('\n');
        Serial.println(line);
      }
    }
    client.stop();
    Serial.println("\n[Disconnected]");
  }
  else
  {
    Serial.println("connection failed!]");
    isError = 1;
    updateStateError();
    client.stop();
  }

  const int capacity = JSON_OBJECT_SIZE(15) + 600;
  DynamicJsonDocument doc(capacity);

  deserializeJson(doc, line);
  serializeJsonPretty(doc, Serial);

  String times = doc["datetime"];

  Serial.println("Time is : ----------");
  Serial.println(times);

  date = times.substring(0, 10);
  hour = times.substring(11, 13).toInt();
  minute = times.substring(14, 16).toInt();
  second = times.substring(17, 19).toInt();

  timePoint = hour * 3600 + minute * 60 + second;
  Serial.println("=====AFTER CONVERT========");
  Serial.println(date);
  Serial.printf("hour = %d\n", hour);
  Serial.printf("minute = %d\n", minute);
  Serial.printf("second = %d\n", second);

  //Set path to set data to firebase
  //path = WiFi.macAddress() + "/" + times.substring(0, 10);
  path = TOPIC + "/data/" + date;
}

void controlPeriod(StreamData data) {
  period = data.intData();
  getTimeAndSetPath();

  Serial.println("Stream control period available...");
  Serial.println("STREAM PATH: " + data.streamPath());
  Serial.println("Return value is ");
  Serial.print(period);

  updateStatePeriLedPump();
}

void controlMode(StreamData data) {
  mode = data.intData();
  getTimeAndSetPath();

  Serial.println("Stream control period available...");
  Serial.println("STREAM PATH: " + data.streamPath());
  Serial.println("Return value is ");
  Serial.print(mode);

  updateStatePeriLedPump();
}

void controlLed(StreamData data)
{
  int led = data.intData();
  mode = 0;
  Serial.println("Stream control led available...");
  Serial.println("STREAM PATH: " + data.streamPath());
  Serial.println("Return value is ");
  Serial.print(led);
  if (led == 0)
  {
    digitalWrite(LEDPIN, LOW);
    statusLed = 0;
  }
  else
  {
    digitalWrite(LEDPIN, HIGH);
    statusLed = 1;
  }

  updateStatePeriLedPump();
}

void controlPump(StreamData data)
{
  int pump = data.intData();
  mode = 0;
  Serial.println("Stream control pump available...");
  Serial.println("STREAM PATH: " + data.streamPath());
  Serial.println("Return value is ");
  Serial.print(pump);
  if (pump == 0)
  {
    digitalWrite(PUMPPIN, LOW);
    statusPump = 0;
  }
  else
  {
    digitalWrite(PUMPPIN, HIGH);
    statusPump = 1;
  }

  updateStatePeriLedPump();
}

void streamTimeoutCallback(bool timeout)
{
  if (timeout)
  {
    Serial.println();
    Serial.println("Stream timeout, resume streaming...");
    Serial.println();
  }
}



void setup() {
  //Setup serial
  Serial.begin(9600);

  //Setup Wifi
  WiFi.begin(WIFI_SSID, WIFI_PWD);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected to WiFi:");
  Serial.print(WiFi.localIP());
  Serial.println();

  //Setup pin
  pinMode(LEDPIN, OUTPUT);
  pinMode(PUMPPIN, OUTPUT);
  pinMode(PHOTOPIN, INPUT);
  pinMode(LEDPINERROR, OUTPUT);

  //Setup dht
  dht.begin();



  //Setup firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);

  if (!Firebase.beginStream(firebaseData, "/"))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream connection...");
    Serial.println("REASON: " + firebaseData.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }

  if (!Firebase.beginStream(firebaseControlLed, TOPIC + "/control-device1"))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream callback connection for control device 1...");
    Serial.println("REASON: " + firebaseControlLed.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }

  if (!Firebase.beginStream(firebaseControlPump, TOPIC + "/control-device2"))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream callback connection for control device 2...");
    Serial.println("REASON: " + firebaseControlPump.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }

  if (!Firebase.beginStream(firebaseControlPeriod, TOPIC + "/control-period"))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream callback connection for control PERIOD...");
    Serial.println("REASON: " + firebaseControlPeriod.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }

  if (!Firebase.beginStream(firebaseControlMode, TOPIC + "/control-mode"))
  {
    Serial.println("------------------------------------");
    Serial.println("Can't begin stream callback connection for control MODE...");
    Serial.println("REASON: " + firebaseControlMode.errorReason());
    Serial.println("------------------------------------");
    Serial.println();
  }

  //Set callback
  Firebase.setStreamCallback(firebaseControlLed, controlLed, streamTimeoutCallback);
  Firebase.setStreamCallback(firebaseControlPump, controlPump, streamTimeoutCallback);
  Firebase.setStreamCallback(firebaseControlPeriod, controlPeriod, streamTimeoutCallback);
  Firebase.setStreamCallback(firebaseControlMode, controlMode, streamTimeoutCallback);

  //Get time API
  getTimeAndSetPath();

  updateStateError();

  Serial.println("------------------------------------");
  Serial.println("START");


}

void loop() {

  if (day >= 22) return;

  if (isError == 0) {
    digitalWrite(LEDPINERROR, LOW);
  }
  if (isError == 1) {
    digitalWrite(LEDPINERROR, HIGH);
  }
  if (timePoint >= 86400) {
    getTimeAndSetPath();
  }

  if ((millis() / 1000 - prevSecond) > period) {
    prevSecond = millis() / 1000;
    t = dht.readTemperature(false);
    h = dht.readHumidity();
    l = analogRead(PHOTOPIN);

    if (isnan(t) || isnan(h) || isnan(l)) {
      Serial.println("Read dht is ERROR");
      isError = 1;
      updateStateError();
      return;
    }

    if (mode == 1) {
      if (day <= 7) {
        if (t < 37.8) {
          statusLed = 1;
          digitalWrite(LEDPIN, HIGH);
        }
        if (t > 38.2) {
          statusLed = 0;
          digitalWrite(LEDPIN, LOW);
        }
      }
      if (day <= 18 ) {
        if (t < 37.6) {
          statusLed = 1;
          digitalWrite(LEDPIN, HIGH);
        }
        if (t > 38) {
          statusLed = 0;
          digitalWrite(LEDPIN, LOW);
        }
      }
      if (day <= 21 ) {
        if (t < 37.2) {
          statusLed = 1;
          digitalWrite(LEDPIN, HIGH);
        }
        if (t > 37.6) {
          statusLed = 0;
          digitalWrite(LEDPIN, LOW);
        }
      }
      if (Firebase.set(firebaseData, TOPIC + "/response-device1" , statusLed)) {
        Serial.println("SUCCESS IN UPDATE STATUS DEVICE TO FIREBASE");
        Serial.println("------------------------------------");
        Serial.println();
      }
    }

    //    Serial.println("------------------------------------");
    //    Serial.print("Temperature: ");
    //    Serial.printf("%.2f Celcius", t);
    //    Serial.println();
    //
    //    Serial.print("Humidity: ");
    //    Serial.printf("%.2f Percent", h);
    //    Serial.println();
    //
    //    Serial.print("Light rate: ");
    //    Serial.printf("%d", l);
    //    Serial.println();

    FirebaseJson jsonAuthe;


    FirebaseJson jsonInfo;
    String pathTime = (String) timePoint;
    jsonInfo.add("temp", (float)t);
    jsonInfo.add("humi", h);
    jsonInfo.add("light", l);
    jsonInfo.add("led", statusLed);

    if (Firebase.set(firebaseData, path + "/" + pathTime , jsonInfo)) {
      //      Serial.println("SUCCESS IN SET TO FIREBASE");
      //      Serial.print(path + pathTime);
      //      Serial.println("------------------------------------");
      //      Serial.println();
      isError = 0;
      updateStateError();
    }
    else {
      //      Serial.println("FALSE IN SET TO FIREBASE");
      //      Serial.println("RESON:" + firebaseData.errorReason());
      //      Serial.println("------------------------------------");
      isError = 1;
      updateStateError();
      //      Serial.println();
    }
    timePoint += period;
  }
}
