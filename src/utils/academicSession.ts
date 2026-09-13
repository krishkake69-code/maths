/**
 * Dynamic Academic Session & WhatsApp Messaging Utilities
 * Automatically computes real-time academic session years based on the current date
 */

export interface AcademicSessionInfo {
  currentDate: Date;
  currentYear: number;
  currentSession: string;       // e.g. "2026-2027"
  nextSession: string;          // e.g. "2027-2028"
  twoYearSession: string;       // e.g. "2026-2028"
  sessionLabel: string;         // e.g. "Session 2026-2027"
  admissionHeadline: string;    // e.g. "ADMISSIONS OPEN FOR SESSION 2026-2027"
  formattedDate: string;        // e.g. "13 Sep 2026"
}

export function getAcademicSessionInfo(date: Date = new Date()): AcademicSessionInfo {
  const currentYear = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 3 = April, 8 = Sep, 11 = Dec

  // In India (CBSE / ISC / IIT-JEE), academic cycle starts around April (month index >= 3).
  // Between April and December, active session is Year-(Year+1) (e.g. Sept 2026 -> Session 2026-2027).
  // In Jan-March (0,1,2), the ongoing session is (Year-1)-Year, but upcoming admissions are for Year-(Year+1).
  const sessionStartYear = month >= 3 ? currentYear : currentYear - 1;
  const sessionEndYear = sessionStartYear + 1;
  const currentSession = `${sessionStartYear}-${sessionEndYear}`;
  const nextSession = `${sessionStartYear + 1}-${sessionStartYear + 2}`;
  const twoYearSession = `${sessionStartYear}-${sessionStartYear + 2}`;

  return {
    currentDate: date,
    currentYear,
    currentSession,
    nextSession,
    twoYearSession,
    sessionLabel: `Session ${currentSession}`,
    admissionHeadline: `ADMISSIONS OPEN FOR SESSION ${currentSession}`,
    formattedDate: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };
}

/**
 * Returns dynamic automated WhatsApp inquiry messages that always reflect the current date & session
 */
export function getDynamicWhatsAppMessages(phone: string = '9911667462') {
  const cleanPhone = phone.replace(/[^0-9]/g, '') || '919911667462';
  const fullCleanPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const { currentSession, formattedDate } = getAcademicSessionInfo();

  const baseInquiryMsg = `Hello Rehman Sir! I would like to inquire about REHMAN CLASSES batches (Class IX-XII & IIT-JEE) for Session ${currentSession} (Inquiry date: ${formattedDate}).`;

  const sampleQuestions = [
    {
      text: `🗓️ Class XI / XII Batch Timings (7:00 - 8:30 PM)`,
      msg: `Hi Rehman Sir! I want to enroll for the Class XI / XII Mathematics batch for Session ${currentSession}. Could you please share the syllabus schedule and batch seat status?`
    },
    {
      text: `📚 Class IX / X Maths & Science (4:00 - 6:00 PM)`,
      msg: `Hi Rehman Sir! I want to inquire about the Class IX / X Mathematics & Science batch for Session ${currentSession}.`
    },
    {
      text: `📍 Center Visit & Demo Class (D-48 Mahendra Enclave)`,
      msg: `Hi Rehman Sir! I would like to visit the center at D-48 Mahendra Enclave (Near Silver Shine School, Shastri Nagar, Ghaziabad) for Session ${currentSession} demo class and counseling.`
    },
    {
      text: `🎯 IIT-JEE Mains & Advanced Target Batch`,
      msg: `Hi Rehman Sir! I am interested in joining the IIT-JEE Advanced Mathematics batch for Session ${currentSession}.`
    }
  ];

  const getWhatsAppUrl = (customMsg?: string) => {
    const text = customMsg || baseInquiryMsg;
    return `https://wa.me/${fullCleanPhone}?text=${encodeURIComponent(text)}`;
  };

  return {
    currentSession,
    formattedDate,
    baseInquiryMsg,
    sampleQuestions,
    getWhatsAppUrl
  };
}
