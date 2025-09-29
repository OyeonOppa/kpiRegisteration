  // --- เปลี่ยนเป็น URL /exec ของคุณ ---
  const scriptURL = "https://script.google.com/macros/s/AKfycbx6DNkSTBuUEXuXHja2oYLt6DE_3K6k9VKNk8nKV9-YQBlxY8reaAP1lzmPjC4NWmYa/exec";

  const form = document.getElementById("registerForm");
  const responseMessage = document.getElementById("responseMessage");
  const qrArea = document.getElementById("qrArea");
  const statusText = document.getElementById("statusText");
  const uidText = document.getElementById("uidText");
  const emailText = document.getElementById("emailText");
  const phoneText = document.getElementById("phoneText");

  document.addEventListener("DOMContentLoaded", () => {
    const bringCar = document.getElementById("bringCar");
    const carPlateBox = document.getElementById("carPlateBox");
    const attendAfternoon = document.getElementById("attendAfternoon");
    const seminarRooms = document.getElementById("seminarRooms");
    const prefix = document.getElementById("prefix");
    const customPrefixBox = document.getElementById("customPrefixBox");
    const customPrefix = document.getElementById("customPrefix");

    // รถ
    bringCar.addEventListener("change", () => {
      if (bringCar.value === "Yes") {
        carPlateBox.classList.remove("d-none");
      } else {
        carPlateBox.classList.add("d-none");
      }
    });

    // ช่วงบ่าย
    attendAfternoon.addEventListener("change", () => {
      if (attendAfternoon.value === "Yes") {
        seminarRooms.classList.remove("d-none");
      } else {
        seminarRooms.classList.add("d-none");
      }
    });

    // Prefix อื่น ๆ
    prefix.addEventListener("change", () => {
      if (prefix.value === "Other") {
        customPrefixBox.classList.remove("d-none");
        customPrefix.setAttribute("required", "required");
      } else {
        customPrefixBox.classList.add("d-none");
        customPrefix.removeAttribute("required");
      }
    });
  });

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    responseMessage.innerHTML = `<div class="alert alert-info p-2">Registering... Please wait.</div>`;
    qrArea.innerHTML = `<div class="muted-small">Generating QR Code…</div>`;
    statusText.textContent = "Processing...";
    uidText.textContent = "-";

    const fd = new FormData(form);

    try {
      const res = await fetch(scriptURL, { method: "POST", body: fd });
      let data;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = {
            success: text === "Success" || text.toLowerCase().includes("success"),
            raw: text,
          };
        }
      }

      if (data.success) {
        responseMessage.innerHTML = `<div class="alert alert-success p-2">✅ Registration Completed Successfully</div>`;
        statusText.textContent = "Registered";
        uidText.textContent = data.uid || "-";
        emailText.textContent = form.email.value || "-";
        phoneText.textContent = form.phone.value || "-";

        // แสดง QR
        const qrUrl =
          data.qrUrl ||
          (data.qr &&
            (data.qr.startsWith("http")
              ? data.qr
              : "https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=" +
                encodeURIComponent(data.qr)));
        if (qrUrl) {
          qrArea.innerHTML = `<img src="${qrUrl}" alt="QR Code" style="width:200px;height:200px;border-radius:8px;">`;
        } else {
          qrArea.innerHTML = `<div class="muted-small">ไม่พบ QR</div>`;
        }

        form.reset();

        // reset hidden fields state
        document.getElementById("carPlateBox").classList.add("d-none");
        document.getElementById("seminarRooms").classList.add("d-none");
        document.getElementById("customPrefixBox").classList.add("d-none");

      } else {
        responseMessage.innerHTML = `<div class="alert alert-danger p-2">❌ เกิดข้อผิดพลาด: ${
          data.message || JSON.stringify(data)
        }</div>`;
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