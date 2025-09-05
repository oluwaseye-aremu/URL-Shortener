# 🔗 URL Shortener (Dockerized)

A simple **URL Shortener service** built with **Node.js + Express + MongoDB**, containerized using **Docker Compose**.  
This project lets you shorten long URLs and access them via a unique short code.

---

## 📐 Architecture

```mermaid
flowchart LR
  A[Client] -->|HTTP Requests| B[Express App]
  B -->|CRUD| C[(MongoDB Database)]
