// สร้างข้อความ QR พร้อมเพย์ (มาตรฐาน EMVCo / Thai QR Payment) พร้อมจำนวนเงิน

function field(id: string, value: string) {
  return id + value.length.toString().padStart(2, "0") + value;
}

function crc16(data: string) {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** id = เบอร์มือถือ (10 หลัก) หรือเลขผู้เสียภาษี/บัตรประชาชน (13 หลัก) */
export function promptPayPayload(id: string, amount: number) {
  const digits = id.replace(/\D/g, "");
  const account =
    digits.length >= 13
      ? field("02", digits)
      : field("01", ("0000000000000" + digits.replace(/^0/, "66")).slice(-13));

  const body =
    field("00", "01") +
    field("01", "12") +
    field("29", field("00", "A000000677010111") + account) +
    field("58", "TH") +
    field("53", "764") +
    field("54", amount.toFixed(2));

  const withCrcTag = body + "6304";
  return withCrcTag + crc16(withCrcTag);
}
