'use client';

// FIX: Explicitly import all required React hooks here
import React, { useState, useEffect, useRef, useCallback } from 'react';

const PANVEL_CENTER = { lat: 18.9894, lng: 73.1175 };

const WORKSHOPS = [
  {
    id: 1,
    title: "Assistive Technology Bootcamp",
    category: "tech",
    icon: "💻",
    color: "#6c63ff",
    lat: 18.9940, lng: 73.1120,
    date: "March 8, 2026 · 10:00 AM",
    venue: "NMMC Community Hall, Panvel",
    description: "Hands-on training with screen readers, voice control & AAC devices for new users.",
    tags: ["Screen Reader", "Voice Control", "Free"],
    seats: 12, duration: "3 hrs",
    organizer: "EduAccess Foundation",
  },
  {
    id: 2,
    title: "Wheelchair Skills & Navigation",
    category: "mobility",
    icon: "♿",
    color: "#00c896",
    lat: 18.9870, lng: 73.1230,
    date: "March 10, 2026 · 2:00 PM",
    venue: "Panvel Municipal School No.4",
    description: "Manual & power wheelchair techniques, ramp navigation and campus self-advocacy.",
    tags: ["Wheelchair", "Navigation", "Self-Advocacy"],
    seats: 8, duration: "2.5 hrs",
    organizer: "Campus Mobility Alliance",
  },
  {
    id: 3,
    title: "Braille & Low Vision Reading Lab",
    category: "visual",
    icon: "👁",
    color: "#f59e0b",
    lat: 18.9920, lng: 73.1080,
    date: "March 12, 2026 · 9:30 AM",
    venue: "Panvel Public Library",
    description: "Grade 1 & 2 Braille, refreshable displays, and magnification strategies.",
    tags: ["Braille", "Low Vision", "Magnification"],
    seats: 15, duration: "4 hrs",
    organizer: "Vision Forward Society",
  },
  {
    id: 4,
    title: "Sign Language & Deaf Culture",
    category: "hearing",
    icon: "👂",
    color: "#ec4899",
    lat: 18.9850, lng: 73.1150,
    date: "March 14, 2026 · 1:00 PM",
    venue: "Kalamboli Community Center",
    description: "Beginner ISL, Deaf culture intro, cochlear implant orientation & live captioning.",
    tags: ["ISL", "Captioning", "Deaf Culture"],
    seats: 20, duration: "3 hrs",
    organizer: "Deaf Student Alliance",
  },
  {
    id: 5,
    title: "ADHD & Executive Function Strategies",
    category: "cognitive",
    icon: "🧠",
    color: "#10b981",
    lat: 18.9910, lng: 73.1195,
    date: "March 15, 2026 · 11:00 AM",
    venue: "Panvel Student Services Center",
    description: "Time management, task initiation & study organization for ADHD and LD students.",
    tags: ["ADHD", "Study Skills", "LD"],
    seats: 18, duration: "2 hrs",
    organizer: "NeuroAccess Collective",
  },
  {
    id: 6,
    title: "Anxiety & Disability Peer Support",
    category: "mental",
    icon: "💚",
    color: "#34d399",
    lat: 18.9960, lng: 73.1140,
    date: "March 17, 2026 · 4:00 PM",
    venue: "Wellness Center, New Panvel",
    description: "Facilitated peer group for students managing anxiety with physical/cognitive disabilities.",
    tags: ["Anxiety", "Peer Support", "Safe Space"],
    seats: 10, duration: "1.5 hrs",
    organizer: "Disability & Wellness Center",
  },
  {
    id: 7,
    title: "Voice-to-Text & AI Writing Tools",
    category: "tech",
    icon: "🎙",
    color: "#8b5cf6",
    lat: 18.9880, lng: 73.1060,
    date: "March 19, 2026 · 10:00 AM",
    venue: "Digital Lab, Panvel Tech Park",
    description: "Dragon NaturallySpeaking, Otter.ai & AI writing for students with motor/visual/LD.",
    tags: ["Voice-to-Text", "AI Tools", "Dragon"],
    seats: 14, duration: "2.5 hrs",
    organizer: "Inclusive Tech Hub",
  },
  {
    id: 8,
    title: "Autism & Sensory Wellbeing",
    category: "cognitive",
    icon: "🌟",
    color: "#f97316",
    lat: 19.0010, lng: 73.1200,
    date: "March 21, 2026 · 2:00 PM",
    venue: "Panvel Quiet Study Pavilion",
    description: "Sensory mapping, self-regulation & academic accommodations for autistic students.",
    tags: ["Autism", "Sensory", "Accommodations"],
    seats: 12, duration: "3 hrs",
    organizer: "Autism Campus Network",
  },
  {
    id: 9,
    title: "Adaptive Sports & Prosthetics Clinic",
    category: "mobility",
    icon: "🏅",
    color: "#06b6d4",
    lat: 18.9830, lng: 73.1260,
    date: "March 22, 2026 · 9:00 AM",
    venue: "Panvel Sports Complex",
    description: "Prosthetic limb care, adaptive sports options and Paralympic sports program intro.",
    tags: ["Prosthetics", "Adaptive Sports", "Paralympic"],
    seats: 16, duration: "4 hrs",
    organizer: "Adaptive Athletics Dept.",
  },
];

const CATEGORIES = [
  { key: "all", label: "All Workshops", icon: "📍" },
  { key: "tech", label: "Assistive Tech", icon: "💻" },
  { key: "mobility", label: "Mobility", icon: "♿" },
  { key: "visual", label: "Visual", icon: "👁" },
  { key: "hearing", label: "Hearing", icon: "👂" },
  { key: "cognitive", label: "Cognitive", icon: "🧠" },
  { key: "mental", label: "Mental Health", icon: "💚" },
];

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function WorkshopCard({ ws, isNearby, distKm, onSelect, selected }) {
  const dist = distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(2)} km`;
  return (
    <div
      onClick={() => onSelect(ws)}
      style={{
        background: selected ? `${ws.color}18` : "#1a2235",
        border: `1.5px solid ${selected ? ws.color : isNearby ? `${ws.color}55` : "#2a3550"}`,
        borderRadius: 14,
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.22s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isNearby && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: ws.color,
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 9px",
            borderRadius: 50,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          📍 Nearby
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{ws.icon}</span>
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1.3,
              color: "#e8edf5",
            }}
          >
            {ws.title}
          </div>
          <div style={{ fontSize: 11, color: ws.color, fontWeight: 600, marginTop: 2 }}>
            {ws.organizer}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11.5, color: "#7a8ba8", lineHeight: 1.6, marginBottom: 10 }}>
        {ws.description}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 5,
          marginBottom: 10,
        }}
      >
        {ws.tags.map((t) => (
          <span
            key={t}
            style={{
              background: `${ws.color}15`,
              border: `1px solid ${ws.color}30`,
              color: ws.color,
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 50,
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 10,
          borderTop: "1px solid #2a3550",
        }}
      >
        <div style={{ fontSize: 11, color: "#7a8ba8" }}>
          📅 {ws.date.split("·")[0].trim()}
        </div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: isNearby ? ws.color : "#7a8ba8",
          }}
        >
          ↔ {dist}
        </div>
      </div>
    </div>
  );
}

export default function PanvelGeofenceApp() {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const circleRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [userPos, setUserPos] = useState(null);
  const [radiusKm, setRadiusKm] = useState(2);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedWs, setSelectedWs] = useState(null);
  const [locStatus, setLocStatus] = useState("idle");
  const [geoAlert, setGeoAlert] = useState(null);

  // Load Leaflet CSS + JS dynamically
  useEffect(() => {
    if (window.L) { setLeafletLoaded(true); return; }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Init map once Leaflet is ready
  useEffect(() => {
    if (!leafletLoaded || leafletMap.current) return;
    const L = window.L;
    leafletMap.current = L.map(mapRef.current, {
      center: [PANVEL_CENTER.lat, PANVEL_CENTER.lng],
      zoom: 14,
      zoomControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "© OpenStreetMap contributors © CARTO",
        maxZoom: 19,
      }
    ).addTo(leafletMap.current);

    // Add all workshop markers immediately
    WORKSHOPS.forEach((ws) => addWorkshopMarker(ws));
  }, [leafletLoaded]);

  const addWorkshopMarker = useCallback((ws) => {
    if (!leafletMap.current || !window.L) return;
    const L = window.L;
    const icon = L.divIcon({
      className: "",
      html: `<div style="
        width:36px;height:36px;
        background:${ws.color};
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:2px solid #fff;
        box-shadow:0 3px 14px ${ws.color}80;
        display:flex;align-items:center;justify-content:center;
      "><span style="transform:rotate(45deg);font-size:16px;">${ws.icon}</span></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });

    const marker = L.marker([ws.lat, ws.lng], { icon }).addTo(leafletMap.current);
    marker.bindPopup(`
      <div style="font-family:'DM Sans',sans-serif;min-width:200px;color:#111">
        <div style="font-weight:700;font-size:14px;margin-bottom:4px;">${ws.icon} ${ws.title}</div>
        <div style="font-size:11px;color:#666;margin-bottom:6px;">${ws.venue}</div>
        <div style="font-size:11px;margin-bottom:4px;">📅 ${ws.date}</div>
        <div style="font-size:11px;margin-bottom:4px;">👤 ${ws.organizer}</div>
        <div style="font-size:11px;color:#888;">${ws.duration} · ${ws.seats} seats</div>
        <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">
          ${ws.tags.map((t) => `<span style="background:${ws.color}20;color:${ws.color};border:1px solid ${ws.color}40;font-size:10px;padding:2px 7px;border-radius:50px;">${t}</span>`).join("")}
        </div>
      </div>
    `);
    marker._wsId = ws.id;
    markersRef.current.push(marker);
  }, []);

  // Update geofence circle when user pos or radius changes
  useEffect(() => {
    if (!leafletMap.current || !window.L || !userPos) return;
    const L = window.L;
    if (circleRef.current) leafletMap.current.removeLayer(circleRef.current);
    circleRef.current = L.circle([userPos.lat, userPos.lng], {
      radius: radiusKm * 1000,
      color: "#00e5b4",
      fillColor: "#00e5b4",
      fillOpacity: 0.07,
      weight: 2,
      dashArray: "8 6",
    }).addTo(leafletMap.current);

    markersRef.current.forEach((m) => {
      const ws = WORKSHOPS.find((w) => w.id === m._wsId);
      if (!ws) return;
      const d = haversineKm(userPos.lat, userPos.lng, ws.lat, ws.lng);
      const el = m.getElement();
      if (el) {
        el.style.opacity = d <= radiusKm ? "1" : "0.35";
        el.style.transition = "opacity 0.4s";
      }
    });

    const nearby = WORKSHOPS.filter(
      (ws) => haversineKm(userPos.lat, userPos.lng, ws.lat, ws.lng) <= radiusKm
    );
    setGeoAlert(nearby.length);
  }, [userPos, radiusKm]);

  // Fly to selected workshop
  useEffect(() => {
    if (!selectedWs || !leafletMap.current) return;
    leafletMap.current.flyTo([selectedWs.lat, selectedWs.lng], 16, { duration: 1 });
    markersRef.current.forEach((m) => {
      if (m._wsId === selectedWs.id) m.openPopup();
    });
  }, [selectedWs]);

  function requestLocation() {
    setLocStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPos(p);
        setLocStatus("active");
        addUserMarker(p);
        leafletMap.current.flyTo([p.lat, p.lng], 14, { duration: 1.5 });
      },
      () => {
        const demo = { lat: 18.993, lng: 73.116 };
        setUserPos(demo);
        setLocStatus("demo");
        addUserMarker(demo);
        leafletMap.current.flyTo([demo.lat, demo.lng], 14, { duration: 1.5 });
      },
      { enableHighAccuracy: true, timeout: 7000 }
    );
  }

  function addUserMarker(pos) {
    if (!leafletMap.current || !window.L) return;
    const L = window.L;
    if (userMarkerRef.current) leafletMap.current.removeLayer(userMarkerRef.current);
    const icon = L.divIcon({
      className: "",
      html: `<div style="
        width:20px;height:20px;
        background:#fff;
        border-radius:50%;
        border:3px solid #6c63ff;
        box-shadow:0 0 0 6px rgba(108,99,255,0.25),0 0 20px #6c63ff80;
        animation:none;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    userMarkerRef.current = L.marker([pos.lat, pos.lng], { icon })
      .addTo(leafletMap.current)
      .bindPopup("<b>📍 Your Location</b><br>Panvel, Maharashtra");
  }

  const filteredWorkshops = WORKSHOPS.filter(
    (ws) => activeFilter === "all" || ws.category === activeFilter
  )
    .map((ws) => ({
      ...ws,
      distKm: userPos
        ? haversineKm(userPos.lat, userPos.lng, ws.lat, ws.lng)
        : haversineKm(PANVEL_CENTER.lat, PANVEL_CENTER.lng, ws.lat, ws.lng),
    }))
    .sort((a, b) => a.distKm - b.distKm);

  const nearbyCount = userPos
    ? WORKSHOPS.filter((ws) => haversineKm(userPos.lat, userPos.lng, ws.lat, ws.lng) <= radiusKm).length
    : 0;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0f1e", fontFamily: "'DM Sans', sans-serif", overflow: "hidden" }}>
      {/* Google Font imports */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #2a3550; border-radius: 10px; }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 8px 30px rgba(0,0,0,0.3) !important; }
        .leaflet-popup-tip { display: none; }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(0,229,180,0.5); }
          100% { box-shadow: 0 0 0 14px rgba(0,229,180,0); }
        }
        .ping { animation: pulseRing 1.5s ease-out infinite; }
      `}</style>

      {/* ── LEFT SIDEBAR ── */}
      <div style={{ width: 340, background: "#0d1424", borderRight: "1px solid #1e2d45", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #1e2d45" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: "#e8edf5", letterSpacing: -0.5 }}>
            Access<span style={{ color: "#00e5b4" }}>Map</span>
          </div>
          <div style={{ fontSize: 11, color: "#7a8ba8", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>
            Panvel · Disability Workshops
          </div>
        </div>

        {/* Location control */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e2d45" }}>
          <button
            onClick={requestLocation}
            disabled={locStatus === "loading"}
            style={{
              width: "100%",
              background: locStatus === "active" || locStatus === "demo" ? "rgba(0,229,180,0.1)" : "#6c63ff",
              border: `1.5px solid ${locStatus === "active" || locStatus === "demo" ? "#00e5b4" : "#6c63ff"}`,
              color: locStatus === "active" || locStatus === "demo" ? "#00e5b4" : "#fff",
              borderRadius: 10,
              padding: "10px 16px",
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
          >
            <span>{locStatus === "loading" ? "⏳" : locStatus === "active" ? "📍" : locStatus === "demo" ? "🗺" : "🎯"}</span>
            {locStatus === "loading" ? "Locating…" : locStatus === "active" ? "Location Active" : locStatus === "demo" ? "Demo Mode Active" : "Use My Location"}
          </button>

          {(locStatus === "active" || locStatus === "demo") && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#7a8ba8" }}>Geofence Radius</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#00e5b4" }}>{radiusKm} km</span>
              </div>
              <input
                type="range"
                min={0.5} max={10} step={0.5}
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#00e5b4", cursor: "pointer" }}
              />
              {geoAlert !== null && (
                <div style={{
                  marginTop: 10,
                  background: geoAlert > 0 ? "rgba(0,229,180,0.1)" : "rgba(255,107,107,0.08)",
                  border: `1px solid ${geoAlert > 0 ? "rgba(0,229,180,0.3)" : "rgba(255,107,107,0.2)"}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 12,
                  color: geoAlert > 0 ? "#00e5b4" : "#ff6b6b",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <span>{geoAlert > 0 ? "🎯" : "🔍"}</span>
                  <span>{geoAlert > 0 ? `${geoAlert} workshop${geoAlert > 1 ? "s" : ""} within ${radiusKm} km` : `No workshops within ${radiusKm} km — try expanding`}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Category filters */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid #1e2d45", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveFilter(c.key)}
              style={{
                background: activeFilter === c.key ? "rgba(0,229,180,0.12)" : "transparent",
                border: `1px solid ${activeFilter === c.key ? "#00e5b4" : "#2a3550"}`,
                color: activeFilter === c.key ? "#00e5b4" : "#7a8ba8",
                borderRadius: 50,
                padding: "4px 11px",
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Workshop list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 11, color: "#7a8ba8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4, paddingLeft: 4 }}>
            {filteredWorkshops.length} Workshop{filteredWorkshops.length !== 1 ? "s" : ""}{userPos ? ` — sorted by distance` : ""}
          </div>
          {filteredWorkshops.map((ws) => (
            <WorkshopCard
              key={ws.id}
              ws={ws}
              isNearby={userPos ? ws.distKm <= radiusKm : false}
              distKm={ws.distKm}
              onSelect={setSelectedWs}
              selected={selectedWs?.id === ws.id}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid #1e2d45", fontSize: 10, color: "#3a4a60", textAlign: "center" }}>
          AccessMap · Panvel, Maharashtra · Inclusive Education Initiative
        </div>
      </div>

      {/* ── MAP AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Map top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          zIndex: 1000,
          background: "linear-gradient(to bottom, rgba(10,15,30,0.9) 0%, transparent 100%)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="ping" style={{ width: 8, height: 8, borderRadius: "50%", background: "#00e5b4", boxShadow: "0 0 8px #00e5b4" }}></div>
            <span style={{ color: "#e8edf5", fontSize: 13, fontWeight: 600 }}>
              Panvel, Maharashtra — Live Map
            </span>
          </div>
          {selectedWs && (
            <div style={{
              background: `${selectedWs.color}20`,
              border: `1px solid ${selectedWs.color}50`,
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              color: selectedWs.color,
              fontWeight: 600,
              pointerEvents: "auto",
              cursor: "pointer",
            }} onClick={() => setSelectedWs(null)}>
              {selectedWs.icon} {selectedWs.title} ✕
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{
          position: "absolute", bottom: 24, right: 16,
          zIndex: 1000,
          background: "rgba(10,15,30,0.88)",
          border: "1px solid #1e2d45",
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 11,
          color: "#7a8ba8",
          backdropFilter: "blur(8px)",
        }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#e8edf5", marginBottom: 8, fontSize: 12 }}>Legend</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", border: "2px solid #6c63ff", boxShadow: "0 0 8px #6c63ff60" }}></div>
            <span>Your Location</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#00e5b4", opacity: 0.7 }}></div>
            <span>In geofence range</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#7a8ba8", opacity: 0.4 }}></div>
            <span>Out of range</span>
          </div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #1e2d45", color: "#4a5a70" }}>
            Dashed circle = geofence
          </div>
        </div>

        {/* Leaflet map container */}
        <div ref={mapRef} style={{ flex: 1, width: "100%", background: "#111" }} />

        {!leafletLoaded && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "#0a0f1e", color: "#7a8ba8", fontSize: 14,
            flexDirection: "column", gap: 12,
          }}>
            <div style={{ width: 36, height: 36, border: "3px solid #1e2d45", borderTopColor: "#00e5b4", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
            Loading Panvel Map…
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
      </div>
    </div>
  );
}