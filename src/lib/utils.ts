import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatTimeOnly(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function generateGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
}

export function generateWhatsAppEmergencyUrl(phone: string, mapsUrl: string, userName?: string): string {
  // Clean phone number (remove spaces, dashes)
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const senderText = userName ? `${userName} through Aman Safar` : 'Aman Safar user';
  const text = encodeURIComponent(
    `EMERGENCY ALERT: I need immediate assistance! I am sending this safety alert via Aman Safar.\n\nMy current location: ${mapsUrl}\n\nPlease reach out or check on me right away. (Sent by: ${senderText})`
  );
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

export function generateSmsEmergencyUrl(phone: string, mapsUrl: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  const body = encodeURIComponent(
    `EMERGENCY: I need help! My current location: ${mapsUrl} - Aman Safar safety alert`
  );
  // Compatible with both iOS and Android sms URI scheme
  return `sms:${cleanPhone}?body=${body}`;
}

export function generateTelUrl(phone: string): string {
  const cleanPhone = phone.replace(/[^0-9+]/g, '');
  return `tel:${cleanPhone}`;
}
