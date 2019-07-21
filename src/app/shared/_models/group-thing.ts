
export enum FileType {
  ongoing_payment = 'רגיל/ שוטף', // 1
  fix = 'תיקון תנועות(2)', // 2
  fix_with_payment = 'תיקון תנועות והפקדות', // 3
  payment_only = 'הפקדה בלבד', // 8
  overpay_withdrawal = 'בקשה להחזר תשלום(5)', // 5
  withdraw_to_pending = 'החזר לפנדינג(6)', // 6
}

