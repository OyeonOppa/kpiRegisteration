  // --- เปลี่ยนเป็น URL /exec ของคุณ ---
  const scriptURL = "https://script.google.com/macros/s/AKfycbx6DNkSTBuUEXuXHja2oYLt6DE_3K6k9VKNk8nKV9-YQBlxY8reaAP1lzmPjC4NWmYa/exec";

  const form = document.getElementById('registerForm');
  const responseMessage = document.getElementById('responseMessage');
  const qrArea = document.getElementById('qrArea');
  const statusText = document.getElementById('statusText');
  const uidText = document.getElementById('uidText');
  const emailText = document.getElementById('emailText');
  const phoneText = document.getElementById('phoneText');

document.addEventListener("DOMContentLoaded", () => {
  const bringCar = document.getElementById("bringCar");
  const carPlateBox = document.getElementById("carPlateBox");
  const attendAfternoon = document.getElementById("attendAfternoon");
  const seminarRooms = document.getElementById("seminarRooms");

  bringCar.addEventListener("change", () => {
    if (bringCar.value === "ใช่") {
      carPlateBox.classList.remove("d-none");
    } else {
      carPlateBox.classList.add("d-none");
    }
  });

  attendAfternoon.addEventListener("change", () => {
    if (attendAfternoon.value === "ใช่") {
      seminarRooms.classList.remove("d-none");
    } else {
      seminarRooms.classList.add("d-none");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const prefix = document.getElementById("prefix");
  const customPrefixBox = document.getElementById("customPrefixBox");

  prefix.addEventListener("change", () => {
    if (prefix.value === "อื่นๆ") {
      customPrefixBox.classList.remove("d-none");
      document.getElementById("customPrefix").setAttribute("required", "required");
    } else {
      customPrefixBox.classList.add("d-none");
      document.getElementById("customPrefix").removeAttribute("required");
    }
  });

  // โค้ดส่วนรถ + ห้องสัมมนา ที่ผมให้ไว้ก่อนหน้านี้ยังใช้ได้เหมือนเดิม
});



  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    responseMessage.innerHTML = `<div class="alert alert-info p-2">กำลังลงทะเบียน... กรุณารอสักครู่</div>`;
    qrArea.innerHTML = `<div class="muted-small">กำลังสร้าง QR…</div>`;
    statusText.textContent = "กำลังประมวลผล...";
    uidText.textContent = "-";

    const fd = new FormData(form);

    try {
      const res = await fetch(scriptURL, { method: 'POST', body: fd });
      let data;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        try { data = JSON.parse(text); } catch { data = { success: (text === 'Success' || text.toLowerCase().includes('success')), raw: text }; }
      }

      if (data.success) {
        responseMessage.innerHTML = `<div class="alert alert-success p-2">✅ ลงทะเบียนสำเร็จแล้ว</div>`;
        statusText.textContent = "ลงทะเบียนแล้ว";
        uidText.textContent = data.uid || "-";
        emailText.textContent = form.email.value || "-";
        phoneText.textContent = form.phone.value || "-";

        // แสดง QR
        const qrUrl = data.qrUrl || (data.qr && (data.qr.startsWith('http') ? data.qr : "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" + encodeURIComponent(data.qr)));
        if (qrUrl) {
          qrArea.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="width:200px;height:200px;border-radius:8px;">`;
        } else {
          qrArea.innerHTML = `<div class="muted-small">ไม่พบ QR</div>`;
        }

        form.reset();
      } else {
        responseMessage.innerHTML = `<div class="alert alert-danger p-2">❌ เกิดข้อผิดพลาด: ${data.message || JSON.stringify(data)}</div>`;
        statusText.textContent = "เกิดข้อผิดพลาด";
        qrArea.innerHTML = `<div class="muted-small">ไม่สามารถสร้าง QR</div>`;
      }

    } catch (err) {
      console.error(err);
      responseMessage.innerHTML = `<div class="alert alert-danger p-2">❌ เกิดข้อผิดพลาด (network): ${err.message}</div>`;
      statusText.textContent = "ข้อผิดพลาดเครือข่าย";
      qrArea.innerHTML = `<div class="muted-small">ไม่สามารถเชื่อมต่อ</div>`;
    }
  });