<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=180&section=header&text=RescueVault%20ML%20Engine&fontSize=40&fontColor=ffffff&fontAlignY=38&desc=Disaster%20Resource%20Demand%20Forecaster%20%7C%20Part%20of%20N_MAPS&descSize=16&descAlignY=58&animation=fadeIn" width="100%"/>

<br/>

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Node.js](https://img.shields.io/badge/Node.js-Bridge-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

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

## 🚀 Running Locally

### 1. ML Server (FastAPI)

```bash
cd ml_server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API will be live at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### 2. Node.js Bridge (Express)

```bash
cd backend
npm install
node server.js
```

Bridge runs at `http://localhost:3000`

### 3. Trigger a Prediction

```bash
curl -X POST http://localhost:3000/api/predict
```

The bridge reads `ml_server/data/data1.json`, forwards it to the Python ML server, and returns the city-wise resource summary.

---

## 📡 API Reference

### `POST /predict` (ML Server — port 8000)

**Request body:** Array of SOS report objects
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

**Response:**
```json
[
  {
    "city": "Ahmedabad",
    "Police_Need": 3,
    "Health_Need": 2,
    "Food_Need": 2,
    "Total_People": 18
  }
]
```

---

### `POST /api/predict` (Node Bridge — port 3000)

No body required. Reads dataset automatically and returns the same ML output.

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

## 👤 Author

**Aadilali Saiyed**  
Engineering Student · Rashtriya Raksha University, Gandhinagar  
Secretary, IEEE Student Branch · 3rd @ HackTheSpring'26 HackX

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/aadil-saiyed-31a471330/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/aadilalisaiyed)
[![Email](https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:aadil.saiyed0327@gmail.com)

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=100&section=footer" width="100%"/>
</div>
