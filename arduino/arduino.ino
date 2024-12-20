#include <WiFi.h>
#include <PubSubClient.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <ArduinoJson.h>
#include <vector>
// Constants
const char* ssid = "ClaroWiFi";
const char* password = "ClaveDificil1$";
const char* mqtt_server = "192.168.100.57";
const int mqtt_port = 1885;

const char* mqttUser = "checkpoint";  // Usuario de Mosquitto
const char* mqttPassword = "checkpoint";  // Contraseña de Mosquitto

WiFiClient espClient;
PubSubClient client(espClient);

BLEScan* pBLEScan;
const int scanTime = 10; // In seconds

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  // Connect to MQTT broker
  client.setServer(mqtt_server, mqtt_port);
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP32Client", mqttUser, mqttPassword)){
      Serial.println("Connected to MQTT");
    } else {
      Serial.print("Failed with state ");
      Serial.print(client.state());
      delay(2000);
    }
  }

  // Initialize BLE
  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); // Create BLE scan object
}

void loop() {
  // Scan for Bluetooth devices

  Serial.println("Scanning for BLE devices...");
  BLEScanResults * foundDevices = pBLEScan->start(scanTime, false);
  std::vector<String> devicesList;
  std::vector<int> devicesRSSIList;
  // Loop through found devices
  for (int i = 0; i < foundDevices->getCount(); i++) {

      BLEAdvertisedDevice device = foundDevices->getDevice(i);
      String deviceString  = String(device.getAddress().toString().c_str());
      int rssiString= device.getRSSI();
      devicesList.push_back(deviceString);
      devicesRSSIList.push_back(rssiString);
    }
  
  pBLEScan->clearResults(); // Clear scan results
  // Publish the list of devices to the MQTT topic
  enviarPaquetes(client,devicesList,devicesRSSIList);

  // Wait 10 seconds before next scan

  delay(1000);
}


void enviarPaquetes(PubSubClient& client,const std::vector<String>& devicesList,const std::vector<int>& devicesRSSIList){
  int totalDevices = devicesList.size();
  int batchSize = 3; // Send in batches of 10 devices
  int numBatches = (totalDevices + batchSize - 1) / batchSize;
  int iDevices=0;

  for (int i=0; i<numBatches; i++){ //Ciclo para cada paquete
    StaticJsonDocument<512> doc;
    String jsonString;

    doc["packageNum"]=i+1;
    doc["totalPackages"]=numBatches;
    doc["checkpointID"]=WiFi.macAddress();

    JsonArray devices = doc["animals"].to<JsonArray>();
    while (iDevices<batchSize*(i+1) && iDevices<totalDevices){ //Pone los dispositivos en el JSON
      JsonObject deviceObj = devices.createNestedObject();
      deviceObj["id"]=devicesList[iDevices];
      deviceObj["rssi"]=devicesRSSIList[iDevices];
      //devices.add(deviceObj);
      iDevices++;
    }
    
    serializeJson(doc, jsonString);

    if (client.connected()) {
      client.publish("checkpoint", jsonString.c_str());
      Serial.println("Published to MQTT:");
      for(int iAux=0;iAux<devicesList.size();iAux++)
        Serial.println(devicesList[iAux]);
    } else {
      Serial.println("MQTT connection lost. Attempting to reconnect...");
       if (client.connect("ESP32Client", mqttUser, mqttPassword)){
        Serial.println("Reconnected to MQTT");
     }
  }

  }
  return;
}
