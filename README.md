# SafeTether

**Accessibility-first anti-theft tracker for people with disabilities.**

A small tag on your bag and an anchor on your wrist measure the distance between them with Ultra-Wideband radio. If your item moves more than 1 meter away, the anchor asks you if you knew. If you didn't, it vibrates and shows where the item is. No smartphone needed.

> Status: working prototype (October 2026). Not yet tested with users.

---

## Why

- People with disabilities are robbed about **5× as often** as people without disabilities (Harrell, 2021, U.S. Bureau of Justice Statistics).
- Trackers like AirTag are built to find a *lost* item later, through a phone notification. They don't warn a blind, deaf, or wheelchair-using person *during* a theft.

## How it works

| Distance (tag to anchor) | Status | What happens |
| --- | --- | --- |
| **Under 100 cm** | 🟢 Green | Nothing, the item is with you |
| **Over 100 cm** | 🔴 Red | The anchor asks: *"Did you know your item is more than 1 meter away?"* |

- **Yes** → status goes back to green.
- **No** → the anchor vibrates and shows the item's location.

## Live demo

The web interface shows the live distance and the green/red status from Firebase.

- **Website:** [ADD LINK TO THE DASHBOARD]
- **Demo login:**
  - Email: `habibguliyevv@gmail.com`
  - Password: `inthewaytothestates983`

> Viewing the dashboard requires access in our Firebase database. To save you from asking us and waiting for a reply, use this demo account; it is the only account that can view the dashboard without permission from us.

> If the prototype boards are turned off, the site shows **"No connection"**. That is expected: the dashboard only shows data while the hardware is running.

![Dashboard, green: under 100 cm](images/dashboard-green.png)
![Dashboard, red: over 100 cm](images/dashboard-red.png)

## Hardware

- 2 × **Makerfabs MaUWB_ESP32S3** (ESP32-S3 + DW3000 UWB radio): one tag, one anchor
- 3.7 V LiPo battery for each board
- Vibration motor on the anchor (2N3904 transistor, 270 Ω resistor, 1N4007 diode)

**Why UWB, not GPS?** Our first prototype used GPS. It lost its signal indoors and is only accurate to about 5 m. UWB measures tag-to-anchor distance directly, indoors or out, to about 10 cm.

## Software

Two Arduino (C++) sketches, one per board. Both talk to the UWB radio through AT commands over a serial link (115,200 baud).

| File | Board | What it does |
| --- | --- | --- |
| `esp32s3_at_a0.ino` | **A0, the anchor**: always with the user | Sets the board up as the anchor and passes the UWB radio's messages to the serial monitor |
| `esp32s3_at_t0.ino` | **T0, a tag**: on the item | Reads each `AT+RANGE` message, takes the distance, and sends it to Firebase at `/distance` when it changes |

- **More items:** the system supports up to 64 tags (`UWB_TAG_COUNT 64`). Each new item gets its own tag: T1, T2, and so on.
- **Database:** Firebase Realtime Database, value `/distance` (in cm).
- **Dashboard:** a web page that reads `/distance` and shows green (under 100 cm) or red (over 100 cm).

```
SafeTether/
├── firmware/
│   ├── esp32s3_at_a0/esp32s3_at_a0.ino   # anchor (A0)
│   └── esp32s3_at_t0/esp32s3_at_t0.ino   # tag (T0)
├── web/           # Dashboard website
├── images/        # Photos and screenshots
└── README.md
```

## Run it yourself

1. Install the Arduino IDE and the ESP32 board package. Choose the board **ESP32S3 Dev Module**.
2. Install the libraries: `Firebase ESP Client`, `Adafruit SSD1306`, `Adafruit GFX`.
3. Copy `firmware/secrets.example.h` to `firmware/secrets.h` and enter your own Wi-Fi name, Wi-Fi password, and Firebase keys.
4. Upload `esp32s3_at_a0.ino` to the anchor board and `esp32s3_at_t0.ino` to the tag board. For each extra tag, change `UWB_INDEX` (T1 = 1, T2 = 2, …).

## Team

- **Habib Guliyev**: founder, hardware, firmware, research
- **Tural Suleymanov**: mentor ([SUMbuilders](https://www.instagram.com/sumbuilders/))

## Research

*SafeTether: Accessibility-First Anti-Theft Tracker. Pilot Study Protocol* (October 2026). [ADD LINK TO THE PDF]

Portfolio: [habibguliyev.com](https://habibguliyev.com)
