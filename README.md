<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=180&section=header&text=RescueVault%20ML%20Engine&fontSize=40&fontColor=ffffff&fontAlignY=38&desc=Disaster%20Resource%20Demand%20Forecaster%20%7C%20Part%20of%20N_MAPS&descSize=16&descAlignY=58&animation=fadeIn" width="100%"/>

<br/>

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Node.js](https://img.shields.io/badge/Node.js-Bridge-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)

<br/>

> 🛡️ **This is the ML Intelligence Layer of [RescueVault / N_MAPS](https://github.com/aadilalisaiyed/N_MAPS)**  
> A disaster response system that operates in zero-connectivity environments using offline ML, hardware encryption, and GPS geotagging.

</div>

---

## 🧠 What This Does

In a disaster zone, incoming SOS reports contain unstructured text like:

> *"Whole family stuck on roof."* · *"Child has high fever."* · *"No food left since yesterday."*

This ML engine reads those reports, extracts features from the situation text, and **predicts what resources each city needs** — police/rescue units, medical teams, or food supply — aggregated by location for the command center.

```
SOS Reports (JSON)
       ↓
 Feature Extraction (keyword NLP)
       ↓
 3x Logistic Regression Models
  ├── Police / Rescue needed?
  ├── Medical team needed?
  └── Food supply needed?
       ↓
 City-wise Resource Summary
       ↓
 RescueVault Command Dashboard
```

---

## 🏗️ Architecture

```
RescueVault-ML/
│
├── ml_server/                  # 🐍 Python FastAPI ML Service
│   ├── main.py                 # FastAPI app + /predict endpoint
│   ├── model.py                # Model training (3x LogReg pipelines)
│   ├── utils.py                # Feature extraction from SOS text
│   ├── requirements.txt        # Python dependencies
│   └── data/
│       ├── data1.json          # Training + inference dataset (Gujarat cities)
│       └── data2.json          # Extended dataset
│
└── backend/                    # 🟢 Node.js Express Bridge
    ├── server.js               # Express server (port 3000)
    ├── package.json
    └── routes/
        └── predict.js          # Reads data.json → calls ML → returns summary
```

---

## 🤖 ML Model Details

### Problem Statement
Multi-label classification: given an SOS report, predict which emergency resource categories are required.

### Features Used
Extracted from free-text `situation` field via keyword matching:

| Feature | Description |
|---|---|
| `count` | Number of people in the report |
| `kw_trapped` | Keywords: trapped, stuck, flood, water |
| `kw_injury` | Keywords: injur, bleed, fever, pain, asthma |
| `kw_hungry` | Keywords: food, hungry, no food, water shortage |
| `kw_safe` | Keywords: safe, okay, fine |

### Models
Three independent binary classifiers, one per resource type:

| Model | Target | Algorithm |
|---|---|---|
| `Police_Label` | Rescue/Police needed | Logistic Regression (Pipeline + StandardScaler) |
| `Health_Label` | Medical team needed | Logistic Regression (Pipeline + StandardScaler) |
| `Food_Label` | Food supply needed | Logistic Regression (Pipeline + StandardScaler) |

**Decision threshold:** `0.6` (probability ≥ 0.6 → resource flagged as needed)

### Output
City-wise aggregated resource demand:

```json
[
  {
    "city": "Ahmedabad",
    "Police_Need": 3,
    "Health_Need": 2,
    "Food_Need": 2,
    "Total_People": 18
  },
  {
    "city": "Gandhinagar",
    "Police_Need": 2,
    "Health_Need": 1,
    "Food_Need": 3,
    "Total_People": 21
  }
]
```

---

## 🚀 Deployment (N_MAPS Integration)

> **This ML server is not a standalone app.** It is designed to run on the **Command Center laptop** inside the N_MAPS ecosystem. SOS data is NOT read from a local file — it is pushed live by the ESP32 Gateway Node over the tactical WiFi network.

### Real Data Flow

```
Victim's Phone
     ↓  (connects to SENTINEL_RESCUE_SOS hotspot)
Edge Node (Arduino Mega + ESP8266)
     ↓  (encrypted SOS stored in victims.json)
Gateway Node (ESP32) — pulls via WiFi
     ↓  (sends JSON over USB Serial)
esp_bridge.py — Python serial bridge
     ↓  (POST to /predict)
This FastAPI ML Server  ←── You are here
     ↓  (city-wise resource summary)
Role-Based Command Dashboards
```

### Start the ML Server

```bash
cd ml_server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Once running, the N_MAPS ESP bridge (`esp_bridge.py` in [N_MAPS](https://github.com/aadilalisaiyed/N_MAPS)) sends live victim reports to `http://127.0.0.1:8000/predict` automatically.

### Test with Sample Data (Offline / Demo)

The `backend/` folder contains a Node.js test bridge that simulates ESP data using the included `data1.json` dataset — useful for **demoing the ML output** without hardware:

```bash
# Terminal 1 — start ML server
cd ml_server && uvicorn main:app --reload --port 8000

# Terminal 2 — run test bridge
cd backend && npm install && node server.js

# Terminal 3 — trigger prediction
curl -X POST http://localhost:3000/api/predict
```

> ⚠️ The `backend/` test bridge is for **demo/development only**. In a real N_MAPS deployment, the ESP bridge handles data delivery directly.

---

## 📡 API Reference

### `POST /predict`

Accepts live SOS report array from the ESP bridge (or test bridge):

```json
[
  {
    "count": 5,
    "situation": "Whole family stuck on roof.",
    "needs": "Rescue",
    "location": "Ranip, Ahmedabad"
  }
]
```

**Response** — city-wise aggregated resource demand:

```json
[
  {
    "city": "Ahmedabad",
    "Police_Need": 3,
    "Health_Need": 2,
    "Food_Need": 2,
    "Total_People": 18
  },
  {
    "city": "Gandhinagar",
    "Police_Need": 2,
    "Health_Need": 1,
    "Food_Need": 3,
    "Total_People": 21
  }
]
```

---

## 🔗 Part of the N_MAPS Ecosystem

This ML module is the intelligence layer of **RescueVault**, a larger disaster response system:

| Module | Repository | Description |
|---|---|---|
| 🛡️ **RescueVault (Main)** | [N_MAPS](https://github.com/aadilalisaiyed/N_MAPS) | Full system: hardware, firmware, dashboards |
| 🤖 **ML Engine** | **This repo** | Resource demand forecasting |
| 🔐 **Hardware Encryption** | [N_MAPS/Encryption](https://github.com/aadilalisaiyed/N_MAPS/tree/main/Encryption%20%3A%20Crypto%20Implementation) | FPGA SIMON/ASCON cipher |

---

## 🛠️ Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=100&section=footer" width="100%"/>
</div>
