/**
 * StudyMate AI - Direct API Connector
 * Menggunakan fetch langsung ke API v1 untuk kompatibilitas lebih luas tanpa VPN.
 */

const getMockResponse = (mode, subject, message) => {
  // ... (tetap simpan logic mock sebagai cadangan terakhir)
  const msg = message.toLowerCase().trim();
  if (msg.match(/^[0-9+\-*/\s().]+$/)) {
    try { return `Hasil dari **${message}** adalah **${eval(msg)}**.`; } catch (e) {}
  }
  if (msg.includes('sin') || msg.includes('cos') || msg.includes('tan')) {
    return `### Trigonometri\nSin, Cos, dan Tan adalah perbandingan sisi segitiga siku-siku.\n- **Sin**: Depan/Miring\n- **Cos**: Samping/Miring\n- **Tan**: Depan/Samping`;
  }
  return `Maaf, saya sedang dalam mode simulasi karena koneksi API terganggu. Topik "${message}" sangat menarik untuk dibahas di ${subject}!`;
};

export const chatWithAI = async (apiKey, mode, history, message, subject) => {
  if (!apiKey) return getMockResponse(mode, subject, message);

  try {
    // Menggunakan Proxy Gateway untuk menembus blokir ISP lokal
    const PROXY_URL = "https://corsproxy.io/?";
    const TARGET_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const API_URL = PROXY_URL + encodeURIComponent(TARGET_URL);
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `You are a professional study tutor for ${subject}. Mode: ${mode}. Answer the student's question clearly.` }]
          },
          {
            role: "model",
            parts: [{ text: "Understood. I am ready." }]
          },
          ...history.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
          })),
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Direct API Error:", error);
    return getMockResponse(mode, subject, message) + "\n\n*(Catatan: Smart AI gagal terhubung. Jika Anda di Indonesia, Google sering memblokir akses API ini secara langsung.)*";
  }
};
