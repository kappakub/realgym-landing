export const LINE_ID = "@RealGymSF";
export const LINE_URL = `https://line.me/R/ti/p/${LINE_ID}`;
export const PHONE = "096-757-5911";
export const PHONE_URL = "tel:0967575911";
export const FACEBOOK_URL = "https://www.facebook.com/RealgymKhlongSamWa/";
export const MESSENGER_URL = "https://m.me/RealgymKhlongSamWa";
export const YOUTUBE_URL = "https://www.youtube.com/@realgym7161";

/** ลิงก์เปิดแชท LINE พร้อมข้อความที่พิมพ์ไว้ให้แล้ว */
export function lineMessageUrl(text: string) {
  return `https://line.me/R/oaMessage/${LINE_ID}/?text=${encodeURIComponent(text)}`;
}

export const branches = [
  { name: "ซาฟารี (คลองสามวา)", phone: "0967575911", lat: 13.8578353, lng: 100.6975252 },
  { name: "พระราม 5", phone: "0956488964", lat: 13.8370501, lng: 100.5069725 },
  { name: "สุขาภิบาล 5", phone: "0960089287", lat: 13.8872164, lng: 100.6540514 },
  { name: "สายไหม", phone: "0971035198", lat: 13.9200666, lng: 100.6678282 },
  { name: "เลียบด่วน", phone: "0839755547", lat: 13.844769, lng: 100.63537 },
  { name: "อุดมสุข", phone: "0962478257", lat: 13.679669, lng: 100.614423 },
  { name: "แจ้งวัฒนะ", phone: "0851666599", lat: 13.8929092, lng: 100.5643521 },
];

export const classes = [
  { name: "HYROX", tag: "Race Ready", desc: "วิ่งผสม Functional Workout สำหรับสาย Hybrid" },
  { name: "BODY PUMP", tag: "Strength", desc: "เวทเทรนนิ่งแบบกลุ่ม กระชับทั้งร่างกาย" },
  { name: "ZUMBA", tag: "Dance", desc: "เต้นสนุก เบิร์นเพลิน ไม่มีเบื่อ" },
  { name: "YOGA", tag: "Mind & Body", desc: "ยืดเหยียด ผ่อนคลาย เพิ่มสมดุลร่างกาย" },
  { name: "PILATES", tag: "Mind & Body", desc: "เสริมแกนกลาง ปรับบุคลิก" },
  { name: "BODY COMBAT", tag: "Combat", desc: "คาร์ดิโอผสมท่าต่อสู้ สุดมันส์" },
  { name: "TRX", tag: "Functional", desc: "ฝึกแรงและการทรงตัวด้วยน้ำหนักตัว" },
  { name: "BJJ", tag: "Combat", desc: "ฝึกการต่อสู้ ควบคุมร่างกาย เพิ่มความมั่นใจ" },
];
